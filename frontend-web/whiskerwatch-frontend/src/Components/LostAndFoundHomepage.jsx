// src/pages/LostAndFoundHomepage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LostAndFoundHomepage = () => {
  const [pets, setPets] = useState([]);
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/lostfoundpets');
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching lost/found pets:', error);
    }
  };

  const filteredPets = pets.filter((pet) => {
    const matchesSpecies = speciesFilter ? pet.species.toLowerCase() === speciesFilter.toLowerCase() : true;
    const matchesSearch = pet.petName.toLowerCase().includes(search.toLowerCase());
    return matchesSpecies && matchesSearch;
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Lost & Found Pets</h1>
        <button
          onClick={() => navigate('/post-lost-pet')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload a Lost Pet
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full"
        />
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="border p-2"
        >
          <option value="">All Species</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {filteredPets.map((pet) => (
          <div key={pet.id} className="border p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold">{pet.petName}</h2>
            <p className="text-sm">{pet.description}</p>
            <p className="text-sm font-medium">Species: {pet.species}</p>
            <p className={`text-sm ${pet.status === 'FOUND' ? 'text-green-600' : 'text-red-600'}`}>
              Status: {pet.status}
            </p>
            <p className="text-sm text-gray-500">
              Location: ({pet.latitude.toFixed(4)}, {pet.longitude.toFixed(4)})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostAndFoundHomepage;
