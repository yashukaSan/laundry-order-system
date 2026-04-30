// Generates a unique Order ID like: ORD-20240512-4821
function generateOrderId() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const dateStr = `${year}${month}${day}`;

  // Random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  return `ORD-${dateStr}-${randomNum}`;
}

export default generateOrderId;
