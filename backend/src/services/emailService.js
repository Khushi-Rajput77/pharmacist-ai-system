const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD // Use App Password, not actual password
  }
});

const sendOrderConfirmation = async (customerEmail, orderData) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: customerEmail,
    subject: `Order Confirmation #${orderData.orderId}`,
    html: `
      <h2>Order Confirmed! ✅</h2>
      <p>Your order has been successfully placed.</p>
      <p><strong>Order ID:</strong> ${orderData.orderId}</p>
      <p><strong>Total Price:</strong> ₹${orderData.totalPrice}</p>
      <p><strong>Delivery Date:</strong> ${new Date(orderData.deliveryDate).toLocaleDateString()}</p>
      <p>Thank you for using our service!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to', customerEmail);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  }
};

const sendRefillAlert = async (customerEmail, customerName, medicineName) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: customerEmail,
    subject: `Medicine Refill Reminder: ${medicineName}`,
    html: `
      <h2>Time to Refill! 💊</h2>
      <p>Hi ${customerName},</p>
      <p>Your <strong>${medicineName}</strong> is running low.</p>
      <p>Order now to avoid missing your dose.</p>
      <a href="http://pharmacy-app.com/order" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Order Now</a>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Refill alert email sent to', customerEmail);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  }
};

module.exports = { sendOrderConfirmation, sendRefillAlert };