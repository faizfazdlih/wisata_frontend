import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileRef = useRef(null);

  const navItems = [
    { 
      label: 'Destinasi', 
      icon: 'fa-solid fa-mountain-sun',
      href: '/destinasi'
    },
    { 
      label: 'Kategori', 
      icon: 'fa-solid fa-tags',
      href: '/kategori'
    }
  ];

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (href) => {
    return location.pathname.startsWith(href);
  };

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate('/dashboard');
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center space-x-3 text-nature-500 hover:text-nature-600 transition-colors duration-300 no-underline"
              >
<svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 40 40" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                  >
                    <defs>
                      <linearGradient id="worldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                      <linearGradient id="planeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#EF4444" />
                      </linearGradient>
                    </defs>
                    
                    {/* Globe/World */}
                    <circle 
                      cx="20" 
                      cy="20" 
                      r="16" 
                      fill="url(#worldGradient)" 
                      stroke="#1F2937" 
                      strokeWidth="1.5"
                    />
                    
                    {/* Continents/Land masses */}
                    <path 
                      d="M8 16C8 14 10 12 14 12C16 12 18 14 18 16C18 18 16 20 14 20C12 20 10 18 8 16Z" 
                      fill="#059669" 
                      opacity="0.8"
                    />
                    <path 
                      d="M22 14C22 12 24 10 28 10C30 10 32 12 32 14C32 16 30 18 28 18C26 18 24 16 22 14Z" 
                      fill="#059669" 
                      opacity="0.8"
                    />
                    <path 
                      d="M12 26C12 24 14 22 18 22C20 22 22 24 22 26C22 28 20 30 18 30C16 30 14 28 12 26Z" 
                      fill="#059669" 
                      opacity="0.8"
                    />
                    <path 
                      d="M26 28C26 26 28 24 32 24C34 24 36 26 36 28C36 30 34 32 32 32C30 32 28 30 26 28Z" 
                      fill="#059669" 
                      opacity="0.8"
                    />
                    
                    {/* Longitude/Latitude lines */}
                    <ellipse 
                      cx="20" 
                      cy="20" 
                      rx="16" 
                      ry="8" 
                      fill="none" 
                      stroke="#1F2937" 
                      strokeWidth="0.5" 
                      opacity="0.3"
                    />
                    <ellipse 
                      cx="20" 
                      cy="20" 
                      rx="8" 
                      ry="16" 
                      fill="none" 
                      stroke="#1F2937" 
                      strokeWidth="0.5" 
                      opacity="0.3"
                    />
                    <line 
                      x1="4" 
                      y1="20" 
                      x2="36" 
                      y2="20" 
                      stroke="#1F2937" 
                      strokeWidth="0.5" 
                      opacity="0.3"
                    />
                    
                    {/* Airplane */}
                    <g transform="translate(28, 8) rotate(45)">
                      <path 
                        d="M0 2L8 0L10 2L6 4L8 6L4 8L2 6L0 8L-2 6L2 4L0 2Z" 
                        fill="url(#planeGradient)" 
                        stroke="#1F2937" 
                        strokeWidth="0.8"
                      />
                      <circle cx="2" cy="4" r="1" fill="#FFF" opacity="0.8"/>
                    </g>
                    
                    {/* Flight path/trail */}
                    <path 
                      d="M10 30Q15 25 20 20Q25 15 30 10" 
                      fill="none" 
                      stroke="#F59E0B" 
                      strokeWidth="1.5" 
                      strokeDasharray="2,2" 
                      opacity="0.6"
                    />
                    
                    {/* Location pin */}
                    <g transform="translate(26, 26)">
                      <path 
                        d="M0 0C-2 0 -4 2 -4 4C-4 6 0 10 0 10S4 6 4 4C4 2 2 0 0 0Z" 
                        fill="#EF4444" 
                        stroke="#1F2937" 
                        strokeWidth="0.8"
                      />
                      <circle cx="0" cy="4" r="1.5" fill="#FFF"/>
                    </g>
                  </svg>
                <span className="text-xl font-bold text-nature-500">
                  Touch Some Grass
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-nature-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-nature-500 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <i className={`${item.icon} w-4 h-4 text-center`}></i>
                      <span>{item.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 text-gray-600 hover:text-nature-500 transition-colors duration-300 focus:outline-none"
                  >
                    <div className="w-8 h-8 bg-nature-500 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-user text-white text-sm"></i>
                    </div>
                    <span className="text-sm">Hi, {currentUser?.nama || 'User'}</span>
                    <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
                      <button
                        onClick={handleProfile}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-nature-500 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-user text-sm"></i>
                        <span>Dashboard</span>
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-right-from-bracket text-sm"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-nature-500 hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 no-underline"
                  >
                    <i className="fa-solid fa-right-to-bracket w-4 h-4 text-center"></i>
                    <span>Masuk</span>
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-nature-500 text-white shadow-lg hover:bg-nature-500 transition-all duration-300 flex items-center space-x-2 no-underline"
                  >
                    <i className="fa-solid fa-user-plus w-4 h-4 text-center"></i>
                    <span>Daftar</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
              >
                <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} h-6 w-6`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <i className={`${item.icon} w-5 h-5 text-center`}></i>
                  <span>{item.label}</span>
                </span>
              </button>
            ))}
            
            {/* Mobile User Profile */}
            <div className="px-3 py-2 border-t border-gray-200 mt-2">
              {currentUser ? (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{currentUser?.nama?.charAt(0) || 'U'}</span>
                      </div>
                      <span className="text-gray-600 text-sm">Hi, {currentUser?.nama || 'User'}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleProfile();
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                        title="Dashboard"
                      >
                        <i className="fa-solid fa-user text-sm"></i>
                      </button>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setShowLogoutModal(true);
                        }}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                        title="Logout"
                      >
                        <i className="fa-solid fa-right-from-bracket text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-all duration-300"
                  >
                    <span className="flex items-center space-x-3">
                      <i className="fa-solid fa-right-to-bracket w-5 h-5 text-center"></i>
                      <span>Masuk</span>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/register');
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                  >
                    <span className="flex items-center space-x-3">
                      <i className="fa-solid fa-user-plus w-5 h-5 text-center"></i>
                      <span>Daftar</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl transform transition-all animate-slide-up">
            <div className="flex items-start mb-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <i className="fa-solid fa-triangle-exclamation text-red-600"></i>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Konfirmasi Logout
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Apakah Anda yakin ingin keluar dari sistem? Anda akan dialihkan ke halaman utama.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Spacer untuk navbar fixed */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;