'use client';

import { useState } from 'react';

export default function PostCarPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    model: '',
    make: '',
    year: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      console.log('Form data at submission:', formData);
  
      let imageUrl = '';

      if (file) {
        console.log('Uploading file:', file);
  
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
  
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
  
        console.log('Upload response status:', uploadResponse.status);
  
        if (!uploadResponse.ok) {
          console.error('Upload failed. Response text:', await uploadResponse.text());
          setError('File upload failed. Please try again.');
          setLoading(false);
          return;
        }
  
        const uploadData = await uploadResponse.json();
        console.log('Upload response data:', uploadData);
  
        imageUrl = uploadData.url;
      }
  
      console.log('Image URL:', imageUrl);

      const carPayload = { ...formData, imageUrl };
      console.log('Submitting car payload:', carPayload);
  
      const carResponse = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carPayload),
      });
  
      console.log('Car submission response status:', carResponse.status);
  
      if (!carResponse.ok) {
        console.error('Car submission failed. Response text:', await carResponse.text());
        setError('Failed to post car. Please try again.');
        setLoading(false);
        return;
      }
  
      const carData = await carResponse.json();
      console.log('Car submission response data:', carData);
  
      alert('Car posted successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        model: '',
        make: '',
        year: '',
      });
      setFile(null);
    } catch (error) {
      console.error('Unexpected error in handleSubmit:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-red-500">Post Your Car</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-3 text-black"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-3 text-black"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-3 text-black"
        />
        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-3 text-black"
        />
        <input
          type="text"
          placeholder="Make"
          value={formData.make}
          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-3 text-black"
        />
        <input
          type="text"
          placeholder="Model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-3 text-black"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-500"
        >
          Post Car
        </button>
      </form>
    </div>
  );
}
