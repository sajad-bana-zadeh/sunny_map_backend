import axios from 'axios';

const samplePoints = [
  {
    name: "Store Alpha",
    location: { latitude: 40.7128, longitude: -74.0060 },
    inventory: [
      { productName: "Laptop Pro", productType: "Electronics", quantity: 15 },
      { productName: "Wireless Mouse", productType: "Electronics", quantity: 30 }
    ],
    contactInfo: { email: "alpha@store.com", phone: "+1-234-567-8901" }
  },
  {
    name: "Store Beta",
    location: { latitude: 40.7580, longitude: -73.9855 },
    inventory: [
      { productName: "Office Chair", productType: "Furniture", quantity: 8 },
      { productName: "Standing Desk", productType: "Furniture", quantity: 5 }
    ],
    contactInfo: { email: "beta@store.com", phone: "+1-234-567-8902" }
  },
  {
    name: "Store Gamma",
    location: { latitude: 40.6892, longitude: -74.0445 },
    inventory: [
      { productName: "Laptop Pro", productType: "Electronics", quantity: 10 },
      { productName: "USB Hub", productType: "Electronics", quantity: 25 }
    ],
    contactInfo: { email: "gamma@store.com", phone: "+1-234-567-8903" }
  }
];

async function seedData() {
  try {
    const response = await axios.post('http://localhost:3000/api/points/import', samplePoints);
    console.log('Data seeded successfully:', response.data);
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();