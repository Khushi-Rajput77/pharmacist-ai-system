import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PrescriptionUpload.css';

/**
 * Prescription Upload Component
 * Features:
 * - File upload (image/PDF)
 * - Preview before upload
 * - OCR processing (extract text)
 * - Store prescriptions
 * - List uploaded prescriptions
 */
function PrescriptionUpload({ customerId }) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedPrescriptions, setUploadedPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [extractedMedicines, setExtractedMedicines] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [processingStep, setProcessingStep] = useState('');

  // Load prescriptions from localStorage on mount
  useEffect(() => {
    loadPrescriptions();
  }, [customerId]);

  /**
   * Load prescriptions from localStorage
   */
  const loadPrescriptions = () => {
    try {
      const stored = localStorage.getItem(`prescriptions_${customerId}`);
      if (stored) {
        setUploadedPrescriptions(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading prescriptions:', err);
    }
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('❌ Invalid file type. Please upload JPG, PNG, WebP, or PDF');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('❌ File too large. Maximum size is 5MB');
      return;
    }

    setError('');
    setSelectedFile(file);
    setOcrText('');
    setExtractedMedicines([]);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (file.type === 'application/pdf') {
        setPreview({ type: 'pdf', data: event.target.result });
      } else {
        setPreview({ type: 'image', data: event.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  /**
   * Process image with OCR using Tesseract.js
   */
  const processOCR = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setProcessingStep('🔄 Initializing OCR engine...');

    try {
      // Dynamically import Tesseract.js
      const Tesseract = (await import('tesseract.js')).default;

      setProcessingStep('📖 Reading document...');

      // Create a canvas for image processing
      const canvas = await createCanvasFromFile(selectedFile);

      setProcessingStep('🔍 Extracting text from prescription...');

      // Perform OCR
      const result = await Tesseract.recognize(canvas, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing') {
            const progress = Math.round(m.progress * 100);
            setProcessingStep(`🔍 Extracting text... ${progress}%`);
          }
        },
      });

      const extractedText = result.data.text;
      setOcrText(extractedText);

      setProcessingStep('💊 Analyzing medicines...');

      // Extract medicine names (simple pattern matching)
      const medicines = extractMedicinesFromText(extractedText);
      setExtractedMedicines(medicines);

      setProcessingStep('✅ Complete!');
      setTimeout(() => setProcessingStep(''), 2000);

      setSuccessMessage('✅ OCR processing completed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('OCR error:', err);
      setError(`❌ OCR processing failed: ${err.message}`);
      setProcessingStep('');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create canvas from file for OCR processing
   */
  const createCanvasFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  /**
   * Extract medicine names from OCR text
   */
  const extractMedicinesFromText = (text) => {
    // Common medicine names pattern
    const medicinePatterns = [
      /\b([A-Z][a-z]+)\s*(?:\d+\s*(?:mg|ml|mcg|%))?(?:\s*(?:tablet|tab|capsule|syrup|solution|cream|drops|injection|powder))?/g,
    ];

    const medicines = new Set();
    const words = text.split(/\s+/);

    // Extract potential medicine names (capitalized words)
    words.forEach((word) => {
      // Remove special characters but keep numbers
      const cleaned = word.replace(/[^\w\d\s-]/g, '').trim();

      // Check if it looks like a medicine name
      if (
        cleaned.length > 3 &&
        cleaned[0] === cleaned[0].toUpperCase() &&
        /^[A-Z][a-z]*(\d+)?$/.test(cleaned)
      ) {
        medicines.add(cleaned);
      }
    });

    // Return top 10 most likely medicines
    return Array.from(medicines)
      .slice(0, 10)
      .map((med, idx) => ({
        id: idx,
        name: med,
        selected: false,
      }));
  };

  /**
   * Toggle medicine selection
   */
  const toggleMedicineSelection = (id) => {
    setExtractedMedicines((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, selected: !med.selected } : med
      )
    );
  };

  /**
   * Save prescription
   */
  const savePrescription = () => {
    if (!selectedFile) {
      setError('❌ Please select a file first');
      return;
    }

    const selectedMeds = extractedMedicines
      .filter((m) => m.selected)
      .map((m) => m.name);

    const prescription = {
      id: Date.now(),
      fileName: selectedFile.name,
      uploadDate: new Date().toLocaleDateString(),
      uploadTime: new Date().toLocaleTimeString(),
      fileType: selectedFile.type.includes('pdf') ? 'PDF' : 'Image',
      fileSize: (selectedFile.size / 1024).toFixed(2) + ' KB',
      extractedText: ocrText,
      medicines: selectedMeds.length > 0 ? selectedMeds : extractedMedicines.map((m) => m.name),
      preview: preview?.data,
    };

    const updated = [prescription, ...uploadedPrescriptions];
    setUploadedPrescriptions(updated);
    localStorage.setItem(`prescriptions_${customerId}`, JSON.stringify(updated));

    setSuccessMessage('✅ Prescription saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);

    // Reset form
    resetForm();
  };

  /**
   * Delete prescription
   */
  const deletePrescription = (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      const updated = uploadedPrescriptions.filter((p) => p.id !== id);
      setUploadedPrescriptions(updated);
      localStorage.setItem(`prescriptions_${customerId}`, JSON.stringify(updated));
      setSuccessMessage('✅ Prescription deleted');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setOcrText('');
    setExtractedMedicines([]);
  };

  return (
    <div className="prescription-container">
      {/* Back Button */}
      <div className="prescription-header-back">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="prescription-main">
        {/* Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="prescription-grid">
          {/* Left: Upload Section */}
          <div className="upload-section">
            <div className="upload-card">
              <h2>📋 Upload Prescription</h2>

              {/* File Upload Area */}
              <div className="upload-area">
                <label htmlFor="file-input" className="upload-label">
                  <div className="upload-icon">📄</div>
                  <p className="upload-text">Click to upload or drag & drop</p>
                  <p className="upload-hint">PNG, JPG, WebP, or PDF (max 5MB)</p>
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleFileSelect}
                  disabled={loading}
                  className="file-input"
                />
              </div>

              {/* File Info */}
              {selectedFile && (
                <div className="file-info">
                  <div className="file-info-item">
                    <span className="label">📁 File:</span>
                    <span className="value">{selectedFile.name}</span>
                  </div>
                  <div className="file-info-item">
                    <span className="label">📊 Size:</span>
                    <span className="value">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className="file-info-item">
                    <span className="label">🔤 Type:</span>
                    <span className="value">{selectedFile.type.includes('pdf') ? 'PDF' : 'Image'}</span>
                  </div>
                </div>
              )}

              {/* Preview Section */}
              {preview && (
                <div className="preview-section">
                  <h3>👁️ Preview</h3>
                  {preview.type === 'image' ? (
                    <img src={preview.data} alt="Preview" className="preview-image" />
                  ) : (
                    <div className="preview-pdf">
                      <p>📄 PDF File Selected</p>
                      <p className="pdf-hint">PDF preview not available in browser</p>
                    </div>
                  )}
                </div>
              )}

              {/* OCR Button */}
              <button
                className="btn-ocr"
                onClick={processOCR}
                disabled={!selectedFile || loading}
              >
                {loading ? processingStep || '🔄 Processing...' : '🔍 Extract Text (OCR)'}
              </button>

              {/* OCR Results */}
              {ocrText && (
                <div className="ocr-section">
                  <h3>📖 Extracted Text</h3>
                  <div className="ocr-text-box">{ocrText}</div>
                  <p className="ocr-hint">Review the extracted text and select medicines below</p>
                </div>
              )}

              {/* Extracted Medicines */}
              {extractedMedicines.length > 0 && (
                <div className="medicines-section">
                  <h3>💊 Found Medicines</h3>
                  <p className="medicines-hint">Select the medicines you need:</p>
                  <div className="medicines-grid">
                    {extractedMedicines.map((med) => (
                      <label key={med.id} className="medicine-checkbox">
                        <input
                          type="checkbox"
                          checked={med.selected}
                          onChange={() => toggleMedicineSelection(med.id)}
                        />
                        <span>{med.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              {selectedFile && (
                <div className="button-group">
                  <button
                    className="btn-save"
                    onClick={savePrescription}
                    disabled={loading}
                  >
                    ✅ Save Prescription
                  </button>
                  <button className="btn-cancel" onClick={resetForm} disabled={loading}>
                    ❌ Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Uploaded Prescriptions List */}
          <div className="prescriptions-list-section">
            <div className="list-card">
              <h2>📑 My Prescriptions ({uploadedPrescriptions.length})</h2>

              {uploadedPrescriptions.length === 0 ? (
                <div className="empty-state">
                  <p>📭 No prescriptions uploaded yet</p>
                  <p className="empty-hint">Upload your first prescription to get started</p>
                </div>
              ) : (
                <div className="prescriptions-list">
                  {uploadedPrescriptions.map((rx) => (
                    <div key={rx.id} className="prescription-item">
                      <div className="prescription-item-header">
                        <div className="prescription-info">
                          <div className="prescription-title">
                            <span className="file-icon">
                              {rx.fileType === 'PDF' ? '📄' : '🖼️'}
                            </span>
                            <h4>{rx.fileName}</h4>
                          </div>
                          <div className="prescription-meta">
                            <span className="meta-item">📅 {rx.uploadDate}</span>
                            <span className="meta-item">⏰ {rx.uploadTime}</span>
                            <span className="meta-item">💾 {rx.fileSize}</span>
                          </div>
                        </div>
                      </div>

                      {/* Medicines Found */}
                      {rx.medicines.length > 0 && (
                        <div className="prescription-medicines">
                          <p className="medicines-label">💊 Medicines Found:</p>
                          <div className="medicine-tags">
                            {rx.medicines.map((med, idx) => (
                              <span key={idx} className="medicine-tag">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="prescription-actions">
                        <button
                          className="btn-view"
                          onClick={() => {
                            if (rx.preview) {
                              window.open(rx.preview, '_blank');
                            }
                          }}
                        >
                          👁️ View
                        </button>
                        <button
                          className="btn-text"
                          onClick={() => {
                            alert(
                              'Extracted Text:\n\n' +
                                (rx.extractedText || 'No text extracted')
                            );
                          }}
                        >
                          📖 Text
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => deletePrescription(rx.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionUpload;
