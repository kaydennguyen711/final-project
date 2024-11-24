const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();


const db = admin.firestore();

router.post('/', async (req, res) => {
  const { senderEmail, receiverEmail, message } = req.body;

  try {
    const newMessage = {
      senderEmail,
      receiverEmail,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('messages').add(newMessage);
    res.status(201).send('Message sent');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:sender/:receiver', async (req, res) => {
  const { sender, receiver } = req.params;

  try {
    const snapshot = await db
      .collection('messages')
      .where('senderEmail', 'in', [sender, receiver])
      .where('receiverEmail', 'in', [sender, receiver])
      .orderBy('createdAt', 'asc')
      .get();

    const messages = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
