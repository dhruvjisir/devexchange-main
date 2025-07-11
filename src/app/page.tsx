export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Buy and Sell Businesses Easily</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-4">
          Welcome to startupbazzar, your trusted marketplace to buy and sell businesses of all kinds. Whether you’re interested in a car wash for sale, vending machine route, liquor store, restaurant, or an online business, startupbazzar connects buyers and sellers for a seamless experience. Discover business opportunities, list your business for sale, or find your next investment today.
        </p>
        <div className="bg-gray-50 border rounded-lg p-4 mb-8">
          <strong>Popular Searches:</strong>
          <ul className="list-disc list-inside text-gray-700 mt-2 text-sm grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
            <li>bizbuy sell</li>
            <li>business for sale</li>
            <li>car wash for sale</li>
            <li>vending machine route</li>
            <li>liquor store</li>
            <li>restaurant</li>
            <li>online business</li>
            <li>internet business</li>
            <li>direct sales</li>
            <li>commercial business</li>
            <li>buy and sell business</li>
            <li>buy biz</li>
            <li>buy biz and sell</li>
            <li>buy sell business</li>
            <li>businesses for sale</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">For Sellers</h2>
            <p className="text-gray-600 mb-4">
              List your startup or business for sale and connect with potential buyers.
            </p>
            <a 
              href="/sell" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Start Selling
            </a>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">For Buyers</h2>
            <p className="text-gray-600 mb-4">
              Browse and discover startups and businesses available for purchase.
            </p>
            <a 
              href="/buy" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Start Browsing
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 