import React, { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, X, FileVideo, Edit2,  ArrowLeftIcon, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { backendRequest } from '@/Helper/backendRequest';
import { notifyResponse } from '@/Helper/notify';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';

interface FormErrors {
  [key: string]: string;
}

interface VideoData {
  id: string;
  title: string;
  description: string;
  file: File | null;
  url: string;
  isNew?: boolean;
  isEdited?: boolean;
}

interface CourseFormData {
  success?: boolean;
  id: string;
  title: string;
  price: string;
  language: string;
  description: string;
  level: string;
  category: string;
  thumbnail: string;
  videos: VideoData[];
}

const UpdateCourse: React.FC = () => {
  const [originalData, setOriginalData] = useState<CourseFormData>({
    id: '',
    title: '',
    price: '',
    language: '',
    description: '',
    level: 'beginner',
    category: '',
    thumbnail: '',
    videos: [],
  });
  
  const [courseData, setCourseData] = useState({
    id: '',
    title: '',
    price: '',
    language: '',
    description: '',
    level: 'beginner',
    category: '',
    thumbnail: null as File | null,
    thumbnailUrl: '',
    videos: [] as VideoData[],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(null);
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const params = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      console.log("courseid is ",params.courseId)
      try {
        const response = await backendRequest<CourseFormData>('GET', `/course/${params.courseId}`);
  
        if (response.success) {
          const dummyData = response;
  
          setOriginalData({
            ...dummyData,
            videos: dummyData.videos.map((v) => ({
              id: v.id,
              title: v.title,
              description: v.description,
              file: null, 
              url: v.url,
            })),
          });
  
          setCourseData({
            ...dummyData,
            thumbnail: null, 
            thumbnailUrl: dummyData.thumbnail, 
            videos: dummyData.videos.map((v) => ({
              id: v.id,
              title: v.title,
              description: v.description,
              file: null, 
              url: v.url,
            })),
          });
  
          setThumbnailPreview(dummyData.thumbnail);
        } else {
          console.error('Error:', response.detail);
          notifyResponse(response)
          navigate('/teacher/all-courses');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCourseData();
  }, []);

  const validateField = (field: string, value: any): string => {
    switch(field) {
      case 'title':
        return !value.trim() ? 'Course title is required' : '';
      case 'price':
        if (isNaN(Number(value))) return 'Price must be a valid number';
        if (Number(value) < 0) return 'Price must be a positive number';
        return '';
      case 'language':
        return !value.trim() ? 'Language is required' : '';
      case 'description':
        return !value.trim() ? 'Description is required' : '';
      case 'category':
        return !value.trim() ? 'Category is required' : '';
      case 'videoTitle':
        return !value.trim() ? 'Video title is required' : '';
      case 'videoDescription':
        if (!value.trim()) return 'Video description is required';
        if (value.length < 40) return 'Video description must be at least 40 characters long';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCourseData({ ...courseData, [field]: value });
    setErrors({ ...errors, [field]: validateField(field, value) });
    setUnsavedChanges(true);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setCourseData({ ...courseData, thumbnail: file });
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors({ ...errors, thumbnail: '' });
      setUnsavedChanges(true);
    }
  };

  const removeThumbnail = () => {
    if (thumbnailPreview && thumbnailPreview !== courseData.thumbnailUrl) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    
    if (courseData.thumbnailUrl) {
      setThumbnailPreview(courseData.thumbnailUrl);
      setCourseData({ ...courseData, thumbnail: null });
    } else {
      setThumbnailPreview(null);
      setCourseData({ ...courseData, thumbnail: null });
      setErrors({ ...errors, thumbnail: 'Course thumbnail is required' });
    }
    
    setUnsavedChanges(true);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    const newVideos = newFiles.map(file => ({
      id: '', // New videos won't have an ID
      title: '',
      description: '',
      file: file,
      url: '',
      isNew: true
    }));

    setCourseData({
      ...courseData,
      videos: [...courseData.videos, ...newVideos],
    });

    // Auto-expand the newly added videos
    if (newVideos.length > 0) {
      const newVideoIndex = courseData.videos.length;
      setExpandedVideo(`video-${newVideoIndex}`);
    }
    
    setUnsavedChanges(true);
  };

  const handleVideoTitleChange = (index: number, value: string) => {
    const updatedVideos = [...courseData.videos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      title: value,
      isEdited: true
    };
    
    setCourseData({ ...courseData, videos: updatedVideos });
    setErrors({ ...errors, [`videoTitle${index}`]: validateField('videoTitle', value) });
    setUnsavedChanges(true);
  };

  const handleVideoDescriptionChange = (index: number, value: string) => {
    const updatedVideos = [...courseData.videos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      description: value,
      isEdited: true
    };
    
    setCourseData({ ...courseData, videos: updatedVideos });
    setErrors({ ...errors, [`videoDescription${index}`]: validateField('videoDescription', value) });
    setUnsavedChanges(true);
  };

  const handleVideoFileReplace = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const updatedVideos = [...courseData.videos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      file: file,
      isEdited: true
    };
    
    setCourseData({ ...courseData, videos: updatedVideos });
    setUnsavedChanges(true);
  };

 

  const saveSection = async (section: string) => {
    let hasErrors = false;
    const newErrors: FormErrors = {};

    if (section === 'info') {
      ['title', 'price', 'language', 'category'].forEach(field => {
        const error = validateField(field, courseData[field as keyof typeof courseData]);
        if (error) {
          newErrors[field] = error;
          hasErrors = true;
        }
      });
    } else if (section === 'description') {
      const error = validateField('description', courseData.description);
      if (error) {
        newErrors.description = error;
        hasErrors = true;
      }
    } else if (section === 'video' && editingVideoIndex !== null) {
      const video = courseData.videos[editingVideoIndex];
      const titleError = validateField('videoTitle', video.title);
      const descError = validateField('videoDescription', video.description);
      
      if (titleError) {
        newErrors[`videoTitle${editingVideoIndex}`] = titleError;
        hasErrors = true;
      }
      
      if (descError) {
        newErrors[`videoDescription${editingVideoIndex}`] = descError;
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    if (hasErrors) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('courseId', courseData.id);

      if (section === 'info') {
        formData.append('title', courseData.title);
        formData.append('price', courseData.price);
        formData.append('language', courseData.language);
        formData.append('level', courseData.level);
        formData.append('category', courseData.category);
      } else if (section === 'description') {
        formData.append('description', courseData.description);
      } else if (section === 'thumbnail' && courseData.thumbnail) {
        formData.append('thumbnail', courseData.thumbnail);
      } else if (section === 'video' && editingVideoIndex !== null) {
        const video = courseData.videos[editingVideoIndex];
        formData.append('videoId', video.id || '');
        formData.append('videoTitle', video.title);
        formData.append('videoDescription', video.description);
        if (video.file) {
          formData.append('videoFile', video.file);
        }
      }

      await backendRequest('PUT', `/course/${params.courseId}`, formData, {}, true);
      
      console.log(`Updated ${section} successfully`);
      notifyResponse({ success: true, detail: `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully` });
      
      if (section === 'video') {
        setOpenDialog(null);
        setEditingVideoIndex(null);
      } else {
        setEditingSection(null);
      }
      
      if (section === 'info') {
        setOriginalData({
          ...originalData,
          title: courseData.title,
          price: courseData.price,
          language: courseData.language,
          level: courseData.level,
          category: courseData.category,
        });
      } else if (section === 'description') {
        setOriginalData({
          ...originalData,
          description: courseData.description
        });
      } else if (section === 'thumbnail') {
        setOriginalData({
          ...originalData,
          thumbnail: thumbnailPreview || '',
        });
      } else if (section === 'video' && editingVideoIndex !== null) {
        const updatedOriginalVideos = [...originalData.videos];
        updatedOriginalVideos[editingVideoIndex] = {
          ...updatedOriginalVideos[editingVideoIndex],
          title: courseData.videos[editingVideoIndex].title,
          description: courseData.videos[editingVideoIndex].description,
          file: null,
        };
        setOriginalData({
          ...originalData,
          videos: updatedOriginalVideos
        });
      }
      
      setUnsavedChanges(false);
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      notifyResponse({ success: false, message: `Failed to update ${section}. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllChanges = async () => {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    // Validate all fields
    ['title', 'price', 'language', 'category', 'description'].forEach(field => {
      const error = validateField(field, courseData[field as keyof typeof courseData]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    // Validate videos
    courseData.videos.forEach((video, index) => {
      const titleError = validateField('videoTitle', video.title);
      if (titleError) {
        newErrors[`videoTitle${index}`] = titleError;
        hasErrors = true;
      }

      const descError = validateField('videoDescription', video.description);
      if (descError) {
        newErrors[`videoDescription${index}`] = descError;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    if (hasErrors) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Append basic course info
      formData.append('title', courseData.title);
      formData.append('price', courseData.price);
      formData.append('language', courseData.language);
      formData.append('description', courseData.description);
      formData.append('level', courseData.level);
      formData.append('category', courseData.category);

      // Append thumbnail if changed
      if (courseData.thumbnail) {
        formData.append('thumbnail', courseData.thumbnail);
      }

      // Append videos in the same format as CreateCourse
      courseData.videos.forEach((video, index) => {
        if (video.file) {
          formData.append(`video[${index}].file`, video.file);
        }
        formData.append(`video[${index}].title`, video.title);
        formData.append(`video[${index}].description`, video.description);
        
        // Include video ID for existing videos
        if (video.id) {
          formData.append(`video[${index}].id`, video.id);
        }
      });

      const response = await backendRequest('PUT', `/course/${params.courseId}`, formData, {}, true);
      
      console.log('Course updated successfully');
      notifyResponse(response);
      
      if (response.success) {
        setUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error updating course:', error);
      notifyResponse({ success: false, message: 'Failed to update course. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const truncateFileName = (fileName: string, maxLength: number = 15) => {
    if (fileName.length > maxLength) {
      return `${fileName.substring(0, maxLength)}...`;
    }
    return fileName;
  };

  const videoFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className="mx-auto py-3 bg-gray-900 min-h-screen">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => navigate('/teacher/all-courses')}
        className="flex items-center gap-1 mb-2 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Back
      </Button>
      <Card className="shadow-xl border-0 bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-custom_primary to-custom_primary_hover text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Update Course</CardTitle>
              <CardDescription className="text-gray-200 mt-1">
                Edit your course details and content
              </CardDescription>
            </div>
            {unsavedChanges && (
              <Badge variant="outline" className="bg-amber-500 text-white border-amber-400 px-3 py-1">
                Unsaved changes
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b px-6 bg-gray-700">
              <TabsList className="bg-transparent h-14">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-custom_primary data-[state=active]:text-custom_primary rounded-none text-gray-200 hover:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="videos" 
                  className="data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-custom_primary data-[state=active]:text-custom_primary rounded-none text-gray-200 hover:text-white"
                >
                  Videos
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-8 mt-0 bg-gray-900">
              {/* Course Basic Info */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-700 border-b border-gray-600">
                  <h3 className="font-medium text-gray-200">Course Information</h3>
                  {editingSection === 'info' ? (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingSection(null)}
                        disabled={isLoading}
                        className="bg-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => saveSection('info')}
                        disabled={isLoading}
                        className="bg-custom_primary hover:bg-custom_primary_hover"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingSection('info')}
                      className="flex items-center gap-1 bg-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </Button>
                  )}
                </div>
                <div className="p-4">
                  {editingSection === 'info' ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Course Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={courseData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className={`${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''} bg-gray-700 text-gray-200 border-gray-600`}
                        />
                        {errors.title && (
                          <div className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.title}
                          </div>
                        )}
                        {!errors.title && courseData.title && (
                          <div className="text-green-400 text-sm flex items-center gap-1">
                            <Check className="h-3 w-3" /> Looks good
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Price ($) <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          value={courseData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className={`${errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''} bg-gray-700 text-gray-200 border-gray-600`}
                        />
                        {errors.price && (
                          <div className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.price}
                          </div>
                        )}
                        {!errors.price && courseData.price && (
                          <div className="text-green-400 text-sm flex items-center gap-1">
                            <Check className="h-3 w-3" /> Looks good
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Language <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={courseData.language}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          className={`${errors.language ? 'border-red-500 focus-visible:ring-red-500' : ''} bg-gray-700 text-gray-200 border-gray-600`}
                        />
                        {errors.language && (
                          <div className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.language}
                          </div>
                        )}
                        {!errors.language && courseData.language && (
                          <div className="text-green-400 text-sm flex items-center gap-1">
                            <Check className="h-3 w-3" /> Looks good
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={courseData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className={`${errors.category ? 'border-red-500 focus-visible:ring-red-500' : ''} bg-gray-700 text-gray-200 border-gray-600`}
                        />
                        {errors.category && (
                          <div className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.category}
                          </div>
                        )}
                        {!errors.category && courseData.category && (
                          <div className="text-green-400 text-sm flex items-center gap-1">
                            <Check className="h-3 w-3" /> Looks good
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Level <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={courseData.level}
                          onValueChange={(value) => handleInputChange('level', value)}
                        >
                          <SelectTrigger className="bg-gray-700 text-gray-200 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 text-gray-200 border-gray-700">
                            <SelectItem value="beginner" className="hover:bg-gray-700">Beginner</SelectItem>
                            <SelectItem value="intermediate" className="hover:bg-gray-700">Intermediate</SelectItem>
                            <SelectItem value="advanced" className="hover:bg-gray-700">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        {courseData.level && (
                          <div className="text-green-400 text-sm flex items-center gap-1">
                            <Check className="h-3 w-3" /> Looks good
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Course Title</p>
                        <p className="font-medium text-gray-200">{courseData.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Price</p>
                        <p className="font-medium text-gray-200">${courseData.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Language</p>
                        <p className="font-medium text-gray-200">{courseData.language}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Category</p>
                        <p className="font-medium text-gray-200">{courseData.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Level</p>
                        <p className="font-medium text-gray-200 capitalize">{courseData.level}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Description */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-700 border-b border-gray-600">
                  <h3 className="font-medium text-gray-200">Course Description</h3>
                  {editingSection === 'description' ? (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingSection(null)}
                        disabled={isLoading}
                        className="bg-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => saveSection('description')}
                        disabled={isLoading}
                        className="bg-custom_primary hover:bg-custom_primary_hover"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingSection('description')}
                      className="flex items-center gap-1 bg-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </Button>
                  )}
                </div>
                <div className="p-4">
                  {editingSection === 'description' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={courseData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className={`min-h-32 ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''} bg-gray-700 text-gray-200 border-gray-600`}
                      />
                      {errors.description && (
                        <div className="text-red-400 text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.description}
                        </div>
                      )}
                      {!errors.description && courseData.description && (
                        <div className="text-green-400 text-sm flex items-center gap-1">
                          <Check className="h-3 w-3" /> Looks good
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-300">{courseData.description}</p>
                  )}
                </div>
              </div>

              {/* Course Thumbnail */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-700 border-b border-gray-600">
                  <h3 className="font-medium text-gray-200">Course Thumbnail</h3>
                  {editingSection === 'thumbnail' ? (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setEditingSection(null);
                          if (courseData.thumbnailUrl && !courseData.thumbnail) {
                            setThumbnailPreview(courseData.thumbnailUrl);
                          }
                        }}
                        disabled={isLoading}
                        className="bg-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => saveSection('thumbnail')}
                        disabled={isLoading || !courseData.thumbnail}
                        className="bg-custom_primary hover:bg-custom_primary_hover"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingSection('thumbnail')}
                      className="flex items-center gap-1 bg-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </Button>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-center">
                    {editingSection === 'thumbnail' ? (
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 w-full max-w-md flex flex-col items-center space-y-4">
                        {thumbnailPreview ? (
                          <div className="relative">
                            <img
                              src={thumbnailPreview}
                              alt="Course Thumbnail Preview"
                              className="rounded-lg w-full h-48 object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeThumbnail}
                              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center space-y-2">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-400">
                              Upload a thumbnail image (JPEG, PNG)
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={thumbnailInputRef}
                          onChange={handleThumbnailUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => thumbnailInputRef.current?.click()}
                          className="bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white"
                        >
                          {thumbnailPreview ? 'Change Thumbnail' : 'Upload Thumbnail'}
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={thumbnailPreview || courseData.thumbnailUrl}
                          alt="Course Thumbnail"
                          className="rounded-lg w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="p-6 space-y-8 mt-0 bg-gray-900">
              {/* Video List */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-700 border-b border-gray-600">
                  <h3 className="font-medium text-gray-200">Course Videos</h3>
                  <Button
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                    className="bg-custom_primary hover:bg-custom_primary_hover"
                  >
                    <Upload className="h-4 w-4 mr-2" /> Upload Videos
                  </Button>
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    accept="video/*"
                    multiple
                    className="hidden"
                  />
                </div>
                <div className="p-4">
                  {courseData.videos.length === 0 ? (
                    <div className="text-center py-8">
                      <FileVideo className="h-10 w-10 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-400 mt-2">
                        No videos uploaded yet. Click the button above to upload videos.
                      </p>
                    </div>
                  ) : (
                    <Accordion 
                      type="single" 
                      collapsible 
                      className="w-full"
                      value={expandedVideo || undefined}
                      onValueChange={setExpandedVideo}
                    >
                      {courseData.videos.map((video, index) => (
                        <AccordionItem key={index} value={`video-${index}`} className="border-b border-gray-700">
                          <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center space-x-4 w-full">
                              <div className="flex-1 text-left">
                                <p className="font-medium text-gray-200">
                                  {video.title || `Video ${index + 1}`}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {video.file ? truncateFileName(video.file.name) : video.url}
                                </p>
                              </div>
                             
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-300">
                                    Video Title <span className="text-red-500">*</span>
                                  </label>
                                  <Input
                                    value={video.title}
                                    onChange={(e) => handleVideoTitleChange(index, e.target.value)}
                                    className={`${errors[`videoTitle${index}`] ? 'border-red-500 focus-visible:ring-red-500' : ''} bg-gray-700 text-gray-200 border-gray-600`}
                                  />
                                  {errors[`videoTitle${index}`] && (
                                    <div className="text-red-400 text-sm flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" /> {errors[`videoTitle${index}`]}
                                    </div>
                                  )}
                                  {!errors[`videoTitle${index}`] && video.title && (
                                    <div className="text-green-400 text-sm flex items-center gap-1">
                                      <Check className="h-3 w-3" /> Looks good
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-300">
                                    Video File
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => videoFileInputRefs.current[index]?.click()}
                                      className="w-full bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white"
                                    >
                                      {video.file ? 'Replace Video' : 'Upload Video'}
                                    </Button>
                                    <input
                                      type="file"
                                      ref={(el) => (videoFileInputRefs.current[index] = el)}
                                      onChange={(e) => handleVideoFileReplace(index, e)}
                                      accept="video/*"
                                      className="hidden"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                  Video Description <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                  value={video.description}
                                  onChange={(e) => handleVideoDescriptionChange(index, e.target.value)}
                                  className={`${errors[`videoDescription${index}`] ? 'border-red-500 focus-visible:ring-red-500' : ''} bg-gray-700 text-gray-200 border-gray-600`}
                                />
                                {errors[`videoDescription${index}`] && (
                                  <div className="text-red-400 text-sm flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors[`videoDescription${index}`]}
                                  </div>
                                )}
                                {!errors[`videoDescription${index}`] && video.description && (
                                  <div className="text-green-400 text-sm flex items-center gap-1">
                                    <Check className="h-3 w-3" /> Looks good
                                  </div>
                                )}
                              </div>
                              {/* <div className="flex justify-end">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeVideo(index)}
                                  className="mt-2"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Remove Video
                                </Button>
                              </div> */}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Footer with Save All Button */}
        <div className="p-6 border-t border-gray-700 bg-gray-800">
          <div className="flex justify-end">
            <Button
              onClick={saveAllChanges}
              disabled={isLoading || !unsavedChanges}
              className="bg-custom_primary hover:bg-custom_primary_hover"
            >
              {isLoading ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UpdateCourse;



