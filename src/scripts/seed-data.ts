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
    const response = await fetch('http://localhost:3000/api/points/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(samplePoints),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Data seeded successfully:', data);
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();
