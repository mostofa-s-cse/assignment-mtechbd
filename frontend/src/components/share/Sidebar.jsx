export default function Sidebar() {
    return (
        <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-lg font-bold">Dashboard</div>
        <nav className="mt-6">
          <a href="/dasboard" className="block px-4 py-2 hover:bg-gray-700">Home</a>
          <a href="/products" className="block px-4 py-2 hover:bg-gray-700">Product Management</a>
          <a href="/promotions" className="block px-4 py-2 hover:bg-gray-700">Promotion Management</a>
          <a href="/order" className="block px-4 py-2 hover:bg-gray-700">Order</a>
        </nav>
      </div>
    )
}