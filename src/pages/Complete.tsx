import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Star, ShoppingCart, Filter, X, ChevronDown, Sliders } from 'lucide-react';
import { useCart } from '@/redux/app.hooks';
import { backendRequest } from '@/Helper/backendRequest';

interface Course {
  _id: string;
  title: string;
  description: string;
  teacher: string;
  level: string;
  thumbnail: string;
  price: number;
  category: string;
  enrolledCount: number;
  averageRating: number;
}

const CoursesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [expandedFilter, setExpandedFilter] = useState<string | null>("category");

  const { addToCart, isInCart } = useCart();

  // Handle query parameters when component mounts or URL changes
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location]);

  // Update URL when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchParams.set('search', searchTerm);
        setSearchParams(searchParams);
      } else if (searchParams.has('search')) {
        searchParams.delete('search');
        setSearchParams(searchParams);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  const handleFetchCourses = async () => {
    try {
      const response = await backendRequest('Get', '/student/courses/all');
      if (response.success){
        setCourses(response.data);
        setFilteredCourses(response.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  // Fetch courses (mock data for now)
  useEffect(() => {
    // This would be your API call in a real application
  
    
    // setCourses(fetchedCourses);
    handleFetchCourses()
    
  }, []);

  // Get unique categories and levels for filters
  const categories = [...new Set(courses.map(course => course.category))];
  const levels = [...new Set(courses.map(course => course.level))];

  // Apply filters
  useEffect(() => {
    let results = [...courses];
    
    // Apply search term filter
    if (searchTerm) {
      results = results.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter(course => selectedCategories.includes(course.category));
    }
    
    // Apply level filter
    if (selectedLevels.length > 0) {
      results = results.filter(course => selectedLevels.includes(course.level));
    }
    
    // Apply price range filter
    results = results.filter(course => 
      course.price >= priceRange[0] && course.price <= priceRange[1]
    );
    
    // Apply rating filter
    if (ratingFilter !== null) {
      results = results.filter(course => course.averageRating >= ratingFilter);
    }
    
    setFilteredCourses(results);
  }, [courses, searchTerm, selectedCategories, selectedLevels, priceRange, ratingFilter]);

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Handle level selection
  const handleLevelChange = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };

  // Add to cart function
 
  // Handle course details (enrollment)
  const handleDetail = (courseId: string) => {
    // Navigate to course details page
    console.log(`Navigating to course details for ${courseId}`);
    navigate(`/course/${courseId}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceRange([0, 1000]);
    setRatingFilter(null);
    setSearchTerm('');
    setSearchParams(new URLSearchParams());
  };

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  // Toggle filter sections
  const toggleFilter = (filter: string) => {
    setExpandedFilter(expandedFilter === filter ? null : filter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <button 
            onClick={toggleMobileFilters}
            className="flex lg:hidden  items-center gap-2 bg-purple-100 text-purple-700 px-4 py-3 rounded-lg font-medium hover:bg-purple-200 transition-colors"
          >
            <Sliders size={18} />
            <span className="hidden ">Filters</span>
          </button>
        {/* <div className="bg-white rounded-xl p-4 shadow-md mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
         
        </div> */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar for filters */}
          <aside className={`
            ${mobileFiltersOpen ? 'fixed inset-0 z-50 bg-white overflow-auto p-6' : 'hidden lg:block'}
            lg:w-72 lg:sticky lg:top-8 lg:h-fit bg-white p-6 rounded-xl shadow-md
          `}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <div className="flex gap-2">
                <button 
                  onClick={clearFilters} 
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Clear All
                </button>
                <button 
                  onClick={toggleMobileFilters} 
                  className="lg:hidden text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="border-b border-gray-200 pb-5 mb-5">
              <button 
                onClick={() => toggleFilter('price')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-medium text-gray-800">Price Range</h3>
                <ChevronDown 
                  size={18} 
                  className={`text-gray-500 transition-transform ${expandedFilter === 'price' ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {expandedFilter === 'price' && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">${priceRange[0]}</span>
                    <span className="text-sm font-medium text-gray-700">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </>
              )}
            </div>

            {/* Category Filter */}
            <div className="border-b border-gray-200 pb-5 mb-5">
              <button 
                onClick={() => toggleFilter('category')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-medium text-gray-800">Categories</h3>
                <ChevronDown 
                  size={18} 
                  className={`text-gray-500 transition-transform ${expandedFilter === 'category' ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {expandedFilter === 'category' && (
                <div className="space-y-2 ml-1">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Level Filter */}
            <div className="border-b border-gray-200 pb-5 mb-5">
              <button 
                onClick={() => toggleFilter('level')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-medium text-gray-800">Level</h3>
                <ChevronDown 
                  size={18} 
                  className={`text-gray-500 transition-transform ${expandedFilter === 'level' ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {expandedFilter === 'level' && (
                <div className="space-y-2 ml-1">
                  {levels.map((level) => (
                    <div key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`level-${level}`}
                        checked={selectedLevels.includes(level)}
                        onChange={() => handleLevelChange(level)}
                        className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`level-${level}`} className="ml-2 text-sm text-gray-700 capitalize">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rating Filter */}
            <div>
              <button 
                onClick={() => toggleFilter('rating')}
                className="flex items-center justify-between w-full mb-3"
              >
                <h3 className="font-medium text-gray-800">Ratings</h3>
                <ChevronDown 
                  size={18} 
                  className={`text-gray-500 transition-transform ${expandedFilter === 'rating' ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {expandedFilter === 'rating' && (
                <div className="space-y-3 ml-1">
                  {[4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded-md"
                      onClick={() => setRatingFilter(rating === ratingFilter ? null : rating)}
                    >
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-700">& Up</span>
                      {ratingFilter === rating && (
                        <span className="ml-auto">
                          <X size={14} className="text-gray-500" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {searchTerm ? `Results for "${searchTerm}"` : "Available Courses"}
              </h2>
              <p className="text-gray-600">{filteredCourses.length} courses found</p>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div 
                  key={course._id} 
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100"
                >
                  <div className="relative h-52">
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-block bg-purple-600 bg-opacity-90 text-white text-xs font-medium px-2 py-1 rounded-md capitalize">
                        {course.level}
                      </span>
                    </div>
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* <div className="p-4 w-full flex justify-between items-center">
                        <button 
                          onClick={() => handleDetail(course._id)} 
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Enroll Now
                        </button>
                        <button 
                          onClick={() => addToCart(course)}
                          disabled={isInCart(course._id)}
                          className="bg-white hover:bg-gray-100 text-purple-700 p-2 rounded-full shadow-md transition-colors"
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div> */}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < Math.floor(course.averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">
                        ({course.averageRating.toFixed(1)})
                      </span>
                      <span className="ml-auto text-sm text-gray-500">{course.enrolledCount} students</span>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1 group-hover:text-purple-700 transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="font-bold text-lg text-purple-700">${course.price}</span>
                      <div className="flex gap-2">
                        <button 
                         onClick={() => addToCart(course)}
                         disabled={isInCart(course._id)}
                          // onClick={() => handleAddToCart(course._id)}
                          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors"
                        >
                          <ShoppingCart size={16} />
                          {isInCart(course._id) ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {filteredCourses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl p-8 mt-4">
                <div className="bg-purple-100 p-6 rounded-full mb-6">
                  <Search size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6 max-w-md">Try adjusting your search or filter criteria to find what you're looking for</p>
                <button 
                  onClick={clearFilters}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;