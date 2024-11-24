const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await db.collection('users').doc(email).get();
    if (userDoc.exists) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection('users').doc(email).set({
      email,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).send('User created successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await db.collection('users').doc(email).get();
    if (!userDoc.exists) return res.status(404).send('User not found');

    const user = userDoc.data();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
