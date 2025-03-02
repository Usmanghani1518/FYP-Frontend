import React, { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, X, Check, FileVideo, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

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
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [thumbnailHeight, setThumbnailHeight] = useState(0);
  const [videosHeight, setVideosHeight] = useState(0);
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailCardRef = useRef<HTMLDivElement>(null);
  const videosCardRef = useRef<HTMLDivElement>(null);

  // Synchronize heights of the two cards
  useEffect(() => {
    const syncHeights = () => {
      if (thumbnailCardRef.current && videosCardRef.current) {
        const thumbHeight = thumbnailCardRef.current.clientHeight;
        const vidHeight = videosCardRef.current.clientHeight;
        
        const maxHeight = Math.max(thumbHeight, vidHeight);
        setThumbnailHeight(maxHeight);
        setVideosHeight(maxHeight);
      }
    };

    syncHeights();
    // Re-check heights when content changes
    window.addEventListener('resize', syncHeights);
    return () => window.removeEventListener('resize', syncHeights);
  }, [formData.thumbnail, formData.videos, thumbnailPreview, videoPreviewUrls]);

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
    setIsSubmitted(true);
    const newErrors = validateForm();
    setErrors(newErrors);
    
    // Mark all fields as touched on submit
    const allTouched: {[key: string]: boolean} = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Handle form submission
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    if (isSubmitted) {
      const newErrors = validateForm();
      setErrors(newErrors);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const updatedVideos = [...formData.videos, ...newFiles];
    setFormData({ ...formData, videos: updatedVideos });
    
    // Create preview URLs for videos and add to existing ones
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setVideoPreviewUrls([...videoPreviewUrls, ...newPreviewUrls]);
  };

  const removeVideo = (index: number) => {
    const newVideos = [...formData.videos];
    newVideos.splice(index, 1);
    
    const newPreviewUrls = [...videoPreviewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    
    setFormData({ ...formData, videos: newVideos });
    setVideoPreviewUrls(newPreviewUrls);
  };

  const removeThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview(null);
    setFormData({ ...formData, thumbnail: null });
  };

  const renderInputField = (
    label: string,
    name: string,
    type: string = 'text',
    placeholder: string = ''
  ) => {
    const isError = (touched[name] || isSubmitted) && errors[name];
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center">
          {label} <span className="text-red-500 ml-1">*</span>
        </label>
        <Input
          type={type}
          className={isError ? 'border-red-500 focus-visible:ring-red-500' : ''}
          value={formData[name as keyof typeof formData] as string}
          onChange={(e) => setFormData({...formData, [name]: e.target.value})}
          onBlur={() => handleBlur(name)}
          placeholder={placeholder}
        />
        {isError && (
          <div className="flex items-center gap-1 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors[name]}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Create New Course</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 pt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {renderInputField('Course Title', 'title', 'text', 'Enter course title')}
            {renderInputField('Price ($)', 'price', 'number', 'Enter course price')}
            {renderInputField('Language', 'language', 'text', 'Enter course language')}
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                Level <span className="text-red-500 ml-1">*</span>
              </label>
              <Select 
                value={formData.level} 
                onValueChange={(value) => setFormData({...formData, level: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              Description <span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              className={`min-h-32 ${(touched.description || isSubmitted) && errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              onBlur={() => handleBlur('description')}
              placeholder="Enter detailed course description"
            />
            {(touched.description || isSubmitted) && errors.description && (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Thumbnail Upload Card */}
            <div 
              ref={thumbnailCardRef}
              style={{ height: thumbnailHeight > 0 ? `${thumbnailHeight}px` : 'auto' }}
              className="flex flex-col"
            >
              <label className="text-sm font-medium flex items-center mb-2">
                Course Thumbnail <span className="text-red-500 ml-1">*</span>
              </label>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer hover:bg-gray-50 relative flex-1 flex flex-col justify-center items-center
                  ${(touched.thumbnail || isSubmitted) && errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                onClick={() => thumbnailInputRef.current?.click()}
              >
                {thumbnailPreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      className="max-h-48 object-contain rounded mx-auto"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeThumbnail();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                      <ImageIcon className="h-8 w-8 text-indigo-500" />
                    </div>
                    <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (max 2MB)</p>
                  </div>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  onBlur={() => handleBlur('thumbnail')}
                />
                {(touched.thumbnail || isSubmitted) && errors.thumbnail && (
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 text-red-500 text-sm bg-red-50 bg-opacity-80 py-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.thumbnail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Videos Upload Card */}
            <div 
              ref={videosCardRef}
              style={{ height: videosHeight > 0 ? `${videosHeight}px` : 'auto' }}
              className="flex flex-col"
            >
              <label className="text-sm font-medium flex items-center mb-2">
                Course Videos <span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors relative flex-1 flex flex-col
                  ${(touched.videos || isSubmitted) && errors.videos ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              >
                {formData.videos.length === 0 ? (
                  <div 
                    className="flex flex-col items-center justify-center h-30 cursor-pointer hover:bg-gray-50"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                      <FileVideo className="h-8 w-8 text-indigo-500" />
                    </div>
                    <p className="text-sm text-gray-600">Click to upload course videos</p>
                    <p className="text-xs text-gray-400 mt-1">MP4, MOV or WEBM (max 500MB each)</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-5 w-5" />
                        <span className="font-medium">{formData.videos.length} video(s) selected</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs flex items-center gap-1 text-indigo-500 border-indigo-200 hover:bg-indigo-50"
                        onClick={() => videoInputRef.current?.click()}
                      >
                        <Upload className="h-3 w-3" />
                        <span>Add more</span>
                      </Button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-1 max-h-44 min-h-24 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                      {formData.videos.map((video, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-indigo-50 rounded-md mb-2 group">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileVideo className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                            <span className="text-sm truncate">{video.name}</span>
                          </div>
                          <button
                            type="button"
                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeVideo(index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <input
                  ref={videoInputRef}
                  type="file"
                  className="hidden"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  onBlur={() => handleBlur('videos')}
                />
                {(touched.videos || isSubmitted) && errors.videos && (
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 text-red-500 text-sm bg-red-50 bg-opacity-80 py-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.videos}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Create Course
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCourse;