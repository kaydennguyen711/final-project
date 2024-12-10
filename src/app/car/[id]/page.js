import { notFound } from 'next/navigation';

async function getCar(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cars/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function CarPage({ params }) {
  const car = await getCar(params.id);

  if (!car) return notFound();

  return (
    <div>
      <h1>{car.title}</h1>
      <p>{car.description}</p>
      <p>Price: ${car.price}</p>
      <p>Model: {car.model}</p>
      <p>Year: {car.year}</p>
    </div>
  );
}
