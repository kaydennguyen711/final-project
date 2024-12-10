'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; 

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    year: '',
    model: '',
    make: '',
  });

  const fetchCars = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/cars?${params.toString()}`);

      if (!res.ok) {
        console.error('Failed to fetch cars:', res.statusText);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setCars(data);
      } else {
        console.error('Unexpected data format:', data);
        setCars([]);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Logo and Navigation */}
      <header className="flex items-center justify-between mb-6">
  <div className="flex items-center space-x-4">
    {/* Speedlot Logo */}
    <img
      src="/logo.jpg"
      alt="Speedlot Logo"
      className="h-12"
    />
    <h1 className="text-3xl font-bold	text-red-500">Speedlot</h1>
  </div>
  {/* Navigation Buttons */}
  <nav className="flex space-x-4">
    <Link
      href="/post"
      className="bg-red-500 text-black py-2 px-4 rounded-lg hover:bg-red-600"
    >
      Post Your Car
    </Link>
    <Link
      href="/messages"
      className="bg-red-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600"
    >
      Messages
    </Link>
  </nav>
</header>

      {/* Filters Section */}
      <form className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 text-black"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 text-black"
        />
        <input
          type="number"
          placeholder="Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 text-black"
        />
        <input
          type="text"
          placeholder="Make"
          value={filters.make}
          onChange={(e) => setFilters({ ...filters, make: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 text-black"
        />
        <input
          type="text"
          placeholder="Model"
          value={filters.model}
          onChange={(e) => setFilters({ ...filters, model: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 text-black"
        />
        <button
          type="submit"
          className="col-span-2 md:col-span-4 bg-red-500 text-black py-3 rounded-lg hover:bg-red-600"
        >
          Apply Filters
        </button>
      </form>

      {/* Car Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car._id} className="p-4 bg-white rounded-lg shadow-md">
            <img
              src={car.imageUrl}
              alt={car.title}
              className="h-48 w-full object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{car.title}</h2>
            <p className="text-gray-700 mb-2">${car.price}</p>
            <p className="text-gray-500">
              {car.year} - {car.make} {car.model}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
