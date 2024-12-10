import connectDB from '@/lib/db';
import Car from '@/models/car';

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const make = searchParams.get('make');

  try {
    const makes = await Car.distinct('make');

    const models = make ? await Car.distinct('model', { make }) : [];

    return new Response(JSON.stringify({ makes, models }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
