import porscheMacanImg from '../assets/Porsche  macan.png';
import porscheCayenneImg from '../assets/Porsche Cayenne.png';
import rangeRoverSportImg from '../assets/Range Rover Sport.png';
import rangeRoverVogueImg from '../assets/Range Rover Vogue.png';
import rangeRoverEvoqueImg from '../assets/Range Rover Evoque.png';
import mercedesGClassImg from '../assets/Mercedes-Benz G-Class.png';
import mercedesEClassImg from '../assets/Mercedes-Benz E-Class.png';
import vwTouaregImg from '../assets/Volkswagen touarge.png';
import vwTouaregRLineImg from '../assets/Volkswagen Touareg R-Line.png';
import daciaDusterImg from '../assets/Dacia Duster.png';
import hyundaiTucsonImg from '../assets/Hyundai Tucson.png';
import hyundaiTucsonFullImg from '../assets/Hyundai Tucson Full Option.png';
import vwGolf8Img from '../assets/Volkswagen Golf 8.png';
import vwGolf8RLineImg from '../assets/Volkswagen Golf 8 R-Line.png';
import daciaLoganImg from '../assets/Dacia Logan.png';
import renaultClio5Img from '../assets/Renault Clio 5.png';
import hyundaiAccentImg from '../assets/Hyundai Accent.png';
import mercedesAClassImg from '../assets/Mercedes-Benz A-Class.png';
import mercedesVClassImg from '../assets/Mercedes-Benz V-Class (Vito).png';


