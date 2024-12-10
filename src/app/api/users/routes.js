import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return new Response(JSON.stringify({ token, user }), { status: 200 });
}
