import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { nama: 'Admin' };

  const navItems = [
    { 
      label: 'Dashboard', 
      icon: 'fa-solid fa-house',
      href: '/admin'
    },
    { 
      label: 'Destinasi', 
      icon: 'fa-solid fa-mountain-sun',
      href: '/admin/destinasi'
    },
    { 
      label: 'Kategori', 
      icon: 'fa-solid fa-tags',
      href: '/admin/kategori'
    },
    { 
      label: 'Gambar', 
      icon: 'fa-solid fa-images',
      href: '/admin/gambar'
    },
    { 
      label: 'Ulasan', 
      icon: 'fa-solid fa-star',
      href: '/admin/ulasan'
    },
    { 
      label: 'Pengguna', 
      icon: 'fa-solid fa-users',
      href: '/admin/pengguna'
    }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    setIsProfileOpen(false);
    navigate('/login');
  };

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate('/admin/profile');
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
                to="/admin" 
                className="flex items-center space-x-3 text-nature-500 hover:text-nature-600 transition-colors duration-300"
              >
                <div className="bg-nature-500 p-2 rounded-lg shadow-lg">
                  <i className="fa-solid fa-leaf text-white text-lg"></i>
                </div>
                <span className="text-xl font-bold text-nature-500">
                  Travel Admin
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

            {/* User Profile Dropdown */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 text-gray-600 hover:text-nature-500 transition-colors duration-300 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-nature-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{currentUser?.nama?.charAt(0) || 'A'}</span>
                  </div>
                  <span className="text-sm">Hi, {currentUser?.nama || 'Admin'}</span>
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
                      <span>Profile</span>
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
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-nature-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-nature-500 transition-all duration-300"
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
                    ? 'bg-nature-500 text-white'
                    : 'text-gray-600 hover:text-nature-500 hover:bg-gray-100'
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-nature-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{currentUser?.nama?.charAt(0) || 'A'}</span>
                  </div>
                  <span className="text-gray-600 text-sm">Hi, {currentUser?.nama || 'Admin'}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleProfile();
                    }}
                    className="p-2 text-gray-500 hover:text-nature-500 transition-colors duration-200"
                    title="Profile"
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
                    Apakah Anda yakin ingin keluar dari sistem? Anda akan dialihkan ke halaman login.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Ya, Logout
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nature-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
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

export default AdminNavbar;