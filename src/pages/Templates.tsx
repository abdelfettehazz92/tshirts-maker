import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Eye, Download } from 'lucide-react';
import { Template } from '../types';
import apiService from '../services/api';

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['All', 'Business', 'Casual', 'Sports', 'Artistic'];

  // Sample templates data (in real app, this would come from API)
  const sampleTemplates: Template[] = [
    {
      id: 1,
      name: 'Business Professional',
      description: 'Clean and professional design perfect for corporate events',
      image_url: '/images/template1.jpg',
      category: 'Business',
      tags: ['corporate', 'professional', 'business']
    },
    {
      id: 2,
      name: 'Casual Cool',
      description: 'Relaxed and trendy design for everyday wear',
      image_url: '/images/template2.jpg',
      category: 'Casual',
      tags: ['casual', 'trendy', 'everyday']
    },
    {
      id: 3,
      name: 'Sports Team',
      description: 'Dynamic design perfect for team uniforms',
      image_url: '/images/template3.jpg',
      category: 'Sports',
      tags: ['sports', 'team', 'uniform']
    },
    {
      id: 4,
      name: 'Artistic Expression',
      description: 'Creative and artistic designs for unique expression',
      image_url: '/images/template4.jpg',
      category: 'Artistic',
      tags: ['artistic', 'creative', 'unique']
    },
    {
      id: 5,
      name: 'Minimalist Elegance',
      description: 'Simple yet elegant designs for sophisticated looks',
      image_url: '/images/template5.jpg',
      category: 'Business',
      tags: ['minimalist', 'elegant', 'sophisticated']
    },
    {
      id: 6,
      name: 'Street Style',
      description: 'Urban and street-inspired designs',
      image_url: '/images/template6.jpg',
      category: 'Casual',
      tags: ['urban', 'street', 'fashion']
    }
  ];

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setIsLoading(true);
        // In real app, fetch from API
        // const response = await apiService.getTemplates();
        // setTemplates(response.data || []);
        
        // For now, use sample data
        setTemplates(sampleTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
        setTemplates(sampleTemplates); // Fallback to sample data
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  useEffect(() => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, searchTerm]);

  const handleTemplateSelect = (template: Template) => {
    // Navigate to design studio with template
    const params = new URLSearchParams({
      template: template.id.toString(),
      name: template.name
    });
    window.location.href = `/design-studio?${params.toString()}`;
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
            T-Shirt Templates
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose from our collection of professionally designed templates or create your own custom design
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
                placeholder="Search templates..."
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

            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Template Image */}
                  <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                    <div className="relative aspect-square bg-gray-200">
                      <img
                        src={template.image_url}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Template+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 transition-opacity flex space-x-2">
                          <button
                            onClick={() => handleTemplateSelect(template)}
                            className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Use Template"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Download Template"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {template.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleTemplateSelect(template)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      >
                        Use Template
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Preview
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
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Create your own custom design from scratch with our powerful design tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/design-studio"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Start Custom Design
            </Link>
            <Link
              to="/contact"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Request Custom Template
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Templates; 