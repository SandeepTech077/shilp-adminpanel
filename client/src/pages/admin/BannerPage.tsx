import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Loader2, Plus, Save, Eye, X } from 'lucide-react';

type BannerSectionType = {
  banner: string;
  mobilebanner: string;
  alt: string;
};
type SidebarItem = { image: string; alt: string };
type BannersType = {
  homepageBanner: BannerSectionType;
  aboutUs: BannerSectionType;
  commercialBanner: BannerSectionType;
  plotBanner: BannerSectionType;
  residentialBanner: BannerSectionType;
  contactBanners: BannerSectionType;
  careerBanner: BannerSectionType;
  ourTeamBanner: BannerSectionType;
  termsConditionsBanner: BannerSectionType;
  privacyPolicyBanner: BannerSectionType;
  sidebar: {
    commercial: SidebarItem[];
    residential: SidebarItem[];
    plots: SidebarItem[];
  };
};

const BannerManagement = () => {
  const [banners, setBanners] = useState<BannersType>({
    homepageBanner: { banner: '', mobilebanner: '', alt: '' },
    aboutUs: { banner: '', mobilebanner: '', alt: '' },
    commercialBanner: { banner: '', mobilebanner: '', alt: '' },
    plotBanner: { banner: '', mobilebanner: '', alt: '' },
    residentialBanner: { banner: '', mobilebanner: '', alt: '' },
    contactBanners: { banner: '', mobilebanner: '', alt: '' },
    careerBanner: { banner: '', mobilebanner: '', alt: '' },
    ourTeamBanner: { banner: '', mobilebanner: '', alt: '' },
    termsConditionsBanner: { banner: '', mobilebanner: '', alt: '' },
    privacyPolicyBanner: { banner: '', mobilebanner: '', alt: '' },
    sidebar: {
      commercial: [],
      residential: [],
      plots: []
    }
  });

  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>('page-banners');
  const [previewModal, setPreviewModal] = useState<{ show: boolean; image: string; alt: string }>({ show: false, image: '', alt: '' });

  // Load existing banners from API
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  // Preview Modal
  const showPreview = (image: string, alt: string) => {
    setPreviewModal({ show: true, image, alt });
  };

  // Handle single image upload
  const handleImageUpload = async (section: keyof BannersType, field: keyof BannerSectionType, file: File) => {
    // Only allow BannerSectionType keys
    if (section === 'sidebar') return;
    if (!file) return;

    const loadingKey = `${section}-${field}`;
  setLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('section', section);
      formData.append('field', field);

      // Get old image URL for deletion
      const oldImageUrl = banners[section][field];
      if (oldImageUrl) {
        formData.append('oldImageUrl', oldImageUrl);
      }

      // Replace with your actual upload API endpoint
      const response = await fetch('/api/banners/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
  setBanners((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: data.imageUrl
          }
        }));

        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
  setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Handle single image delete
  const handleImageDelete = async (section: keyof BannersType, field: keyof BannerSectionType) => {
    if (section === 'sidebar') return;
    if (!confirm('Are you sure you want to delete this image?')) return;

    const imageUrl = banners[section][field];
    const loadingKey = `${section}-${field}-delete`;
  setLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      // Replace with your actual delete API endpoint
      const response = await fetch('/api/banners/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section, 
          field, 
          imageUrl 
        })
      });

      if (response.ok) {
  setBanners((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: ''
          }
        }));

        alert('Image deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
    } finally {
  setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Handle alt text change (local state)
  const handleAltTextChange = (section: keyof BannersType, value: string) => {
    if (section === 'sidebar') return;
  setBanners((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        alt: value
      }
    }));
  };

  // Save alt text to database
  const saveAltText = async (section: keyof BannersType) => {
    if (section === 'sidebar') return;
    const savingKey = `${section}-alt`;
  setSaving((prev) => ({ ...prev, [savingKey]: true }));

    try {
      const response = await fetch('/api/banners/update-alt', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section, 
          alt: banners[section].alt 
        })
      });

      if (response.ok) {
        alert('Alt text saved successfully!');
      }
    } catch (error) {
      console.error('Error saving alt text:', error);
      alert('Error saving alt text.');
    } finally {
  setSaving((prev) => ({ ...prev, [savingKey]: false }));
    }
  };

  // Sidebar functions
  const handleSidebarUpload = async (category: keyof BannersType['sidebar'], file: File) => {
    if (!file) return;

    const loadingKey = `sidebar-${category}`;
  setLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);

      const response = await fetch('/api/banners/sidebar/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
  setBanners((prev) => ({
          ...prev,
          sidebar: {
            ...prev.sidebar,
            [category]: [...prev.sidebar[category], { image: data.imageUrl, alt: '' }]
          }
        }));

        alert('Sidebar image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading sidebar image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
  setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleSidebarDelete = async (category: keyof BannersType['sidebar'], index: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    const imageUrl = banners.sidebar[category][index].image;
    const loadingKey = `sidebar-${category}-${index}-delete`;
  setLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await fetch('/api/banners/sidebar/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category, 
          index,
          imageUrl 
        })
      });

      if (response.ok) {
  setBanners((prev) => ({
          ...prev,
          sidebar: {
            ...prev.sidebar,
            [category]: prev.sidebar[category].filter((_, i) => i !== index)
          }
        }));

        alert('Sidebar image deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting sidebar image:', error);
      alert('Error deleting image. Please try again.');
    } finally {
  setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleSidebarAltChange = (category: keyof BannersType['sidebar'], index: number, value: string) => {
  setBanners((prev) => ({
      ...prev,
      sidebar: {
        ...prev.sidebar,
        [category]: prev.sidebar[category].map((item, i) => 
          i === index ? { ...item, alt: value } : item
        )
      }
    }));
  };

  const saveSidebarAlt = async (category: keyof BannersType['sidebar'], index: number) => {
    const savingKey = `sidebar-${category}-${index}-alt`;
  setSaving((prev) => ({ ...prev, [savingKey]: true }));

    try {
      const response = await fetch('/api/banners/sidebar/update-alt', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          category, 
          index,
          alt: banners.sidebar[category][index].alt 
        })
      });

      if (response.ok) {
        alert('Alt text saved successfully!');
      }
    } catch (error) {
      console.error('Error saving alt text:', error);
      alert('Error saving alt text.');
    } finally {
  setSaving((prev) => ({ ...prev, [savingKey]: false }));
    }
  };

  // Banner Section Component
  const BannerSection = ({ title, section }: { title: string; section: keyof BannersType }) => {
    if (section === 'sidebar') return null;
    const bannerSection = banners[section] as BannerSectionType;
    return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <div className="w-1 h-6 bg-blue-600 rounded"></div>
        {title}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Desktop Banner */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Desktop Banner
          </label>
          
          {bannerSection.banner ? (
            <div className="space-y-2">
              <div className="relative group">
                <img 
                  src={bannerSection.banner}
                  alt={bannerSection.alt || 'Banner'}
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => showPreview(bannerSection.banner, bannerSection.alt)}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleImageDelete(section, 'banner')}
                    disabled={loading[`${section}-banner-delete`]}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {loading[`${section}-banner-delete`] ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpload(section, 'banner', e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Change Image</span>
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(section, 'banner', e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              {loading[`${section}-banner`] ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Upload Desktop Banner</span>
                  <span className="text-xs text-gray-400 mt-1">Click to browse</span>
                </>
              )}
            </label>
          )}
        </div>

        {/* Mobile Banner */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Mobile Banner
          </label>
          
          {bannerSection.mobilebanner ? (
            <div className="space-y-2">
              <div className="relative group">
                <img 
                  src={bannerSection.mobilebanner}
                  alt={bannerSection.alt || 'Mobile Banner'}
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => showPreview(bannerSection.mobilebanner, bannerSection.alt)}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleImageDelete(section, 'mobilebanner')}
                    disabled={loading[`${section}-mobilebanner-delete`]}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {loading[`${section}-mobilebanner-delete`] ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpload(section, 'mobilebanner', e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Change Image</span>
              </label>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(section, 'mobilebanner', e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              {loading[`${section}-mobilebanner`] ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Upload Mobile Banner</span>
                  <span className="text-xs text-gray-400 mt-1">Click to browse</span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      {/* Alt Text with Save Button */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alt Text (for SEO and Accessibility)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={bannerSection.alt}
            onChange={(e) => handleAltTextChange(section, e.target.value)}
            placeholder="Enter descriptive alt text for this banner"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => saveAltText(section)}
            disabled={saving[`${section}-alt`]}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving[`${section}-alt`] ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
    );
  };

  // Sidebar Section Component
  const SidebarSection = ({ category, title }: { category: keyof BannersType['sidebar']; title: string }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <div className="w-1 h-6 bg-green-600 rounded"></div>
        {title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.sidebar[category].map((item, index) => (
          <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <div className="relative group">
              <img 
                src={item.image} 
                alt={item.alt || `Sidebar image ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => showPreview(item.image, item.alt)}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSidebarDelete(category, index)}
                  disabled={loading[`sidebar-${category}-${index}-delete`]}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading[`sidebar-${category}-${index}-delete`] ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={item.alt}
                onChange={(e) => handleSidebarAltChange(category, index, e.target.value)}
                placeholder="Alt text"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => saveSidebarAlt(category, index)}
                disabled={saving[`sidebar-${category}-${index}-alt`]}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving[`sidebar-${category}-${index}-alt`] ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
        
        {/* Add New Button */}
        <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleSidebarUpload(category, e.target.files[0]);
              }
            }}
            className="hidden"
          />
          {loading[`sidebar-${category}`] ? (
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          ) : (
            <>
              <Plus className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 font-medium">Add New Image</span>
              <span className="text-xs text-gray-400 mt-1">Click to upload</span>
            </>
          )}
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 mb-6 text-white">
          <h1 className="text-4xl font-bold mb-2">Banner Management System</h1>
          <p className="text-blue-100">Upload, manage, and organize all website banners with ease</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('page-banners')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'page-banners'
                  ? 'text-blue-600 bg-blue-50 border-b-4 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📄 Page Banners
            </button>
            <button
              onClick={() => setActiveTab('sidebar-banners')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'sidebar-banners'
                  ? 'text-green-600 bg-green-50 border-b-4 border-green-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📌 Sidebar Banners
            </button>
          </div>
        </div>

        {/* Page Banners Tab */}
        {activeTab === 'page-banners' && (
          <div>
            <BannerSection title="Homepage Banner" section="homepageBanner" />
            <BannerSection title="About Us Banner" section="aboutUs" />
            <BannerSection title="Commercial Banner" section="commercialBanner" />
            <BannerSection title="Plot Banner" section="plotBanner" />
            <BannerSection title="Residential Banner" section="residentialBanner" />
            <BannerSection title="Contact Banner" section="contactBanners" />
            <BannerSection title="Career Banner" section="careerBanner" />
            <BannerSection title="Our Team Banner" section="ourTeamBanner" />
            <BannerSection title="Terms & Conditions Banner" section="termsConditionsBanner" />
            <BannerSection title="Privacy Policy Banner" section="privacyPolicyBanner" />
          </div>
        )}

        {/* Sidebar Banners Tab */}
        {activeTab === 'sidebar-banners' && (
          <div>
            <SidebarSection category="commercial" title="Commercial Sidebar Banners" />
            <SidebarSection category="residential" title="Residential Sidebar Banners" />
            <SidebarSection category="plots" title="Plots Sidebar Banners" />
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewModal.show && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewModal({ show: false, image: '', alt: '' })}
        >
          <div className="relative max-w-5xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewModal({ show: false, image: '', alt: '' })}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={previewModal.image} 
              alt={previewModal.alt || 'Preview'}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            {previewModal.alt && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600"><strong>Alt Text:</strong> {previewModal.alt}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;