import React, { useState } from 'react';
import { Trash2, Plus, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import { API_CONFIG } from '../../api/config';
import SuccessModal from '../../components/modals/SuccessModal';

type ProjectState = 'on-going' | 'completed';
type ProjectType = 'residential' | 'commercial' | 'plot';
type HouseStatus = 'Ready to Move' | 'Sample House Ready';

type ImageItem = {
  id: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
};

type FloorPlan = {
  id: string;
  title: string;
  image: string;
  alt: string;
  file?: File;
  preview?: string;
};

type Amenity = {
  id: string;
  title: string;
  svgOrImage: string;
  alt: string;
  file?: File;
  preview?: string;
};

type AboutUsDetail = {
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  image: {
    alt: string;
    file?: File;
    preview?: string;
  };
};

type FormData = {
  projectTitle: string;
  slug: string;
  brochureFile?: File;
  projectState: ProjectState;
  projectType: ProjectType;
  shortAddress: string;
  projectStatusPercentage: number;
  aboutUsDetail: AboutUsDetail;
  floorPlans: FloorPlan[];
  projectImages: ImageItem[];
  amenities: Amenity[];
  youtubeUrl: string;
  updatedImagesTitle: string;
  updatedImages: ImageItem[];
  locationTitle: string;
  locationTitleText: string;
  locationArea: string;
  number1: string;
  number2: string;
  email1: string;
  email2: string;
  mapIframeUrl: string;
  cardImage: string;
  cardImageFile?: File;
  cardImagePreview?: string;
  cardLocation: string;
  cardAreaFt: string;
  cardProjectType: ProjectType;
  cardHouse: HouseStatus;
  reraNumber: string;
};

const ProjectAdminForm = () => {
  const [formData, setFormData] = useState<FormData>({
    projectTitle: '',
    slug: '',
    projectState: 'on-going',
    projectType: 'residential',
    shortAddress: '',
    projectStatusPercentage: 0,
    aboutUsDetail: {
      description1: '',
      description2: '',
      description3: '',
      description4: '',
      image: {
        alt: '',
      },
    },
    floorPlans: [
      {
        id: Date.now().toString(),
        title: '',
        image: '',
        alt: '',
      },
    ],
    projectImages: [
      {
        id: Date.now().toString() + '_1',
        image: '',
        alt: '',
      },
    ],
    amenities: [
      {
        id: Date.now().toString() + '_2',
        title: '',
        svgOrImage: '',
        alt: '',
      },
    ],
    youtubeUrl: '',
    updatedImagesTitle: '',
    updatedImages: [],
    locationTitle: '',
    locationTitleText: '',
    locationArea: '',
    number1: '',
    number2: '',
    email1: '',
    email2: '',
    mapIframeUrl: '',
    cardImage: '',
    cardLocation: '',
    cardAreaFt: '',
    cardProjectType: 'residential',
    cardHouse: 'Ready to Move',
    reraNumber: '',
  });
  
  // Validation errors state - stores backend validation errors for each field
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Removed verbose console logging for form data

  // Utility functions
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  };

  const formatMobileNumber = (value: string): string => {
    // Remove all non-numeric characters
    const numeric = value.replace(/\D/g, '');
    
    // If it starts with 91, keep only the last 10 digits
    if (numeric.startsWith('91') && numeric.length > 10) {
      return numeric.slice(-10);
    }
    
    // Otherwise, keep only the last 10 digits
    return numeric.slice(-10);
  };

  const validateMobileNumber = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateRequired = (value: string | number): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    let processedValue = value;
    
    // Auto-generate slug when project title changes
    if (name === 'projectTitle') {
      const newSlug = generateSlug(value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        slug: newSlug 
      }));
      return;
    }
    
    // Format mobile numbers
    if (name === 'number1' || name === 'number2') {
      processedValue = formatMobileNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleFileUpload = (file: File, field: string) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      [`${field}File`]: file,
      [`${field}Preview`]: preview,
    }));
  };

  const removeUploadedFile = (field: string) => {
    setFormData(prev => {
      const newData = { ...prev } as Record<string, unknown>;
      delete newData[`${field}File`];
      delete newData[`${field}Preview`];
      return newData as FormData;
    });
  };

  // About Us Image handlers
  const handleAboutUsImageUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      aboutUsDetail: {
        ...prev.aboutUsDetail,
        image: {
          ...prev.aboutUsDetail.image,
          file,
          preview,
        },
      },
    }));
  };

  const removeAboutUsImage = () => {
    setFormData(prev => ({
      ...prev,
      aboutUsDetail: {
        ...prev.aboutUsDetail,
        image: {
          alt: prev.aboutUsDetail.image.alt,
        },
      },
    }));
  };

  const updateAboutUsImageAlt = (alt: string) => {
    setFormData(prev => ({
      ...prev,
      aboutUsDetail: {
        ...prev.aboutUsDetail,
        image: {
          ...prev.aboutUsDetail.image,
          alt,
        },
      },
    }));
  };

  // Floor Plans
  const addFloorPlan = () => {
    setFormData(prev => ({
      ...prev,
      floorPlans: [...prev.floorPlans, { id: Date.now().toString(), title: '', image: '', alt: '' }],
    }));
  };

  const removeFloorPlan = (id: string) => {
    setFormData(prev => ({
      ...prev,
      floorPlans: prev.floorPlans.filter(fp => fp.id !== id),
    }));
  };

  const updateFloorPlan = (id: string, field: keyof FloorPlan, value: string) => {
    setFormData(prev => ({
      ...prev,
      floorPlans: prev.floorPlans.map(fp => (fp.id === id ? { ...fp, [field]: value } : fp)),
    }));
  };

  const handleFloorPlanFileUpload = (id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      floorPlans: prev.floorPlans.map(fp => fp.id === id ? { ...fp, file, preview } : fp),
    }));
  };

  const removeFloorPlanFile = (id: string) => {
    setFormData(prev => ({
      ...prev,
      floorPlans: prev.floorPlans.map(fp => fp.id === id ? { ...fp, file: undefined, preview: undefined } : fp),
    }));
  };

  // Project Images (Max 5)
  const addProjectImage = () => {
    if (formData.projectImages.length >= 5) {
      alert('Maximum 5 images allowed!');
      return;
    }
    setFormData(prev => ({
      ...prev,
      projectImages: [...prev.projectImages, { id: Date.now().toString(), image: '', alt: '' }],
    }));
  };

  const removeProjectImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projectImages: prev.projectImages.filter(img => img.id !== id),
    }));
  };

  const updateProjectImage = (id: string, field: keyof ImageItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      projectImages: prev.projectImages.map(img => (img.id === id ? { ...img, [field]: value } : img)),
    }));
  };

  const handleProjectImageFileUpload = (id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      projectImages: prev.projectImages.map(img => img.id === id ? { ...img, file, preview } : img),
    }));
  };

  const removeProjectImageFile = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projectImages: prev.projectImages.map(img => img.id === id ? { ...img, file: undefined, preview: undefined } : img),
    }));
  };

  // Amenities
  const addAmenity = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, { id: Date.now().toString(), title: '', svgOrImage: '', alt: '' }],
    }));
  };

  const removeAmenity = (id: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(am => am.id !== id),
    }));
  };

  const updateAmenity = (id: string, field: keyof Amenity, value: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map(am => (am.id === id ? { ...am, [field]: value } : am)),
    }));
  };

  const handleAmenityFileUpload = (id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map(am => am.id === id ? { ...am, file, preview } : am),
    }));
  };

  const removeAmenityFile = (id: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.map(am => am.id === id ? { ...am, file: undefined, preview: undefined } : am),
    }));
  };

  // Updated Images (Max 3)
  const addUpdatedImage = () => {
    if (formData.updatedImages.length >= 3) {
      alert('Maximum 3 images allowed!');
      return;
    }
    setFormData(prev => ({
      ...prev,
      updatedImages: [...prev.updatedImages, { id: Date.now().toString(), image: '', alt: '' }],
    }));
  };

  const removeUpdatedImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      updatedImages: prev.updatedImages.filter(img => img.id !== id),
    }));
  };

  const updateUpdatedImage = (id: string, field: keyof ImageItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      updatedImages: prev.updatedImages.map(img => (img.id === id ? { ...img, [field]: value } : img)),
    }));
  };

  const handleUpdatedImageFileUpload = (id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      updatedImages: prev.updatedImages.map(img => img.id === id ? { ...img, file, preview } : img),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation
    const errors: string[] = [];
    
    // Required field validation
    if (!validateRequired(formData.projectTitle)) errors.push('Project Title is required');
    if (!validateRequired(formData.slug)) errors.push('Slug is required');
    if (!validateRequired(formData.shortAddress)) errors.push('Short Address is required');
    if (!validateRequired(formData.locationTitle)) errors.push('Location Title is required');
    if (!validateRequired(formData.locationTitleText)) errors.push('Location Description is required');
    if (!validateRequired(formData.locationArea)) errors.push('Location Area is required');
    if (!validateRequired(formData.cardLocation)) errors.push('Card Location is required');
    if (!validateRequired(formData.cardAreaFt)) errors.push('Card Area (sq ft) is required');
    if (!validateRequired(formData.reraNumber)) errors.push('RERA Number is required');
    
    // Mobile number validation
    if (!validateRequired(formData.number1)) {
      errors.push('Primary mobile number is required');
    } else if (!validateMobileNumber(formData.number1)) {
      errors.push('Primary mobile number must be a valid 10-digit Indian number');
    }
    
    if (!validateRequired(formData.number2)) {
      errors.push('Secondary mobile number is required');  
    } else if (!validateMobileNumber(formData.number2)) {
      errors.push('Secondary mobile number must be a valid 10-digit Indian number');
    }
    
    // Email validation
    if (!validateRequired(formData.email1)) {
      errors.push('Primary email is required');
    } else if (!validateEmail(formData.email1)) {
      errors.push('Primary email must be valid');
    }
    
    if (!validateRequired(formData.email2)) {
      errors.push('Secondary email is required');
    } else if (!validateEmail(formData.email2)) {
      errors.push('Secondary email must be valid');
    }
    
    // Array field validation
    if (formData.floorPlans.length === 0) {
      errors.push('At least one floor plan is required');
    }
    
    if (formData.projectImages.length === 0) {
      errors.push('At least one project image is required');
    }
    
    if (formData.amenities.length === 0) {
      errors.push('At least one amenity is required');
    }
    
    // File validation
    if (!formData.brochureFile) errors.push('Brochure PDF is required');
    if (!formData.aboutUsDetail.image.file) errors.push('About Us image is required');
    if (!formData.cardImageFile) errors.push('Card image is required');
    
    // Show validation errors
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }
    
    const formDataToSend = new FormData();
    
    formDataToSend.append('projectTitle', formData.projectTitle);
    formDataToSend.append('slug', formData.slug);
    formDataToSend.append('projectState', formData.projectState);
    formDataToSend.append('projectType', formData.projectType);
    formDataToSend.append('shortAddress', formData.shortAddress);
    formDataToSend.append('projectStatusPercentage', formData.projectStatusPercentage.toString());
    
    if (formData.brochureFile) {
      formDataToSend.append('brochure', formData.brochureFile);
    }
    
    // About Us Detail - Descriptions (4 individual fields)
    formDataToSend.append('description1', formData.aboutUsDetail.description1 || '');
    formDataToSend.append('description2', formData.aboutUsDetail.description2 || '');
    formDataToSend.append('description3', formData.aboutUsDetail.description3 || '');
    formDataToSend.append('description4', formData.aboutUsDetail.description4 || '');
    
    // About Us Detail - Image
    formDataToSend.append('aboutUsAlt', formData.aboutUsDetail.image.alt || '');
    if (formData.aboutUsDetail.image.file) {
      formDataToSend.append('aboutUsImage', formData.aboutUsDetail.image.file);
    }
    
    formData.floorPlans.forEach((fp, index) => {
      formDataToSend.append(`floorPlans[${index}][title]`, fp.title);
      formDataToSend.append(`floorPlans[${index}][alt]`, fp.alt);
      if (fp.file) {
        formDataToSend.append(`floorPlanImages`, fp.file);
      }
    });
    
    formData.projectImages.forEach((img, index) => {
      formDataToSend.append(`projectImages[${index}][alt]`, img.alt);
      if (img.file) {
        formDataToSend.append(`projectImageFiles`, img.file);
      }
    });
    
    formData.amenities.forEach((am, index) => {
      formDataToSend.append(`amenities[${index}][title]`, am.title);
      formDataToSend.append(`amenities[${index}][alt]`, am.alt);
      if (am.file) {
        formDataToSend.append(`amenityFiles`, am.file);
      }
    });
    
    formDataToSend.append('youtubeUrl', formData.youtubeUrl);
    formDataToSend.append('updatedImagesTitle', formData.updatedImagesTitle);
    
    formData.updatedImages.forEach((img, index) => {
      formDataToSend.append(`updatedImages[${index}][alt]`, img.alt);
      if (img.file) {
        formDataToSend.append(`updatedImageFiles`, img.file);
      }
    });
    
    formDataToSend.append('locationTitle', formData.locationTitle);
    formDataToSend.append('locationTitleText', formData.locationTitleText);
    formDataToSend.append('locationArea', formData.locationArea);
    // Add +91 prefix if not already present
    const formatNumber = (number: string) => number.startsWith('+91') ? number : `+91${number}`;
    formDataToSend.append('number1', formatNumber(formData.number1));
    formDataToSend.append('number2', formatNumber(formData.number2));
    formDataToSend.append('email1', formData.email1);
    formDataToSend.append('email2', formData.email2);
    formDataToSend.append('mapIframeUrl', formData.mapIframeUrl);
    formDataToSend.append('cardLocation', formData.cardLocation);
    formDataToSend.append('cardAreaFt', formData.cardAreaFt);
    formDataToSend.append('cardProjectType', formData.cardProjectType);
    formDataToSend.append('cardHouse', formData.cardHouse);
    formDataToSend.append('reraNumber', formData.reraNumber);
    
    if (formData.cardImageFile) {
      formDataToSend.append('cardImage', formData.cardImageFile);
    }
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formDataToSend,
      });
      
  if (response.ok) {
  await response.json();
  
  // Clear any previous validation errors
  setValidationErrors({});
  
  // Show success modal
  setSuccessMessage(`Project "${formData.projectTitle}" created successfully!`);
  setShowSuccessModal(true);
        
        // Reset form after successful submission
        setFormData({
          projectTitle: '',
          slug: '',
          projectState: 'on-going',
          projectType: 'residential',
          shortAddress: '',
          projectStatusPercentage: 0,
          aboutUsDetail: {
            description1: '',
            description2: '',
            description3: '',
            description4: '',
            image: {
              alt: '',
            },
          },
          floorPlans: [
            {
              id: Date.now().toString(),
              title: '',
              image: '',
              alt: '',
            },
          ],
          projectImages: [
            {
              id: Date.now().toString() + '_1',
              image: '',
              alt: '',
            },
          ],
          amenities: [
            {
              id: Date.now().toString() + '_2',
              title: '',
              svgOrImage: '',
              alt: '',
            },
          ],
          youtubeUrl: '',
          updatedImagesTitle: '',
          updatedImages: [],
          locationTitle: '',
          locationTitleText: '',
          locationArea: '',
          number1: '',
          number2: '',
          email1: '',
          email2: '',
          mapIframeUrl: '',
          cardImage: '',
          cardLocation: '',
          cardAreaFt: '',
          cardProjectType: 'residential',
          cardHouse: 'Ready to Move',
          reraNumber: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Error creating project:', errorData);
        
        // Parse validation errors from backend
        if (errorData.errors && Array.isArray(errorData.errors)) {
          // Backend returns array of errors: [{ path: 'fieldName', msg: 'Error message' }]
          const errorsMap: Record<string, string> = {};
          errorData.errors.forEach((err: { path?: string; msg: string; param?: string }) => {
            const fieldName = err.path || err.param;
            if (fieldName) {
              errorsMap[fieldName] = err.msg;
            }
          });
          setValidationErrors(errorsMap);
          
          // Show error alert with field-specific errors
          const errorMessages = errorData.errors.map((err: { path?: string; msg: string; param?: string }) => 
            `${err.path || err.param}: ${err.msg}`
          ).join('\n');
          alert(`Validation Errors:\n\n${errorMessages}`);
        } else {
          // Generic error
          alert(`Error creating project: ${errorData.message || 'Unknown error'} ❌`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to server! ❌');
      setValidationErrors({});
    }
  };

  // Helper component to display field errors
  const FieldError: React.FC<{ fieldName: string }> = ({ fieldName }) => {
    if (!validationErrors[fieldName]) return null;
    return (
      <p className="text-red-600 text-sm mt-1 font-medium">
        ⚠️ {validationErrors[fieldName]}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Create New Project</h1>
            <p className="text-blue-100 mt-2">Upload images and fill in all details</p>
          </div>

          <form className="p-8" onSubmit={handleSubmit}>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.projectTitle ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  <FieldError fieldName="projectTitle" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(Auto-generated from title)</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="Auto-generated or enter custom slug"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 ${
                      validationErrors.slug ? 'border-red-500 bg-red-100' : 'border-gray-300'
                    }`}
                    required
                  />
                  <FieldError fieldName="slug" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project State *</label>
                  <select
                    name="projectState"
                    value={formData.projectState}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="on-going">On-going</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Type *</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Percentage *</label>
                  <input
                    type="number"
                    name="projectStatusPercentage"
                    value={formData.projectStatusPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Address *</label>
                  <input
                    type="text"
                    name="shortAddress"
                    value={formData.shortAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Brochure (PDF) *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      id="brochure-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFormData(prev => ({ ...prev, brochureFile: file }));
                      }}
                      className="hidden"
                    />
                    <label htmlFor="brochure-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload PDF brochure</span>
                      </div>
                    </label>
                    {formData.brochureFile && (
                      <div className="mt-3 text-sm text-green-600 font-medium">
                        ✓ {formData.brochureFile.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
                About Us Section
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    About Us Descriptions
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Description 1 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder="Enter first description (required)"
                        value={formData.aboutUsDetail.description1}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          aboutUsDetail: { ...prev.aboutUsDetail, description1: e.target.value }
                        }))}
                        rows={3}
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          validationErrors.description1 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <FieldError fieldName="description1" />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Description 2 <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        placeholder="Enter second description (optional)"
                        value={formData.aboutUsDetail.description2}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          aboutUsDetail: { ...prev.aboutUsDetail, description2: e.target.value }
                        }))}
                        rows={3}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          validationErrors.description2 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <FieldError fieldName="description2" />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Description 3 <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        placeholder="Enter third description (optional)"
                        value={formData.aboutUsDetail.description3}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          aboutUsDetail: { ...prev.aboutUsDetail, description3: e.target.value }
                        }))}
                        rows={3}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          validationErrors.description3 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <FieldError fieldName="description3" />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Description 4 <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        placeholder="Enter fourth description (optional)"
                        value={formData.aboutUsDetail.description4}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          aboutUsDetail: { ...prev.aboutUsDetail, description4: e.target.value }
                        }))}
                        rows={3}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          validationErrors.description4 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <FieldError fieldName="description4" />
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-blue-50 to-white p-6 rounded-xl border-2 border-blue-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Upload About Us Image *</label>
                  <div className="flex items-center gap-6">
                    <div className="shrink-0">
                      {formData.aboutUsDetail.image.preview ? (
                        <div className="relative">
                          <img
                            src={formData.aboutUsDetail.image.preview}
                            alt="Preview"
                            className="w-60 h-60 object-cover rounded-xl border-4 border-white shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={removeAboutUsImage}
                            className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-60 h-60 border-2 border-dashed border-green-300 rounded-xl flex items-center justify-center bg-white">
                          <ImageIcon className="w-20 h-20 text-green-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors shadow-md">
                        <Upload size={16} />
                        {formData.aboutUsDetail.image.preview ? 'Change Image' : 'Choose Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAboutUsImageUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Image Alt Text"
                        value={formData.aboutUsDetail.image.alt}
                        onChange={(e) => updateAboutUsImageAlt(e.target.value)}
                        className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 pb-2 border-b-2 border-blue-500">Floor Plans</h2>
                <button
                  type="button"
                  onClick={addFloorPlan}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                >
                  <Plus size={20} /> Add Floor Plan
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.floorPlans.map((fp, idx) => (
                  <div key={fp.id} className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border-2 border-blue-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-blue-700 text-lg">Floor Plan {idx + 1}</h3>
                      {formData.floorPlans.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFloorPlan(fp.id)}
                          className="text-red-600 hover:bg-red-100 p-1.5 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {/* Image Preview Section */}
                      <div className="flex justify-center">
                        {fp.preview ? (
                          <div className="relative">
                            <img
                              src={fp.preview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-xl border-2 border-blue-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeFloorPlanFile(fp.id)}
                              className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-48 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center bg-white">
                            <div className="text-center">
                              <ImageIcon className="w-16 h-16 text-blue-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Floor Plan Image</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Upload Button */}
                      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors shadow-md w-full">
                        <Upload size={16} />
                        {fp.preview ? 'Change Image' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFloorPlanFileUpload(fp.id, file);
                          }}
                          className="hidden"
                        />
                      </label>
                      
                      {/* Title Input */}
                      <input
                        type="text"
                        placeholder="Floor Plan Title"
                        value={fp.title}
                        onChange={e => updateFloorPlan(fp.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      
                      {/* Alt Text Input */}
                      <input
                        type="text"
                        placeholder="Alt Text for Accessibility"
                        value={fp.alt}
                        onChange={e => updateFloorPlan(fp.id, 'alt', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 pb-2 border-b-2 border-blue-500">
                  Project Images <span className="text-sm font-normal text-gray-500">(Max 5)</span>
                </h2>
                <button
                  type="button"
                  onClick={addProjectImage}
                  disabled={formData.projectImages.length >= 5}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md ${
                    formData.projectImages.length >= 5
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Plus size={20} /> Add Image ({formData.projectImages.length}/5)
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.projectImages.map((img) => (
                  <div key={img.id} className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border-2 border-blue-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-blue-700 text-lg">Project Image</h3>
                      {formData.projectImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProjectImage(img.id)}
                          className="text-red-600 hover:bg-red-100 p-1.5 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {/* Image Preview Section */}
                      <div className="flex justify-center">
                        {img.preview ? (
                          <div className="relative">
                            <img
                              src={img.preview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-xl border-2 border-blue-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeProjectImageFile(img.id)}
                              className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-48 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center bg-white">
                            <div className="text-center">
                              <ImageIcon className="w-16 h-16 text-blue-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Project Image</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Upload Button */}
                      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors shadow-md w-full">
                        <Upload size={16} />
                        {img.preview ? 'Change Image' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleProjectImageFileUpload(img.id, file);
                          }}
                          className="hidden"
                        />
                      </label>
                      
                      {/* Alt Text Input */}
                      <input
                        type="text"
                        placeholder="Alt Text for Accessibility"
                        value={img.alt}
                        onChange={e => updateProjectImage(img.id, 'alt', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 pb-2 border-b-2 border-blue-500">Amenities</h2>
                <button
                  type="button"
                  onClick={addAmenity}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
                >
                  <Plus size={20} /> Add Amenity
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.amenities.map((am, idx) => (
                  <div key={am.id} className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border-2 border-blue-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-blue-700 text-lg">Amenity {idx + 1}</h3>
                      {formData.amenities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAmenity(am.id)}
                          className="text-red-600 hover:bg-red-100 p-1.5 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      {/* Image Preview Section */}
                      <div className="flex justify-center">
                        {am.preview ? (
                          <div className="relative">
                            <img
                              src={am.preview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-xl border-2 border-blue-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeAmenityFile(am.id)}
                              className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-48 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center bg-white">
                            <div className="text-center">
                              <ImageIcon className="w-16 h-16 text-blue-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Amenity Icon/Image</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Upload Button */}
                      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors shadow-md w-full">
                        <Upload size={16} />
                        {am.preview ? 'Change Icon' : 'Upload Icon'}
                        <input
                          type="file"
                          accept="image/*,.svg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAmenityFileUpload(am.id, file);
                          }}
                          className="hidden"
                        />
                      </label>
                      
                      {/* Title Input */}
                      <input
                        type="text"
                        placeholder="Amenity Title"
                        value={am.title}
                        onChange={e => updateAmenity(am.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      
                      {/* Alt Text Input */}
                      <input
                        type="text"
                        placeholder="Alt Text for Accessibility"
                        value={am.alt}
                        onChange={e => updateAmenity(am.id, 'alt', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-red-500">Media</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                <input
                  type="text"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-teal-500">
                Project Updated Images <span className="text-sm font-normal text-gray-500">(Max 3)</span>
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  name="updatedImagesTitle"
                  value={formData.updatedImagesTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Latest Progress"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Images</h3>
                <button
                  type="button"
                  onClick={addUpdatedImage}
                  disabled={formData.updatedImages.length >= 3}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg shadow-md ${
                    formData.updatedImages.length >= 3
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  <Plus size={16} /> Add Image ({formData.updatedImages.length}/3)
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.updatedImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <div className="aspect-video bg-linear-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200 overflow-hidden">
                      {img.preview ? (
                        <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-16 h-16 text-teal-300" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUpdatedImage(img.id)}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                    >
                      <X size={14} />
                    </button>
                    <input
                      type="text"
                      placeholder="Alt text"
                      value={img.alt}
                      onChange={e => updateUpdatedImage(img.id, 'alt', e.target.value)}
                      className="w-full mt-2 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    {!img.preview && (
                      <label className="block mt-2">
                        <div className="flex items-center justify-center gap-1 px-3 py-2 bg-teal-600 text-white text-sm rounded cursor-pointer hover:bg-teal-700">
                          <Upload size={14} />
                          Upload Image
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpdatedImageFileUpload(img.id, file);
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-500">Location Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="locationTitle"
                    value={formData.locationTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Title</label>
                  <input
                    type="text"
                    name="locationTitleText"
                    value={formData.locationTitleText}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Area</label>
                  <input
                    type="text"
                    name="locationArea"
                    value={formData.locationArea}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number 1 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="number1"
                      value={formData.number1}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.number1 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {formData.number1 && !validateMobileNumber(formData.number1) && (
                    <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit mobile number</p>
                  )}
                  <FieldError fieldName="number1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number 2 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="number2"
                      value={formData.number2}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.number2 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {formData.number2 && !validateMobileNumber(formData.number2) && (
                    <p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit mobile number</p>
                  )}
                  <FieldError fieldName="number2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email1"
                    value={formData.email1}
                    onChange={handleInputChange}
                    placeholder="Enter primary email"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.email1 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {formData.email1 && !validateEmail(formData.email1) && (
                    <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                  )}
                  <FieldError fieldName="email1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email 2 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email2"
                    value={formData.email2}
                    onChange={handleInputChange}
                    placeholder="Enter secondary email"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.email2 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {formData.email2 && !validateEmail(formData.email2) && (
                    <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                  )}
                  <FieldError fieldName="email2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Map Iframe URL</label>
                  <input
                    type="text"
                    name="mapIframeUrl"
                    value={formData.mapIframeUrl}
                    onChange={handleInputChange}
                    placeholder="Google Maps embed URL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-cyan-500">Card Detail</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="cardLocation"
                    value={formData.cardLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
                  <input
                    type="text"
                    name="cardAreaFt"
                    value={formData.cardAreaFt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                  <select
                    name="cardProjectType"
                    value={formData.cardProjectType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">House Status</label>
                  <select
                    name="cardHouse"
                    value={formData.cardHouse}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Sample House Ready">Sample House Ready</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Card Image</label>
                  <div className="bg-linear-to-r from-blue-50 to-white p-6 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-6">
                      <div className="shrink-0">
                        {formData.cardImagePreview ? (
                          <div className="relative">
                            <img
                              src={formData.cardImagePreview}
                              alt="Card Preview"
                              className="w-60 h-60 object-cover rounded-xl border-4 border-white shadow-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeUploadedFile('cardImage')}
                              className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-60 h-60 border-2 border-dashed border-cyan-300 rounded-xl flex items-center justify-center bg-white">
                            <ImageIcon className="w-20 h-20 text-cyan-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 cursor-pointer transition-colors shadow-md">
                          <Upload size={16} />
                          {formData.cardImagePreview ? 'Change Image' : 'Choose Image'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, 'cardImage');
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-yellow-500">RERA Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RERA Detail</label>
                  <input
                    type="text"
                    name="reraNumber"
                    value={formData.reraNumber}
                    onChange={handleInputChange}
                    placeholder="Enter RERA registration details"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-6 border-t-2 border-blue-200">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-blue-800 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Save size={24} /> Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Project Created Successfully! 🎉"
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default ProjectAdminForm;