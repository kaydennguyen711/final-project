import { connectDB } from '@/lib/db';
import Car from '@/models/car'; 
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const minPrice = url.searchParams.get('minPrice') || 0;
    const maxPrice = url.searchParams.get('maxPrice') || Infinity;
    const year = url.searchParams.get('year');
    const model = url.searchParams.get('model');
    const make = url.searchParams.get('make');

    await connectDB(); 

    const query = {};

    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice && maxPrice !== Infinity) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }
    if (year) query.year = Number(year);
    if (model) query.model = { $regex: model, $options: 'i' }; 
    if (make) query.make = { $regex: make, $options: 'i' };

    const cars = await Car.find(query); 

    return new Response(JSON.stringify(cars), { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/cars:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cars' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const carData = await req.json();

    if (!carData.title || !carData.price || !carData.imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, price, or imageUrl' }),
        { status: 400 }
      );
    }

    await connectDB();

    const newCar = new Car(carData);
    const savedCar = await newCar.save();

    return new Response(JSON.stringify(savedCar), { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/cars:', error);
    return new Response(JSON.stringify({ error: 'Failed to save car' }), { status: 500 });
  }
}
