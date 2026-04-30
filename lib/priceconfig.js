// Hardcoded price per garment type (in INR)
// Update these values to change pricing across the entire app
const GARMENT_PRICES = {
  Shirt: 300,
  Pants: 400,
  Saree: 750,
  Jacket: 600,
  Kurta: 250,
  Suit: 450,
  Bedsheet: 360,
  "T-Shirt": 125,
  Dress: 700,
  Blazer: 820,
};

export const GARMENT_TYPES = Object.keys(GARMENT_PRICES);

export default GARMENT_PRICES;
