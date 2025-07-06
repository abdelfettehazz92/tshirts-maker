import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, Share2, Download, Eye } from 'lucide-react';
import { Design } from '../types';
import apiService from '../services/api';

const Gallery: React.FC = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'oldest'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  const categories = ['All', 'Business', 'Casual', 'Sports', 'Artistic', 'Vintage'];

  // Sample designs data (in real app, this would come from API)
  const sampleDesigns: Design[] = [
    {
      id: 1,
      image_path: '/images/design1.jpg',
      product_type: 'T-Shirt',
      color: 'White',
      view_angle: 'Front',
      created_at: '2024-01-15T10:30:00Z',
      user_id: 1
    },
    {
      id: 2,
      image_path: '/images/design2.jpg',
      product_type: 'Hoodie',
      color: 'Black',
      view_angle: 'Front',
      created_at: '2024-01-14T15:45:00Z',
      user_id: 2
    },
    {
      id: 3,
      image_path: '/images/design3.jpg',
      product_type: 'T-Shirt',
      color: 'Navy',
      view_angle: 'Back',
      created_at: '2024-01-13T09:20:00Z',
      user_id: 3
    },
    {
      id: 4,
      image_path: '/images/design4.jpg',
      product_type: 'Tank Top',
      color: 'Gray',
      view_angle: 'Front',
      created_at: '2024-01-12T14:15:00Z',
      user_id: 1
    },
    {
      id: 5,
      image_path: '/images/design5.jpg',
      product_type: 'T-Shirt',
      color: 'Red',
      view_angle: 'Front',
      created_at: '2024-01-11T11:30:00Z',
      user_id: 4
    },
    {
      id: 6,
      image_path: '/images/design6.jpg',
      product_type: 'Hoodie',
      color: 'Green',
      view_angle: 'Back',
      created_at: '2024-01-10T16:45:00Z',
      user_id: 2
    }
  ];

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        setIsLoading(true);
        // In real app, fetch from API
        // const response = await apiService.getGalleryDesigns();
        // setDesigns(response.data || []);
        
        // For now, use sample data
        setDesigns(sampleDesigns);
      } catch (error) {
        console.error('Error loading designs:', error);
        setDesigns(sampleDesigns); // Fallback to sample data
      } finally {
        setIsLoading(false);
      }
    };

    loadDesigns();
  }, []);

  useEffect(() => {
    let filtered = designs;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(design => design.product_type === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(design =>
        design.product_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        design.color.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort designs
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      
      switch (sortBy) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'popular':
          // In real app, you'd sort by likes/views
          return Math.random() - 0.5;
        default:
          return dateB - dateA;
      }
    });

    setFilteredDesigns(filtered);
  }, [designs, selectedCategory, searchTerm, sortBy]);

  const handleDesignClick = (design: Design) => {
    setSelectedDesign(design);
  };

  const handleLike = (designId: number) => {
    // In real app, this would call an API to like/unlike
    console.log('Liked design:', designId);
  };

  const handleShare = (design: Design) => {
    // In real app, this would open share dialog
    const shareUrl = `${window.location.origin}/gallery/design/${design.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const handleDownload = (design: Design) => {
    // In real app, this would trigger download
    console.log('Downloading design:', design.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Design Gallery
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Explore amazing t-shirt designs created by our community. Get inspired and create your own!
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'oldest')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDesigns.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDesigns.map((design) => (
                <div
                  key={design.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
                >
                  {/* Design Image */}
                  <div className="relative aspect-square bg-gray-200">
                    <img
                      src={design.image_path}
                      alt={`${design.product_type} design`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Design+Image';
                      }}
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <button
                          onClick={() => handleDesignClick(design)}
                          className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleLike(design.id)}
                          className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Like"
                        >
                          <Heart size={16} />
                        </button>
                        <button
                          onClick={() => handleShare(design)}
                          className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Share"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(design)}
                          className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Design Info Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-sm font-medium text-gray-900">{design.product_type}</span>
                      </div>
                    </div>

                    {/* Color Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-sm font-medium text-gray-900">{design.color}</span>
                      </div>
                    </div>
                  </div>

                  {/* Design Details */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{design.product_type}</h3>
                      <span className="text-sm text-gray-500">{design.view_angle}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{design.color}</span>
                      <span>{new Date(design.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleDesignClick(design)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleLike(design.id)}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Create Your Own Design?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community and start creating amazing t-shirt designs today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/design-studio"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Start Designing
            </Link>
            <Link
              to="/signup"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Design Modal */}
      {selectedDesign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Design Details</h3>
                <button
                  onClick={() => setSelectedDesign(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="aspect-square bg-gray-200 rounded-lg mb-4">
                <img
                  src={selectedDesign.image_path}
                  alt={`${selectedDesign.product_type} design`}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Design+Image';
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">Product Type</span>
                  <p className="text-gray-900">{selectedDesign.product_type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Color</span>
                  <p className="text-gray-900">{selectedDesign.color}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">View Angle</span>
                  <p className="text-gray-900">{selectedDesign.view_angle}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Created</span>
                  <p className="text-gray-900">{new Date(selectedDesign.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Navigate to design studio with this design
                    const params = new URLSearchParams({
                      design: selectedDesign.id.toString()
                    });
                    window.location.href = `/design-studio?${params.toString()}`;
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Use This Design
                </button>
                <button
                  onClick={() => handleDownload(selectedDesign)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 