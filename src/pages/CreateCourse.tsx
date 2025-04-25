import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, X, Check, FileVideo, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { backendRequest } from '@/Helper/backendRequest';
import { notifyResponse } from '@/Helper/notify';
import { useNavigate } from 'react-router-dom';

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
    category: '',
    thumbnail: null as File | null,
    videos: [] as File[],
    videoTitles: [] as string[],
    videoDescriptions: [] as string[],
  });

  const categories = [
    'Development',
    'Design',
    'Business',
    'Marketing',
    'Personal Development'
  ];

  const languages = [
    'English',
    'Urdu',
    'Spanish',
    'French',
    'Arabic'
  ];

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    } else if (Number(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.language.trim()) {
      newErrors.language = 'Language is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 100) {
      newErrors.description = 'Description should be at least 100 characters';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.thumbnail) {
      newErrors.thumbnail = 'Course thumbnail is required';
    }

    if (formData.videos.length === 0) {
      newErrors.videos = 'At least one course video is required';
    }

    formData.videoTitles.forEach((title, index) => {
      if (!title.trim()) {
        newErrors[`videoTitle${index}`] = 'Video title is required';
      }
    });

    formData.videoDescriptions.forEach((description, index) => {
      if (!description.trim()) {
        newErrors[`videoDescription${index}`] = 'Video description is required';
      } else if (description.length < 40) {
        newErrors[`videoDescription${index}`] = 'Video description must be at least 40 characters long';
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors = validateForm();
    setErrors(newErrors);

    const allTouched: { [key: string]: boolean } = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (Object.keys(newErrors).length === 0) {
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('language', formData.language);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('category', formData.category);

      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      formData.videos.forEach((video, index) => {
        formDataToSend.append(`video[${index}].file`, video);
        formDataToSend.append(`video[${index}].title`, formData.videoTitles[index]);
        formDataToSend.append(`video[${index}].description`, formData.videoDescriptions[index]);
      });

      setIsSubmitting(true);
      try {
        const response = await backendRequest('POST', "/course/create", formDataToSend, {}, true);

        console.log('Response:', response);
        notifyResponse(response);
        if (response.success) {
          navigate("/teacher/all-courses");
        }

        if (response.success) {
          setFormData({
            title: '',
            price: '',
            language: '',
            description: '',
            level: 'beginner',
            category: '',
            thumbnail: null,
            videos: [],
            videoTitles: [],
            videoDescriptions: [],
          });
          setThumbnailPreview(null);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        console.log("Form submitted successfully!");
        setIsSubmitting(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, type: 'thumbnail' | 'video') => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'thumbnail' | 'video') => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === 'thumbnail') {
        handleThumbnailUpload({ target: { files: [files[0]] } } as React.ChangeEvent<HTMLInputElement>);
      } else {
        handleVideoUpload({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const newErrors = validateForm();
    setErrors(newErrors);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (!file.type.match('image.*')) {
        setErrors({ ...errors, thumbnail: 'Please upload an image file' });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, thumbnail: 'File size should be less than 2MB' });
        return;
      }
      
      setFormData({ ...formData, thumbnail: file });
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors({ ...errors, thumbnail: '' });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    // Validate video files
    const validFiles = newFiles.filter(file => {
      if (!file.type.match('video.*')) {
        return false;
      }
      if (file.size > 500 * 1024 * 1024) {
        return false;
      }
      return true;
    });

    if (validFiles.length !== newFiles.length) {
      setErrors({ ...errors, videos: 'Please upload valid video files (max 500MB each)' });
      return;
    }

    const updatedVideos = [...formData.videos, ...validFiles];
    const newTitles = [...formData.videoTitles, ...validFiles.map(() => '')];
    const newDescriptions = [...formData.videoDescriptions, ...validFiles.map(() => '')];

    setFormData({
      ...formData,
      videos: updatedVideos,
      videoTitles: newTitles,
      videoDescriptions: newDescriptions,
    });

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setVideoPreviewUrls([...videoPreviewUrls, ...newPreviewUrls]);
    setErrors({ ...errors, videos: '' });
  };

  const removeVideo = (index: number) => {
    const newVideos = [...formData.videos];
    newVideos.splice(index, 1);

    const newTitles = [...formData.videoTitles];
    newTitles.splice(index, 1);

    const newDescriptions = [...formData.videoDescriptions];
    newDescriptions.splice(index, 1);

    setFormData({
      ...formData,
      videos: newVideos,
      videoTitles: newTitles,
      videoDescriptions: newDescriptions,
    });

    const newPreviewUrls = [...videoPreviewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setVideoPreviewUrls(newPreviewUrls);

    if (newVideos.length === 0) {
      setErrors({ ...errors, videos: 'At least one course video is required' });
    }
  };

  const removeThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview(null);
    setFormData({ ...formData, thumbnail: null });
    setErrors({ ...errors, thumbnail: 'Course thumbnail is required' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleVideoTitleChange = (index: number, value: string) => {
    const newTitles = [...formData.videoTitles];
    newTitles[index] = value;
    setFormData({ ...formData, videoTitles: newTitles });
    setErrors({ ...errors, [`videoTitle${index}`]: '' });
  };

  const handleVideoDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...formData.videoDescriptions];
    newDescriptions[index] = value;
    setFormData({ ...formData, videoDescriptions: newDescriptions });
    setErrors({ ...errors, [`videoDescription${index}`]: '' });
  };

  const truncateFileName = (fileName: string, maxLength: number = 15) => {
    if (fileName.length > maxLength) {
      const extension = fileName.split('.').pop();
      const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
      const truncatedName = nameWithoutExtension.substring(0, maxLength - extension!.length - 3);
      return `${truncatedName}...${extension}`;
    }
    return fileName;
  };

  const renderInputField = (
    label: string,
    name: string,
    type: string = 'text',
    placeholder: string = ''
  ) => {
    const isError = (touched[name] || Object.keys(errors).length > 0) && errors[name];
    const value = formData[name as keyof typeof formData] as string;

    return (
      <div className="space-y-2 bg-gray-600">
        <label className="text-sm font-medium text-gray-100 flex items-center">
          {label} <span className="text-red-500 ml-1">*</span>
          {type === 'number' && (
            <span className="text-xs text-gray-400 ml-auto">USD</span>
          )}
        </label>
        <Input
          type={type}
          className={`border-gray-500 focus:border-gray-400 ${isError ? 'border-red-500 focus-visible:ring-red-500' : value && !isError ? 'border-green-500' : ''} bg-gray-800 text-gray-100 placeholder-gray-400`}
          value={value}
          onChange={(e) => handleInputChange(name, e.target.value)}
          onBlur={() => handleBlur(name)}
          placeholder={placeholder}
        />
        {isError ? (
          <div className="flex items-center gap-1 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors[name]}</span>
          </div>
        ) : value && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <Check className="w-4 h-4" />
            <span>Looks good</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-custom_primary to-custom_primary_hover text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Create New Course</CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-8 bg-gray-900 text-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {renderInputField('Course Title', 'title', 'text', 'Enter course title')}
            {renderInputField('Price ($)', 'price', 'number', 'Enter course price')}

            {/* Language Select Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-100 flex items-center">
                Language <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                value={formData.language}
                onValueChange={(value) => handleInputChange('language', value)}
                onOpenChange={(open) => !open && handleBlur('language')}
              >
                <SelectTrigger className={`border-gray-500 focus:border-white ${touched.language && errors.language ? 'border-red-500 focus-visible:ring-red-500' : formData.language ? 'border-green-500' : ''} bg-gray-800 text-gray-100`}>
                  <SelectValue placeholder="Select language" className="text-gray-100" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang} className="hover:bg-gray-700 focus:bg-gray-700 text-gray-100">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.language && errors.language ? (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.language}</span>
                </div>
              ) : formData.language && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Looks good</span>
                </div>
              )}
            </div>

            {/* Category Select Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-100 flex items-center">
                Category <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                onOpenChange={(open) => !open && handleBlur('category')}
              >
                <SelectTrigger className={`border-gray-500 focus:border-white ${touched.category && errors.category ? 'border-red-500 focus-visible:ring-red-500' : formData.category ? 'border-green-500' : ''} bg-gray-800 text-gray-100`}>
                  <SelectValue placeholder="Select category" className="text-gray-100" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="hover:bg-gray-700 focus:bg-gray-700 text-gray-100">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {touched.category && errors.category ? (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.category}</span>
                </div>
              ) : formData.category && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Looks good</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-100 flex items-center">
                Level <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger className={`border-gray-500 focus:border-white ${formData.level ? 'border-green-500' : ''} bg-gray-800 text-gray-100`}>
                  <SelectValue placeholder="Select level" className="text-gray-100" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                  <SelectItem value="beginner" className="hover:bg-gray-700 focus:bg-gray-700 text-gray-100">Beginner</SelectItem>
                  <SelectItem value="intermediate" className="hover:bg-gray-700 focus:bg-gray-700 text-gray-100">Intermediate</SelectItem>
                  <SelectItem value="advanced" className="hover:bg-gray-700 focus:bg-gray-700 text-gray-100">Advanced</SelectItem>
                </SelectContent>
              </Select>
              {formData.level && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Looks good</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-100 flex items-center">
              Description <span className="text-red-500 ml-1">*</span>
              <span className="text-xs text-gray-400 ml-auto">
                {formData.description.length}/100 (min)
              </span>
            </label>
            <Textarea
              className={`min-h-32 border-gray-500 focus:border-white ${touched.description && errors.description ? 'border-red-500 focus-visible:ring-red-500' : formData.description.length >= 100 ? 'border-green-500' : ''} bg-gray-800 text-gray-100 placeholder-gray-400`}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="Enter detailed course description (minimum 100 characters)"
            />
            {touched.description && errors.description ? (
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.description}</span>
              </div>
            ) : formData.description.length >= 100 && (
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <Check className="w-4 h-4" />
                <span>Great description!</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Thumbnail Upload Card */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-100 flex items-center mb-2">
                Course Thumbnail <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-gray-400 ml-auto">Max 2MB</span>
              </label>
              <div
                className={`border-2 ${isDragging ? 'border-indigo-500' : touched.thumbnail && errors.thumbnail ? 'border-red-500' : thumbnailPreview ? 'border-green-500' : 'border-gray-500'} border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer hover:bg-gray-800 relative flex-1 flex flex-col justify-center items-center`}
                onClick={() => thumbnailInputRef.current?.click()}
                onDragOver={(e) => handleDragOver(e, 'thumbnail')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'thumbnail')}
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
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg transition-transform hover:scale-110"
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
                    <div className={`w-16 h-16 rounded-full ${isDragging ? 'bg-indigo-200' : 'bg-indigo-100'} flex items-center justify-center mb-3 transition-colors`}>
                      <ImageIcon className="h-8 w-8 text-indigo-500" />
                    </div>
                    <p className="text-sm text-gray-300">
                      {isDragging ? 'Drop your thumbnail here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP</p>
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
                {touched.thumbnail && errors.thumbnail && (
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 text-red-400 text-sm bg-gray-800 bg-opacity-90 py-1 rounded-b-md">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.thumbnail}</span>
                  </div>
                )}
                {thumbnailPreview && !errors.thumbnail && (
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 text-green-400 text-sm bg-gray-800 bg-opacity-90 py-1 rounded-b-md">
                    <Check className="w-4 h-4" />
                    <span>Thumbnail selected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Videos Upload Card */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-100 flex items-center mb-2">
                Course Videos <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-gray-400 ml-auto">Max 500MB each</span>
              </label>
              <div
                className={`border-2 ${isDragging ? 'border-indigo-500' : touched.videos && errors.videos ? 'border-red-500' : formData.videos.length > 0 ? 'border-green-500' : 'border-gray-500'} border-dashed rounded-lg p-4 text-center transition-colors relative flex-1 flex flex-col`}
                onDragOver={(e) => handleDragOver(e, 'video')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'video')}
              >
                {formData.videos.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center h-30 cursor-pointer hover:bg-gray-800 py-8"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className={`w-16 h-16 rounded-full ${isDragging ? 'bg-indigo-200' : 'bg-indigo-100'} flex items-center justify-center mb-3 transition-colors`}>
                      <FileVideo className="h-8 w-8 text-indigo-500" />
                    </div>
                    <p className="text-sm text-gray-300">
                      {isDragging ? 'Drop your videos here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">MP4, MOV or WEBM</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-green-400">
                        <Check className="h-5 w-5" />
                        <span className="font-medium">{formData.videos.length} video{formData.videos.length > 1 ? 's' : ''} selected</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs flex items-center gap-1 text-indigo-400 border-indigo-300 hover:bg-indigo-900 hover:text-indigo-300"
                        onClick={() => videoInputRef.current?.click()}
                      >
                        <Upload className="h-3 w-3" />
                        <span>Add more</span>
                      </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-1 max-h-44 min-h-24 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                      {formData.videos.map((video, index) => (
                        <div key={index} className="space-y-2 mb-4">
                          <div className="flex items-center justify-between p-2 bg-gray-800 rounded-md group transition-colors hover:bg-gray-700">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileVideo className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                              <span className="text-sm text-gray-200 truncate" title={video.name}>
                                {truncateFileName(video.name)}
                              </span>
                              <span className="text-xs text-gray-400 ml-auto">
                                {(video.size / (1024 * 1024)).toFixed(1)}MB
                              </span>
                            </div>
                            <button
                              type="button"
                              className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeVideo(index)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="space-y-2 pl-2">
                            <Input
                              type="text"
                              placeholder="Enter video title"
                              value={formData.videoTitles[index] || ''}
                              onChange={(e) => handleVideoTitleChange(index, e.target.value)}
                              className={`border-gray-500 focus:border-white ${errors[`videoTitle${index}`] ? 'border-red-500 focus-visible:ring-red-500' : formData.videoTitles[index] ? 'border-green-500' : ''} bg-gray-800 text-gray-100 placeholder-gray-400`}
                              onBlur={() => handleBlur(`videoTitle${index}`)}
                            />
                            {errors[`videoTitle${index}`] ? (
                              <div className="flex items-center gap-1 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors[`videoTitle${index}`]}</span>
                              </div>
                            ) : formData.videoTitles[index] && (
                              <div className="flex items-center gap-1 text-green-400 text-sm">
                                <Check className="w-4 h-4" />
                                <span>Title added</span>
                              </div>
                            )}

                            <Textarea
                              placeholder="Enter video description (min 40 characters)"
                              value={formData.videoDescriptions[index] || ''}
                              onChange={(e) => handleVideoDescriptionChange(index, e.target.value)}
                              className={`border-gray-500 focus:border-white ${errors[`videoDescription${index}`] ? 'border-red-500 focus-visible:ring-red-500' : formData.videoDescriptions[index]?.length >= 40 ? 'border-green-500' : ''} bg-gray-800 text-gray-100 placeholder-gray-400`}
                              onBlur={() => handleBlur(`videoDescription${index}`)}
                            />
                            <div className="flex justify-between items-center">
                              {errors[`videoDescription${index}`] ? (
                                <div className="flex items-center gap-1 text-red-400 text-sm">
                                  <AlertCircle className="w-4 h-4" />
                                  <span>{errors[`videoDescription${index}`]}</span>
                                </div>
                              ) : formData.videoDescriptions[index]?.length >= 40 && (
                                <div className="flex items-center gap-1 text-green-400 text-sm">
                                  <Check className="w-4 h-4" />
                                  <span>Description complete</span>
                                </div>
                              )}
                              <span className={`text-xs ${formData.videoDescriptions[index]?.length >= 40 ? 'text-green-400' : 'text-gray-400'}`}>
                                {formData.videoDescriptions[index]?.length || 0}/40
                              </span>
                            </div>
                          </div>
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
                {touched.videos && errors.videos && (
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 text-red-400 text-sm bg-gray-800 bg-opacity-90 py-1 rounded-b-md">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.videos}</span>
                  </div>
                )}
                {formData.videos.length > 0 && !errors.videos && (
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 text-green-400 text-sm bg-gray-800 bg-opacity-90 py-1 rounded-b-md">
                    <Check className="w-4 h-4" />
                    <span>Videos added</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-gradient-to-r from-custom_primary to-custom_primary_hover hover:from-indigo-700 hover:to-purple-700 text-white py-6 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Course...
              </>
            ) : (
              'Create Course'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCourse;