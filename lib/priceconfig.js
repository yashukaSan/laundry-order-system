// Hardcoded price per garment type (in INR)
// Update these values to change pricing across the entire app
const GARMENT_PRICES = {
  Shirt: 30,
  Pants: 40,
  Saree: 80,
  Jacket: 100,
  Kurta: 50,
  Suit: 150,
  Bedsheet: 60,
  "T-Shirt": 25,
  Dress: 70,
  Blazer: 120,
};

export const GARMENT_TYPES = Object.keys(GARMENT_PRICES);

export default GARMENT_PRICES;
