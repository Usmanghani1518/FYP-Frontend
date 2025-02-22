import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FormErrors {
  [key: string]: string;
}

const CreateCourse: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    language: '',
    description: '',
    level: 'beginner',
    thumbnail: null as File | null,
    videos: [] as File[],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    if (!formData.language.trim()) {
      newErrors.language = 'Language is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.thumbnail) {
      newErrors.thumbnail = 'Course thumbnail is required';
    }
    
    if (formData.videos.length === 0) {
      newErrors.videos = 'At least one course video is required';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Handle form submission
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const newErrors = validateForm();
    setErrors(newErrors);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, videos: files });
  };

  const renderInputField = (
    label: string,
    name: string,
    type: string = 'text',
    placeholder: string = ''
  ) => {
    const isError = touched[name] && errors[name];
    
    return (
      <div className='relative'>
        <label className="block text-sm font-medium mb-2">
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          type={type}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary transition-colors
            ${isError ? 'border-red-500' : 'border-gray-300'}`}
          value={formData[name as keyof typeof formData] as string}
          onChange={(e) => setFormData({...formData, [name]: e.target.value})}
          onBlur={() => handleBlur(name)}
          placeholder={placeholder}
        />
        {isError && (
          <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors[name]}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 relative">
      <h2 className="text-2xl font-bold mb-6">Create New Course</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {renderInputField('Course Title', 'title', 'text', 'Enter course title')}
          {renderInputField('Price ($)', 'price', 'number', 'Enter course price')}
          {renderInputField('Language', 'language', 'text', 'Enter course language')}
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Level <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary h-32
              ${touched.description && errors.description ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            onBlur={() => handleBlur('description')}
          />
          {touched.description && errors.description && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.description}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${touched.thumbnail && errors.thumbnail ? 'border-red-500' : 'border-gray-300'}`}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Upload course thumbnail</p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setFormData({...formData, thumbnail: e.target.files?.[0] || null})}
              onBlur={() => handleBlur('thumbnail')}
            />
            {touched.thumbnail && errors.thumbnail && (
              <div className="flex items-center justify-center gap-1 mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.thumbnail}</span>
              </div>
            )}
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${touched.videos && errors.videos ? 'border-red-500' : 'border-gray-300'}`}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Upload course videos</p>
            <input
              type="file"
              className="hidden"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
              onBlur={() => handleBlur('videos')}
            />
            {formData.videos.length > 0 && (
              <p className="mt-2 text-sm text-green-600">
                {formData.videos.length} video(s) selected
              </p>
            )}
            {touched.videos && errors.videos && (
              <div className="flex items-center justify-center gap-1 mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.videos}</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-lg transition-colors font-medium"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;