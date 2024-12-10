import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    recipientId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
