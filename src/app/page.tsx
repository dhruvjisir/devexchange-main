export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to DevExchange</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg mb-4">
          Your platform for buying and selling startups and businesses.
        </p>
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