import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    destinasi: 0,
    kategori: 0,
    ulasan: 0,
    pengguna: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { nama: 'Admin' };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch destinasi count
        const destinasiRes = await axios.get('http://localhost:5000/api/destinasi');
        
        // Fetch kategori count
        const kategoriRes = await axios.get('http://localhost:5000/api/kategori');
        
        // Fetch ulasan count
        const ulasanRes = await axios.get('http://localhost:5000/api/ulasan');
        
        // Fetch pengguna count (requires auth)
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        let penggunaCount = 0;
        
        if (token) {
          const penggunaRes = await axios.get('http://localhost:5000/api/pengguna', {
            headers: { Authorization: `Bearer ${token}` }
          });
          penggunaCount = penggunaRes.data.length;
        }
        
        setStats({
          destinasi: destinasiRes.data.length,
          kategori: kategoriRes.data.length,
          ulasan: ulasanRes.data.length,
          pengguna: penggunaCount
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Gagal memuat data statistik');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-nature-200 border-t-nature-600 mx-auto mb-4"></div>
          <p className="text-nature-600 text-lg font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-6">
              <div><svg 
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
                  <i className="fa-solid fa-leaf text-white text-2xl"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Selamat Datang, {currentUser?.nama || 'Admin'}
                </h1>
                <p className="text-gray-600">
                  Panel kontrol untuk mengelola Katalog Wisata Lokal
                </p>
              </div>
             </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <i className="fa-solid fa-circle-exclamation text-red-500 mr-3"></i>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Destinasi Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-nature-500 p-6 text-white relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-nature-100 text-sm font-semibold uppercase tracking-wider">Destinasi</p>
                  <p className="text-4xl font-bold mt-2">{stats.destinasi}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg shadow-inner">
                  <i className="fa-solid fa-mountain-sun text-2xl"></i>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <button 
                onClick={() => handleNavigation('/admin/destinasi')}
                className="flex items-center justify-between text-nature-600 hover:text-nature-700 transition-colors duration-300 text-sm font-semibold w-full bg-transparent border-0 cursor-pointer"
              >
                <span>Kelola Destinasi</span>
                <i className="fa-solid fa-arrow-right transform transition-transform duration-300 group-hover:translate-x-1"></i>
              </button>
            </div>
          </div>

          {/* Kategori Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-earth-500 p-6 text-white relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-earth-100 text-sm font-semibold uppercase tracking-wider">Kategori</p>
                  <p className="text-4xl font-bold mt-2">{stats.kategori}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg shadow-inner">
                  <i className="fa-solid fa-tags text-2xl"></i>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <button 
                onClick={() => handleNavigation('/admin/kategori')}
                className="flex items-center justify-between text-earth-600 hover:text-earth-700 transition-colors duration-300 text-sm font-semibold w-full bg-transparent border-0 cursor-pointer"
              >
                <span>Kelola Kategori</span>
                <i className="fa-solid fa-arrow-right transform transition-transform duration-300 group-hover:translate-x-1"></i>
              </button>
            </div>
          </div>

          {/* Ulasan Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-amber-600 p-6 text-white relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-amber-100 text-sm font-semibold uppercase tracking-wider">Ulasan</p>
                  <p className="text-4xl font-bold mt-2">{stats.ulasan}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg shadow-inner">
                  <i className="fa-solid fa-star text-2xl"></i>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <button 
                onClick={() => handleNavigation('/admin/ulasan')}
                className="flex items-center justify-between text-amber-600 hover:text-amber-700 transition-colors duration-300 text-sm font-semibold w-full bg-transparent border-0 cursor-pointer"
              >
                <span>Kelola Ulasan</span>
                <i className="fa-solid fa-arrow-right transform transition-transform duration-300 group-hover:translate-x-1"></i>
              </button>
            </div>
          </div>

          {/* Pengguna Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-water-600 p-6 text-white relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-water-100 text-sm font-semibold uppercase tracking-wider">Pengguna</p>
                  <p className="text-4xl font-bold mt-2">{stats.pengguna}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg shadow-inner">
                  <i className="fa-solid fa-users text-2xl"></i>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <button 
                onClick={() => handleNavigation('/admin/pengguna')}
                className="flex items-center justify-between text-water-600 hover:text-water-700 transition-colors duration-300 text-sm font-semibold w-full bg-transparent border-0 cursor-pointer"
              >
                <span>Kelola Pengguna</span>
                <i className="fa-solid fa-arrow-right transform transition-transform duration-300 group-hover:translate-x-1"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => handleNavigation('/admin/destinasi/tambah')}
              className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-nature-500 text-gray-700 hover:text-nature-600 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer group"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-nature-100 text-nature-600 p-3 rounded-lg group-hover:bg-nature-200 transition-colors duration-300">
                  <i className="fa-solid fa-plus text-xl"></i>
                </div>
                <span className="font-semibold text-center">Tambah Destinasi</span>
              </div>
            </button>
            
            <button
              onClick={() => handleNavigation('/admin/kategori/tambah')}
              className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-earth-500 text-gray-700 hover:text-earth-600 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer group"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-earth-100 text-earth-600 p-3 rounded-lg group-hover:bg-earth-200 transition-colors duration-300">
                  <i className="fa-solid fa-plus text-xl"></i>
                </div>
                <span className="font-semibold text-center">Tambah Kategori</span>
              </div>
            </button>
            
            <button
              onClick={() => handleNavigation('/admin/gambar/tambah')}
              className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-amber-500 text-gray-700 hover:text-amber-600 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer group"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-amber-100 text-amber-600 p-3 rounded-lg group-hover:bg-amber-200 transition-colors duration-300">
                  <i className="fa-solid fa-image text-xl"></i>
                </div>
                <span className="font-semibold text-center">Upload Gambar</span>
              </div>
            </button>
            
            <button
              onClick={() => handleNavigation('/admin/pengguna/tambah')}
              className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-water-500 text-gray-700 hover:text-water-600 p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer group"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-water-100 text-water-600 p-3 rounded-lg group-hover:bg-water-200 transition-colors duration-300">
                  <i className="fa-solid fa-user-plus text-xl"></i>
                </div>
                <span className="font-semibold text-center">Tambah Pengguna</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;