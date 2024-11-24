const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

router.post('/', async (req, res) => {
  const { title, description, price, sellerEmail } = req.body;

  try {
    const newListing = {
      title,
      description,
      price,
      sellerEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('listings').add(newListing);
    res.status(201).send('Listing added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('listings').get();
    const listings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection('listings').doc(id).get();
    if (!doc.exists) return res.status(404).send('Listing not found');

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
