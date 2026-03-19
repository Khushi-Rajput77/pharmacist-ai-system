/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Get all medicines
 *     tags: [Medicines]
 *     responses:
 *       200:
 *         description: List of all medicines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medicine'
 *   post:
 *     summary: Create a new medicine
 *     tags: [Medicines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - dosage
 *               - currentStock
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aspirin
 *               genericName:
 *                 type: string
 *                 example: Acetylsalicylic acid
 *               dosage:
 *                 type: string
 *                 example: 500mg
 *               currentStock:
 *                 type: number
 *                 example: 100
 *               price:
 *                 type: number
 *                 example: 15
 *               prescriptionRequired:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Medicine created successfully
 *       400:
 *         description: Medicine already exists or validation error
 *
 * /api/medicines/{id}:
 *   get:
 *     summary: Get single medicine by ID
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Medicine ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Medicine found
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Medicine not found
 *   patch:
 *     summary: Update medicine
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dosage:
 *                 type: string
 *               currentStock:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Medicine updated
 *       404:
 *         description: Medicine not found
 *   delete:
 *     summary: Delete medicine
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicine deleted
 *       404:
 *         description: Medicine not found
 *
 * /api/medicines/search/{name}:
 *   get:
 *     summary: Search medicines by name
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Medicine name to search
 *     responses:
 *       200:
 *         description: List of matching medicines
 *
 * components:
 *   schemas:
 *     Medicine:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         name:
 *           type: string
 *         genericName:
 *           type: string
 *         dosage:
 *           type: string
 *         currentStock:
 *           type: number
 *         price:
 *           type: number
 *         prescriptionRequired:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */

const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const mongoose = require('mongoose');

// GET all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single medicine by ID
router.get('/:id', async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid medicine ID format: ${req.params.id}`
      });
    }

    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ 
        success: false, 
        error: 'Medicine not found' 
      });
    }
    
    res.json({ success: true, data: medicine });
  } catch (error) {
    console.error('Error fetching medicine:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET medicines by name (search)
router.get('/search/:name', async (req, res) => {
  try {
    const medicines = await Medicine.find({ 
      name: new RegExp(req.params.name, 'i') 
    });
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (error) {
    console.error('Error searching medicines:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE medicine
router.post('/', async (req, res) => {
  try {
    // Check duplicate
    const existingMedicine = await Medicine.findOne({ name: req.body.name });
    if (existingMedicine) {
      return res.status(400).json({
        success: false,
        error: `Medicine "${req.body.name}" already exists!`,
        existingId: existingMedicine._id
      });
    }

    // ✅ FIX: Don't manually set _id - let MongoDB auto-generate it!
    const medicineData = { ...req.body };
    delete medicineData._id;

    const medicine = new Medicine(medicineData);
    await medicine.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Medicine created successfully',
      data: medicine 
    });
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// UPDATE medicine
router.patch('/:id', async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid medicine ID format: ${req.params.id}`
      });
    }

    // ✅ FIX: Don't update _id field
    const updateData = { ...req.body };
    delete updateData._id;

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        error: 'Medicine not found'
      });
    }

    res.json({ success: true, data: medicine });
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE medicine
router.delete('/:id', async (req, res) => {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid medicine ID format: ${req.params.id}`
      });
    }

    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        error: 'Medicine not found'
      });
    }

    res.json({ success: true, message: 'Medicine deleted' });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;