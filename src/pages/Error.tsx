import React from 'react';
import { Ghost, Home, MapPin, AlertCircle, ChevronRight } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen    flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl  p-8 md:p-12">
        <div className="text-center">
          {/* Floating Ghost Animation */}
          <div className="relative w-40 h-40 mx-auto mb-2">
            {/* <Ghost 
              size={96} 
              className="text-indigo-600 absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce"
            /> */}
            <AlertCircle 
              size={100} 
              className="text-red-400 absolute top-8 right-12 "
            />
            {/* <MapPin 
              size={24} 
              className="text-indigo-400 absolute bottom-8 left-12 animate-pulse"
            /> */}
          </div>
          
          <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-widest mb-8">
            404
          </h1>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
            Oops! Looks like this page has gone on a ghostly adventure. Don't worry, our home page is still here!
          </p>
          
          <a
            href="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
          >
            <Home className="w-5 h-5 mr-2" />
            <span>Return Home</span>
            <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-2" />
          </a>
          
          <div className="mt-12 flex items-center justify-center text-gray-500 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Need help? Contact our support team</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;