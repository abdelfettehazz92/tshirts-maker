import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  FaTshirt, FaPalette, FaEye, FaFont, FaImage, FaSave, 
  FaUndo, FaRedo, FaTrash, FaCloudUploadAlt, FaMoon, FaSun,
  FaUser, FaShoppingBag, FaPaintBrush, FaCog, FaSignOutAlt,
  FaChevronDown, FaBold, FaItalic, FaUnderline, FaAlignLeft,
  FaAlignCenter, FaAlignRight, FaPlus, FaRobot, FaExpand,
  FaCompress, FaSync, FaArrowsAlt
} from 'react-icons/fa';

interface DesignState {
  product: string;
  color: string;
  view: string;
  uploadedImage: string | null;
  text: string;
  textStyle: {
    fontFamily: string;
    fontSize: number;
    color: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
    textAlign: string;
  };
  imagePosition: { x: number; y: number };
  textPosition: { x: number; y: number };
  imageSize: { width: number; height: number };
  textSize: { width: number; height: number };
  imageOpacity: number;
  textOpacity: number;
  imageRotation: number;
  textRotation: number;
}

const DesignStudio: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check authentication on component mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // If not authenticated, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please login to access the Design Studio</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  const [designState, setDesignState] = useState<DesignState>({
    product: 'T-Shirt',
    color: 'black',
    view: 'front',
    uploadedImage: null,
    text: '',
    textStyle: {
      fontFamily: 'Arial',
      fontSize: 24,
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center'
    },
    imagePosition: { x: 50, y: 50 },
    textPosition: { x: 50, y: 50 },
    imageSize: { width: 200, height: 200 },
    textSize: { width: 150, height: 50 },
    imageOpacity: 1,
    textOpacity: 1,
    imageRotation: 0,
    textRotation: 0
  });

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [designHistory, setDesignHistory] = useState<DesignState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [imageControls, setImageControls] = useState({
    show: false,
    width: 200,
    height: 200,
    opacity: 1,
    rotation: 0
  });

  // Product images configuration - matching PHP version
  const productImages = {
    'T-Shirt': {
      'black': {
        'front': '/images/black t-shirts/black-front.jpg',
        'back': '/images/black t-shirts/behind.jpg',
        'left': '/images/black t-shirts/left.jpg',
        'right': '/images/black t-shirts/right.jpg'
      },
      'white': {
        'front': '/images/white t-shirts/front.jpg',
        'back': '/images/white t-shirts/behind.jpg',
        'left': '/images/white t-shirts/left.jpg',
        'right': '/images/white t-shirts/right.jpg'
      },
      'red': {
        'front': '/images/red t-shirts/front.jpg',
        'back': '/images/red t-shirts/back.jpg',
        'left': '/images/red t-shirts/left.jpg',
        'right': '/images/red t-shirts/right.jpg'
      },
      'blue': {
        'front': '/images/bleu t-shirts/front.jpg',
        'back': '/images/bleu t-shirts/back.jpg',
        'left': '/images/bleu t-shirts/left.jpg',
        'right': '/images/bleu t-shirts/right.jpg'
      },
      'green': {
        'front': '/images/green t-shirts/front.jpg',
        'back': '/images/green t-shirts/behind.jpg',
        'left': '/images/green t-shirts/left.jpg',
        'right': '/images/green t-shirts/right.jpg'
      },
      'yellow': {
        'front': '/images/yellow-front.jpg',
        'back': '/images/yellow-back.jpg',
        'left': '/images/yellow-left.jpg',
        'right': '/images/yellow-right.jpg'
      },
      'pink': {
        'front': '/images/pink-front.jpg',
        'back': '/images/pink-back.jpg',
        'left': '/images/pink-left.jpg',
        'right': '/images/pink-right.jpg'
      },
      'gray': {
        'front': '/images/grey t-shirts/front.jpg',
        'back': '/images/grey t-shirts/behind.jpg',
        'left': '/images/grey t-shirts/left.jpg',
        'right': '/images/grey t-shirts/right.jpg'
      }
    }
  };

  const colors = [
    { name: 'black', hex: '#000000' },
    { name: 'white', hex: '#ffffff' },
    { name: 'red', hex: '#ff0000' },
    { name: 'blue', hex: '#0000ff' },
    { name: 'green', hex: '#008000' },
    { name: 'yellow', hex: '#ffff00' },
    { name: 'pink', hex: '#ff00ff' },
    { name: 'gray', hex: '#808080' }
  ];

  const products = ['T-Shirt', 'Hoodie', 'Tank Top', 'Long Sleeve'];
  const views = ['front', 'back', 'left', 'right'];

  // Save to history
  const saveToHistory = (newState: DesignState) => {
    const newHistory = designHistory.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setDesignHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Update design state
  const updateDesignState = (updates: Partial<DesignState>) => {
    const newState = { ...designState, ...updates };
    setDesignState(newState);
    saveToHistory(newState);
  };

  // Change color
  const changeColor = (color: string) => {
    updateDesignState({ color });
  };

  // Change view
  const changeView = (view: string) => {
    updateDesignState({ view });
  };

  // Change product
  const changeProduct = (product: string) => {
    updateDesignState({ product });
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateDesignState({ uploadedImage: e.target?.result as string });
        setImageControls(prev => ({
          ...prev,
          show: true,
          width: 200,
          height: 200,
          opacity: 1,
          rotation: 0
        }));
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow multiple uploads
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update image controls
  const updateImageControls = (updates: Partial<typeof imageControls>) => {
    const newControls = { ...imageControls, ...updates };
    setImageControls(newControls);
    
    // Update design state with new image properties
    updateDesignState({
      imageSize: { width: newControls.width, height: newControls.height },
      imageOpacity: newControls.opacity,
      imageRotation: newControls.rotation
    });
  };

  // Add text
  const addText = () => {
    if (designState.text.trim()) {
      updateDesignState({ text: designState.text });
    }
  };

  // Toggle text style
  const toggleTextStyle = (style: string) => {
    const newTextStyle = { ...designState.textStyle };
    switch (style) {
      case 'bold':
        newTextStyle.fontWeight = newTextStyle.fontWeight === 'bold' ? 'normal' : 'bold';
        break;
      case 'italic':
        newTextStyle.fontStyle = newTextStyle.fontStyle === 'italic' ? 'normal' : 'italic';
        break;
      case 'underline':
        newTextStyle.textDecoration = newTextStyle.textDecoration === 'underline' ? 'none' : 'underline';
        break;
    }
    updateDesignState({ textStyle: newTextStyle });
  };

  // Set text alignment
  const setTextAlign = (align: string) => {
    updateDesignState({
      textStyle: { ...designState.textStyle, textAlign: align }
    });
  };

  // Clear design
  const clearDesign = () => {
    updateDesignState({
      uploadedImage: null,
      text: '',
      imagePosition: { x: 50, y: 50 },
      textPosition: { x: 50, y: 50 }
    });
    setImageControls(prev => ({ ...prev, show: false }));
  };

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDesignState(designHistory[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < designHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDesignState(designHistory[historyIndex + 1]);
    }
  };

  // Save design
  const saveDesign = async () => {
    if (!user) {
      alert('Please login to save your design');
      return;
    }

    setIsSaving(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const imageData = canvas.toDataURL('image/png');
      
      const response = await fetch('/api/save-design.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          product: designState.product,
          color: designState.color,
          view: designState.view
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Design saved successfully!');
        navigate('/orders');
      } else {
        alert('Error saving design: ' + data.message);
      }
    } catch (error) {
      alert('Error saving design. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - much bigger now
    canvas.width = 800;
    canvas.height = 1000;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load and draw t-shirt base image
    const baseImage = new Image();
    const imagePath = productImages[designState.product as keyof typeof productImages]?.[designState.color as keyof typeof productImages['T-Shirt']]?.[designState.view as keyof typeof productImages['T-Shirt']['black']] || '/images/black t-shirts/black-front.jpg';
    
    baseImage.onload = () => {
      // Draw base image
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Draw uploaded image if exists
      if (designState.uploadedImage) {
        const uploadedImg = new Image();
        uploadedImg.onload = () => {
          ctx.save();
          ctx.globalAlpha = designState.imageOpacity;
          ctx.translate(designState.imagePosition.x * canvas.width / 100, designState.imagePosition.y * canvas.height / 100);
          ctx.rotate(designState.imageRotation * Math.PI / 180);
          ctx.drawImage(
            uploadedImg,
            -designState.imageSize.width / 2,
            -designState.imageSize.height / 2,
            designState.imageSize.width,
            designState.imageSize.height
          );
          ctx.restore();
        };
        uploadedImg.src = designState.uploadedImage;
      }

      // Draw text if exists
      if (designState.text) {
        ctx.save();
        ctx.globalAlpha = designState.textOpacity;
        ctx.translate(designState.textPosition.x * canvas.width / 100, designState.textPosition.y * canvas.height / 100);
        ctx.rotate(designState.textRotation * Math.PI / 180);
        
        const fontStyle = designState.textStyle.fontStyle === 'italic' ? 'italic' : 'normal';
        const fontWeight = designState.textStyle.fontWeight;
        ctx.font = `${fontStyle} ${fontWeight} ${designState.textStyle.fontSize}px ${designState.textStyle.fontFamily}`;
        ctx.fillStyle = designState.textStyle.color;
        ctx.textAlign = designState.textStyle.textAlign as CanvasTextAlign;
        ctx.textBaseline = 'middle';
        
        ctx.fillText(designState.text, 0, 0);
        
        // Draw underline if needed
        if (designState.textStyle.textDecoration === 'underline') {
          const metrics = ctx.measureText(designState.text);
          const y = designState.textStyle.fontSize / 2 + 2;
          ctx.strokeStyle = designState.textStyle.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-metrics.width / 2, y);
          ctx.lineTo(metrics.width / 2, y);
          ctx.stroke();
        }
        
        ctx.restore();
      }
    };
    
    baseImage.src = imagePath;
  }, [designState]);

  // Initialize history
  useEffect(() => {
    if (designHistory.length === 0) {
      setDesignHistory([designState]);
      setHistoryIndex(0);
    }
  }, []);

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 ${isDarkTheme ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-lg shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaTshirt className="text-2xl text-blue-600 mr-2" />
              <span className="text-xl font-bold">T-Shirt Designer</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkTheme ? <FaSun /> : <FaMoon />}
              </button>
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{user.firstname || 'User'}</span>
                    <FaChevronDown className="text-sm" />
                  </button>
                  
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <img
                          src="https://randomuser.me/api/portraits/men/32.jpg"
                          alt="User"
                          className="w-12 h-12 rounded-full mx-auto mb-2"
                        />
                        <h6 className="text-center font-semibold">{user.firstname || 'User'}</h6>
                        <p className="text-center text-sm text-gray-500">Premium Member</p>
                      </div>
                      <a href="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FaUser className="mr-2" /> My Profile
                      </a>
                      <a href="/orders" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FaShoppingBag className="mr-2" /> My Orders
                      </a>
                      <a href="/designs" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FaPaintBrush className="mr-2" /> My Designs
                      </a>
                      <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      <a href="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FaCog className="mr-2" /> Settings
                      </a>
                      <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FaSignOutAlt className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Design Your Custom T-Shirt</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Craft unique designs with our intuitive studio. Upload images, add text, and preview your creation in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Design Tools */}
          <div className="lg:col-span-1">
            <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 sticky top-24`}>
              {/* Product Type */}
              <div className="mb-6">
                <h3 className="flex items-center text-lg font-semibold mb-4">
                  <FaTshirt className="mr-2 text-green-500" />
                  Product Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {products.map((product) => (
                    <button
                      key={product}
                      onClick={() => changeProduct(product)}
                      className={`p-2 text-sm rounded-lg border transition-all ${
                        designState.product === product
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {product}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="flex items-center text-lg font-semibold mb-4">
                  <FaPalette className="mr-2 text-green-500" />
                  Colors
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => changeColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        designState.color === color.name
                          ? 'border-green-500 scale-110'
                          : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* View Angle */}
              <div className="mb-6">
                <h3 className="flex items-center text-lg font-semibold mb-4">
                  <FaEye className="mr-2 text-green-500" />
                  View Angle
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {views.map((view) => (
                    <button
                      key={view}
                      onClick={() => changeView(view)}
                      className={`p-2 text-sm rounded-lg border transition-all flex items-center ${
                        designState.view === view
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-gray-300 hover:border-orange-500'
                      }`}
                    >
                      <FaTshirt className="mr-1" />
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Tools */}
              <div className="mb-6">
                <h3 className="flex items-center text-lg font-semibold mb-4">
                  <FaFont className="mr-2 text-green-500" />
                  Text
                </h3>
                <input
                  type="text"
                  value={designState.text}
                  onChange={(e) => setDesignState({ ...designState, text: e.target.value })}
                  placeholder="Enter your text"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-3"
                />
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    onClick={() => toggleTextStyle('bold')}
                    className={`p-2 rounded-lg border ${
                      designState.textStyle.fontWeight === 'bold'
                        ? 'bg-blue-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    <FaBold />
                  </button>
                  <button
                    onClick={() => toggleTextStyle('italic')}
                    className={`p-2 rounded-lg border ${
                      designState.textStyle.fontStyle === 'italic'
                        ? 'bg-blue-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    <FaItalic />
                  </button>
                  <button
                    onClick={() => toggleTextStyle('underline')}
                    className={`p-2 rounded-lg border ${
                      designState.textStyle.textDecoration === 'underline'
                        ? 'bg-blue-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    <FaUnderline />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    onClick={() => setTextAlign('left')}
                    className={`p-2 rounded-lg border ${
                      designState.textStyle.textAlign === 'left'
                        ? 'bg-blue-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    <FaAlignLeft />
                  </button>
                  <button
                    onClick={() => setTextAlign('center')}
                    className={`p-2 rounded-lg border ${
                      designState.textStyle.textAlign === 'center'
                        ? 'bg-blue-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    <FaAlignCenter />
                  </button>
                  <button
                    onClick={() => setTextAlign('right')}
                    className={`p-2 rounded-lg border ${
                      designState.textStyle.textAlign === 'right'
                        ? 'bg-blue-600 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    <FaAlignRight />
                  </button>
                </div>
                <button
                  onClick={addText}
                  className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FaPlus className="mr-2" />
                  Add Text
                </button>
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <h3 className="flex items-center text-lg font-semibold mb-4">
                  <FaImage className="mr-2 text-green-500" />
                  Upload Image
                </h3>
                <div className="border-2 border-dashed border-green-500 rounded-lg p-4 text-center">
                  <FaCloudUploadAlt className="text-3xl text-green-500 mx-auto mb-2" />
                  <p className="text-sm mb-2">Drag & Drop or Click to Upload</p>
                  <p className="text-xs text-gray-500">Supported formats: JPG, PNG (Max 5MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Choose File
                  </button>
                </div>
              </div>

              {/* Image Controls - Professional Resize Controls */}
              {imageControls.show && designState.uploadedImage && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="flex items-center text-lg font-semibold mb-4">
                    <FaArrowsAlt className="mr-2 text-blue-500" />
                    Image Controls
                  </h3>
                  
                  {/* Size Controls */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Width: {imageControls.width}px</label>
                    <input
                      type="range"
                      min="50"
                      max="400"
                      value={imageControls.width}
                      onChange={(e) => updateImageControls({ width: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Height: {imageControls.height}px</label>
                    <input
                      type="range"
                      min="50"
                      max="400"
                      value={imageControls.height}
                      onChange={(e) => updateImageControls({ height: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Opacity Control */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Opacity: {Math.round(imageControls.opacity * 100)}%</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={imageControls.opacity}
                      onChange={(e) => updateImageControls({ opacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Rotation Controls */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rotation: {imageControls.rotation}°</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateImageControls({ rotation: imageControls.rotation - 15 })}
                        className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        <FaSync style={{ transform: 'scaleX(-1)' }} />
                      </button>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={imageControls.rotation}
                        onChange={(e) => updateImageControls({ rotation: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <button
                        onClick={() => updateImageControls({ rotation: imageControls.rotation + 15 })}
                        className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        <FaSync />
                      </button>
                    </div>
                  </div>

                  {/* Quick Size Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateImageControls({ width: 100, height: 100 })}
                      className="p-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Small
                    </button>
                    <button
                      onClick={() => updateImageControls({ width: 200, height: 200 })}
                      className="p-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => updateImageControls({ width: 300, height: 300 })}
                      className="p-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Large
                    </button>
                    <button
                      onClick={() => updateImageControls({ width: 150, height: 150 })}
                      className="p-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Square
                    </button>
                  </div>
                </div>
              )}

              {/* Save Buttons */}
              <button
                onClick={saveDesign}
                disabled={isSaving}
                className="w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mb-3 flex items-center justify-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Design
                  </>
                )}
              </button>
              
              <button
                onClick={() => {/* AI confirmation logic */}}
                className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <FaRobot className="mr-2" />
                Confirm Order with AI
              </button>
            </div>
          </div>

          {/* Design Preview - Much Bigger Now */}
          <div className="lg:col-span-3">
            <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Design Preview</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="p-2 rounded-lg border border-gray-300 hover:border-blue-500 disabled:opacity-50"
                  >
                    <FaUndo />
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex >= designHistory.length - 1}
                    className="p-2 rounded-lg border border-gray-300 hover:border-blue-500 disabled:opacity-50"
                  >
                    <FaRedo />
                  </button>
                  <button
                    onClick={clearDesign}
                    className="p-2 rounded-lg border border-gray-300 hover:border-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto max-w-full object-contain"
                  style={{ maxHeight: '70vh' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;