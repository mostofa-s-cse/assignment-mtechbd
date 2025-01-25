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
        const response = await authClient.get('/orders');
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
          setProducts(response.data.data);
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
      if (!product) return;

      const newItem = {
        productId: parseInt(selectedProductId),
        quantity: Number(quantity), 
        price: Number(product.price), 
        discount: Number(product.discount) || 0, 
      };
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
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

  const [order, setOrder] = useState({
  });
  console.log('order', order)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authClient.post('/orders', formData);
      if (response.status === 201) {
        const { id, subtotal, totalDiscount, grandTotal, orderItems } = response.data.data;
        setOrder(response.data.data);
        console.log("esponse.data.data", response.data.data);
        dispatch(orderActions.addOrder({
          id,
          subtotal,
          totalDiscount,
          grandTotal,
          items: orderItems, 
        }));

        setFormData({ customer: { name: '', email: '', phone: '', address: '' }, items: [] });
      }
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await authClient.delete(`/orders/${orderId}`);
      dispatch(orderActions.removeOrder(orderId));
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };


  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Order Management</h2>
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
        <br />
        <br />
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="border p-2 mr-2"
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
          onChange={(e) => setQuantity(Number(e.target.value))} 
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
            <span>Product ID: {item.productId}, Quantity: {item.quantity}, Price: {item.price}</span>
            <button
              className="text-red-500 ml-2"
              onClick={() => handleRemoveItem(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <table className="min-w-full border mb-4">
        <thead>
          <tr>
            <th className="border">Order ID</th>
            <th className="border">Customer ID</th>
            <th className="border">Items</th>
            <th className="border">Subtotal</th>
            <th className="border">Total Discount</th>
            <th className="border">Grand Total</th>
            <th className="border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {order ? (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.customerId}</td>
              <td className="border p-2">
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item) => (
                    <div key={item.id}>
                      Product ID: {item.productId}, Quantity: {item.quantity}, Discount: {item.discount}
                    </div>
                  ))
                ) : (
                  <span>No items in this order</span>
                )}
              </td>
              <td className="border p-2">{order.subtotal?.toFixed(2) || '0.00'}</td>
              <td className="border p-2">{order.totalDiscount?.toFixed(2) || '0.00'}</td>
              <td className="border p-2">{order.grandTotal?.toFixed(2) || '0.00'}</td>

              <td className="border p-2">
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="7" className="text-center border p-2">
                No order data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;