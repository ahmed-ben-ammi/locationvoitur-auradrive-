import api from './axios';

// API_URL is for API calls (has /api prefix)
// STATIC_URL is for images/files (no /api prefix)
export const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace('/api', '');
};
export const STATIC_URL = getBaseUrl();

export const mapCarData = (car) => {
  let pricePerDay = 500;
  if (car.marque === 'Peugeot') pricePerDay = 250;
  if (car.marque === 'Renault') pricePerDay = 450;
  if (car.marque === 'Toyota') pricePerDay = 750;
  if (car.marque === 'Mercedes') pricePerDay = 1200;
  if (car.marque === 'Porsche') pricePerDay = 3500;
  if (car.marque === 'Range Rover') pricePerDay = 2800;

  return {
    id: car.id,
    brand: car.marque,
    model: car.modele,
    year: car.annee,
    category: 'economic',
    transmission: 'auto',
    fuel: 'petrol',
    seats: 5,
    image: car.image 
      ? car.image.startsWith('http') 
        ? car.image 
        : car.image.startsWith('uploads/')
          ? `${STATIC_URL}/${car.image}`
          : `${STATIC_URL}/uploads/${car.image}` 
      : 'https://via.placeholder.com/400x300?text=No+Image',
    pricePerDay: car.prix_par_jour || pricePerDay,
    pricePerWeek: 3500,
    pricePerMonth: 13900,
  };
};

export async function getAllCars() {
  const response = await api.get('/vehicles');
  return response.data;
}

export async function getCarById(id) {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
}

export async function createCar(formData) {
  const response = await api.post('/vehicles', formData);
  return response.data;
}

export async function updateCar(id, formData) {
  const response = await api.put(`/vehicles/${id}`, formData);
  return response.data;
}

export async function deleteCar(id) {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
}
