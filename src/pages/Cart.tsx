import { backendRequest } from '@/Helper/backendRequest';
import { useAppSelector, useAppDispatch } from '../redux/app.hooks';
import { removeFromCart, clearCart } from '../redux/slices/cart.slice';
import { ShoppingCart, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';


interface Response {
  success: boolean;
  url: string;
}
const CartPage = () => {
  const [loading,setLoading] = useState(false);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handlePurchase = async () => {
    const ids = items.map((item) => item._id);
    console.log('Proceeding to checkout...', ids);
    setLoading(true)
    try {
      const response = await backendRequest<Response>("POST", "/course/purchase", { courseIds: ids });
      if (response.success){
        window.location.href = response.url; 
        dispatch(clearCart());
      }
    } catch (error) {
      console.log("Error during checkout:", error);
    }finally{
      setLoading(false)
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            Your Learning Cart
          </h1>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-custom_primary hover:text-custom_primary_hover"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to courses
          </button>
        </div>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Looks like you haven't added any courses yet</p>
            <button 
              className="px-6 py-3 bg-custom_primary hover:bg-custom_primary_hover text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              onClick={() => window.history.back()}
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {items.map((course) => (
                <div key={course._id} className="p-6 border-b last:border-b-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition">
                  <div className="flex items-start gap-4 flex-1">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                      <p className="text-gray-600 text-sm">Instructor: {course.teacher.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <p className="text-lg font-bold text-gray-900 min-w-[80px] text-right">
                      ${course.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => dispatch(removeFromCart(course._id))}
                      className="p-2 text-gray-400 hover:text-red-500 transition"
                      aria-label="Remove item"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl text-gray-900">Total Amount</h3>
                <span className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Clear Cart
                </button>
                <button
                disabled={loading}
                  onClick={handlePurchase}
                  className={`px-6 py-3 bg-gradient-to-r from-custom_primary to-custom_primary_hover text-white rounded-lg hover:from-custom_primary_hover hover:to-custom_primary transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  {loading?"Loading...":"Secure Checkout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;