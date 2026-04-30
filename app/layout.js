import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "LaundryPro — Order Management",
  description: "Mini laundry order management system for dry cleaning stores",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen antialiased">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
