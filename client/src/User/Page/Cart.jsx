import React, { useState } from 'react';

const Cart = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Bag 3',
      price: 85,
      quantity: 1,
      image: '/bag8Img.png',
    },
    {
      id: 2,
      name: 'Jacket',
      price: 120,
      quantity: 2,
      image: '/jacket.png',
    },
  ]);

  const updateQuantity = (id, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQty) } : item
      )
    );
  };

  const deleteItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-pink-50 to-purple-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-10 drop-shadow">
        🛍️ Your Shopping Cart
      </h1>

      <div className="mb-6 text-lg text-center font-medium text-pink-700">
        Items in Cart: <span className="font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
      </div>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Your cart is currently empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-purple-200"
            >
              <div className="flex items-center gap-6 w-full md:w-3/4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md border border-pink-300"
                />
                <div>
                  <h2 className="text-2xl font-bold text-purple-800">{item.name}</h2>
                  <p className="text-gray-600 font-medium">Price: ₹{item.price}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      className="px-3 py-1 bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold rounded-full transition"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-purple-700">{item.quantity}</span>
                    <button
                      className="px-3 py-1 bg-purple-200 hover:bg-purple-300 text-purple-800 font-bold rounded-full transition"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-full text-sm transition"
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-xl font-extrabold text-pink-700">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}

          <div className="text-right mt-10">
            <h2 className="text-4xl font-extrabold text-purple-800">
              Total: <span className="text-pink-600">₹{totalPrice}</span>
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
