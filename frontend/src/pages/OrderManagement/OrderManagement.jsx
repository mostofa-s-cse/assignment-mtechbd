import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authClient } from '../../constants/axiosInstance';
import { orderActions } from '../../store/reducers/orderSlice';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    items: [],
  });
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await authClient.get('/orders'); // Adjust the endpoint accordingly
        console.log('Fetched orders:', response.data); // Log the response
        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            dispatch(orderActions.setOrders(response.data));
          } else {
            console.error('Expected an array of orders, but got:', response.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await authClient.get('/products');
        if (response.status === 200) {
          setProducts(response.data.data); // Assuming the data is in response.data.data
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchOrders();
    fetchProducts();
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.customer) {
      setFormData((prev) => ({
        ...prev,
        customer: { ...prev.customer, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddItem = () => {
    if (selectedProductId) {
      const product = products.find(p => p.id === parseInt(selectedProductId));
      const newItem = {
        productId: selectedProductId,
        quantity: quantity,
        price: product.price,
        discount: product.discount || 0, // Assuming product has a discount property
      };
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
      // Reset selected product and quantity after adding
      setSelectedProductId('');
      setQuantity(1);
    }
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authClient.post('/orders', formData); // Adjust the endpoint accordingly
      if (response.status === 201) {
        dispatch(orderActions.addOrder(response.data)); // Assuming the response contains the created order
        setFormData({ customer: { name: '', email: '', phone: '', address: '' }, items: [] }); // Reset form
      }
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await authClient.delete(`/orders/${orderId}`); // Adjust the endpoint accordingly
      dispatch(orderActions.removeOrder(orderId)); // Remove the order from the Redux store
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  const filteredOrders = Array.isArray(orders) && searchPhone
    ? orders.filter(order => order.customer.phone.includes(searchPhone))
    : orders; // Fallback to orders if searchPhone is empty

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((total, item) => {
      return total + (item.price * item.quantity); // Calculate subtotal
    }, 0);

    const totalDiscount = formData.items.reduce((total, item) => total + item.discount, 0);
    const grandTotal = subtotal - totalDiscount; // Grand total after discount

    return { subtotal, totalDiscount, grandTotal };
  };

  const { subtotal, totalDiscount, grandTotal } = calculateTotals();

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Order Management</h2>
      <input
        type="text"
        placeholder="Search by Phone"
        value={searchPhone}
        onChange={(e) => setSearchPhone(e.target.value)}
        className="border p-2 mb-4"
      />
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={formData.customer.name}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Customer Email"
          value={formData.customer.email}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Customer Phone"
          value={formData.customer.phone}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Customer Address"
          value={formData.customer.address}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="border p-2 mr-2"
          required
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 mr-2"
          min="1"
          required
        />
        <button type="button" onClick={handleAddItem} className="bg-green-500 text-white p-2 mr-2">
          Add Item
        </button>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Create Order
        </button>
      </form>
      <div className="mb-4">
        <h3 className="text-xl">Items:</h3>
        {formData.items.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <span>Product ID: {item.productId}, Quantity: {item.quantity}, Price: {item.price}, Discount: {item.discount}</span>
            <button
              className="text-red-500 ml-2"
              onClick={() => handleRemoveItem(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-xl">Order Summary:</h3>
        <div>Subtotal: ${subtotal.toFixed(2)}</div>
        <div>Total Discount: ${totalDiscount.toFixed(2)}</div>
        <div>Grand Total: ${grandTotal.toFixed(2)}</div>
      </div>
      <table className="min-w-full border mb-4">
        <thead>
          <tr>
            <th className="border">Customer Name</th>
            <th className="border">Customer Email</th>
            <th className="border">Customer Phone</th>
            <th className="border">Customer Address</th>
            <th className="border">Items</th>
            <th className="border">Total</th>
            <th className="border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredOrders) && filteredOrders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.customer.name}</td>
              <td className="border p-2">{order.customer.email}</td>
              <td className="border p-2">{order.customer.phone}</td>
              <td className="border p-2">{order.customer.address}</td>
              <td className="border p-2">
                {order.items && order.items.length > 0 ? (
                  order.items.map(item => (
                    <div key={item.productId}>
                      Product ID: {item.productId}, Quantity: {item.quantity}, Discount: {item.discount}
                    </div>
                  ))
                ) : (
                  <span>No items in this order</span>
                )}
              </td>
              <td className="border p-2">
                {order.items && order.items.length > 0
                  ? order.items.reduce((total, item) => total + (item.price * item.quantity) - item.discount, 0).toFixed(2)
                  : '0.00'}
              </td>
              <td className="border p-2">
                <button className="text-red-500" onClick={() => handleDeleteOrder(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;