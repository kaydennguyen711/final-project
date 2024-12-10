import connectDB from '@/lib/db';
import Message from '@/models/message';

export async function POST(req) {
  await connectDB();

  const { senderId, recipientId, content } = await req.json();

  try {
    const message = new Message({ senderId, recipientId, content });
    await message.save();
    return new Response(JSON.stringify(message), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const senderId = searchParams.get('senderId');
  const recipientId = searchParams.get('recipientId');

  try {
    const messages = await Message.find({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
