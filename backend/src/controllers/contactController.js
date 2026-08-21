import ContactLead from '../models/ContactLead.js';

// @desc    Submit a contact form lead
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  const { name, email, phone, businessName, message } = req.body;

  try {
    const lead = await ContactLead.create({
      name,
      email,
      phone,
      businessName: businessName || '',
      message,
      status: 'New',
    });

    res.status(201).json({ success: true, message: 'Message sent successfully. We will contact you soon!', lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