export const cars = [
  // --- LUXURY ---
  {
    id: 1,
    brand: 'Porsche',
    model: 'Macan',
    year: 2024,
    category: 'luxury',
    transmission: 'auto',
    fuel: 'petrol',
    seats: 5,
    image: porscheMacanImg,
    pricePerDay: 4000,
    pricePerWeek: 28000,
    pricePerMonth: 108500
  },
  {
    id: 2,
    brand: 'Porsche',
    model: 'Cayenne',
    year: 2024,
    category: 'luxury',
    transmission: 'auto',
    fuel: 'petrol',
    seats: 5,
    image: porscheCayenneImg,
    pricePerDay: 4000,
    pricePerWeek: 28000,
    pricePerMonth: 108500
  },
  {
    id: 3,
    brand: 'Range Rover',
    model: 'Sport',
    year: 2024,
    category: 'luxury',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: rangeRoverSportImg,
    pricePerDay: 3500,
    pricePerWeek: 24500,
    pricePerMonth: 102300
  },
  {
    id: 4,
    brand: 'Range Rover',
    model: 'Vogue',
    year: 2024,
    category: 'luxury',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: rangeRoverVogueImg,
    pricePerDay: 5500,
    pricePerWeek: 38500,
    pricePerMonth: 148800
  },
  {
    id: 5,
    brand: 'Range Rover',
    model: 'Evoque',
    year: 2023,
    category: 'luxury',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: rangeRoverEvoqueImg,
    pricePerDay: 1400,
    pricePerWeek: 9800,
    pricePerMonth: 37200
  },
  {
    id: 6,
    brand: 'Mercedes-Benz',
    model: 'G-Class',
    year: 2024,
    category: 'luxury',
    transmission: 'auto',
    fuel: 'petrol',
    seats: 5,
    image: mercedesGClassImg,
    pricePerDay: 11500,
    pricePerWeek: 80500,
    pricePerMonth: 310000
  },
  {
    id: 7,
    brand: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2024,
    category: 'luxury',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: mercedesEClassImg,
    pricePerDay: 2500,
    pricePerWeek: 17500,
    pricePerMonth: 70000
  },

  // --- SUV ---
  {
    id: 8,
    brand: 'Volkswagen',
    model: 'Touareg',
    year: 2024,
    category: 'suv',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: vwTouaregImg,
    pricePerDay: 1300,
    pricePerWeek: 9100,
    pricePerMonth: 37200
  },
  {
    id: 9,
    brand: 'Volkswagen',
    model: 'Touareg R-Line',
    year: 2024,
    category: 'suv',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: vwTouaregRLineImg,
    pricePerDay: 1300,
    pricePerWeek: 9100,
    pricePerMonth: 37200
  },
  {
    id: 10,
    brand: 'Dacia',
    model: 'Duster',
    year: 2023,
    category: 'suv',
    transmission: 'manual',
    fuel: 'petrol',
    seats: 5,
    image: daciaDusterImg,
    pricePerDay: 500,
    pricePerWeek: 3500,
    pricePerMonth: 13900
  },
  {
    id: 11,
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    category: 'suv',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: hyundaiTucsonImg,
    pricePerDay: 800,
    pricePerWeek: 5600,
    pricePerMonth: 21700
  },
  {
    id: 12,
    brand: 'Hyundai',
    model: 'Tucson Full Option',
    year: 2024,
    category: 'suv',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: hyundaiTucsonFullImg,
    pricePerDay: 800,
    pricePerWeek: 5600,
    pricePerMonth: 21700
  },

  // --- ECONOMIC & COMPACT ---
  {
    id: 13,
    brand: 'Volkswagen',
    model: 'Golf 8',
    year: 2023,
    category: 'economic',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: vwGolf8Img,
    pricePerDay: 1000,
    pricePerWeek: 7000,
    pricePerMonth: 27900
  },
  {
    id: 14,
    brand: 'Volkswagen',
    model: 'Golf 8 R-Line',
    year: 2024,
    category: 'economic',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: vwGolf8RLineImg,
    pricePerDay: 1000,
    pricePerWeek: 7000,
    pricePerMonth: 27900
  },
  {
    id: 15,
    brand: 'Dacia',
    model: 'Logan',
    year: 2023,
    category: 'economic',
    transmission: 'auto',
    fuel: 'petrol',
    seats: 5,
    image: daciaLoganImg,
    pricePerDay: 350,
    pricePerWeek: 2450,
    pricePerMonth: 9000
  },
  {
    id: 16,
    brand: 'Dacia',
    model: 'Logan',
    year: 2023,
    category: 'economic',
    transmission: 'manual',
    fuel: 'petrol',
    seats: 5,
    image: daciaLoganImg,
    pricePerDay: 350,
    pricePerWeek: 2450,
    pricePerMonth: 9000
  },

  {
    id: 19,
    brand: 'Renault',
    model: 'Clio 5',
    year: 2023,
    category: 'economic',
    transmission: 'auto',
    fuel: 'petrol',
    seats: 5,
    image: renaultClio5Img,
    pricePerDay: 450,
    pricePerWeek: 3150,
    pricePerMonth: 10850
  },
  {
    id: 20,
    brand: 'Renault',
    model: 'Clio 5',
    year: 2023,
    category: 'economic',
    transmission: 'manual',
    fuel: 'diesel',
    seats: 5,
    image: renaultClio5Img,
    pricePerDay: 450,
    pricePerWeek: 3150,
    pricePerMonth: 10850
  },

  {
    id: 23,
    brand: 'Hyundai',
    model: 'Accent',
    year: 2023,
    category: 'economic',
    transmission: 'auto',
    fuel: 'petrol',
    seats: 5,
    image: hyundaiAccentImg,
    pricePerDay: 450,
    pricePerWeek: 3150,
    pricePerMonth: 12400
  },
  {
    id: 24,
    brand: 'Mercedes-Benz',
    model: 'A-Class',
    year: 2024,
    category: 'economic',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 5,
    image: mercedesAClassImg,
    pricePerDay: 1300,
    pricePerWeek: 8400,
    pricePerMonth: 34100
  },

  // --- MINIBUS / FAMILIALE ---
  {
    id: 25,
    brand: 'Mercedes-Benz',
    model: 'V-Class (Vito)',
    year: 2024,
    category: 'minibus',
    transmission: 'auto',
    fuel: 'diesel',
    seats: 8,
    image: mercedesVClassImg,
    pricePerDay: 2800,
    pricePerWeek: 19600,
    pricePerMonth: 80600
  }
];
