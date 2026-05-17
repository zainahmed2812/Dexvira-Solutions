const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// POST - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, service, message } = req.body;

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        service,
        message
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message received successfully',
      data: contact
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
});

// GET - Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;