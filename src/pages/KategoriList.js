import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const KategoriList = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKategori();
  }, []);

  const getKategori = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kategori');
      setKategori(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Icon mapping untuk setiap kategori
  const getKategoriIcon = (namaKategori) => {
    const iconMap = {
      'Pantai': 'fa-solid fa-umbrella-beach',
      'Gunung': 'fa-solid fa-mountain',
      'Danau': 'fa-solid fa-water',
      'Hutan': 'fa-solid fa-tree',
      'Kota': 'fa-solid fa-city',
      'Budaya': 'fa-solid fa-landmark',
      'Sejarah': 'fa-solid fa-monument',
      'Kuliner': 'fa-solid fa-utensils',
      'Adventure': 'fa-solid fa-hiking',
      'Religi': 'fa-solid fa-mosque',
      'Taman': 'fa-solid fa-seedling',
      'Air Terjun': 'fa-solid fa-waterfall',
      'Default': 'fa-solid fa-map-location-dot'
    };
    
    return iconMap[namaKategori] || iconMap['Default'];
  };

  // Color mapping untuk setiap kategori
  const getKategoriColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
      'from-orange-500 to-orange-600',
      'from-cyan-500 to-cyan-600'
    ];
    
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-nature-500 to-nature-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute w-16 h-16 bg-white bg-opacity-10 rounded-full top-1/4 right-1/6 animate-pulse"></div>
          <div className="absolute w-12 h-12 bg-white bg-opacity-10 rounded-full top-3/4 right-1/4 animate-pulse delay-1000"></div>
          <div className="absolute w-20 h-20 bg-white bg-opacity-10 rounded-full top-1/2 right-10 animate-pulse delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 text-center text-white">
            <div className="inline-block mb-4">
              <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-medium flex items-center space-x-2 inline-flex">
                <i className="fa-solid fa-list text-yellow-400"></i>
                <span>Kategori Wisata</span>
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Jelajahi Berdasarkan
              <span className="block text-nature-200">Kategori</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
              Temukan destinasi wisata yang sesuai dengan minat dan preferensi Anda melalui berbagai kategori pilihan
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white shadow-lg relative -mt-8 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-nature-600 mb-2">{kategori.length}</div>
              <div className="text-gray-600 font-medium">Kategori Tersedia</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Destinasi</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-red-600 mb-2">4.8</div>
              <div className="text-gray-600 font-medium">Rating Rata-rata</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Kategori Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-nature-50 text-nature-600 px-6 py-3 rounded-full text-lg font-medium">
                Pilih Kategori Favorit
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Kategori Wisata Populer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Setiap kategori menawarkan pengalaman unik dan tak terlupakan untuk petualangan Anda
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-nature-500 mb-6"></div>
              <p className="text-2xl text-gray-600 font-medium">Memuat kategori wisata...</p>
              <p className="text-gray-500 mt-2">Tunggu sebentar, kami sedang menyiapkan kategori terbaik untuk Anda</p>
            </div>
          ) : (
            <>
              {kategori.length > 0 ? (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                  {kategori.map((item, index) => (
                    <div 
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100 group"
                      key={item.id_kategori}
                    >
                      {/* Gradient Header */}
                      <div className={`h-32 bg-gradient-to-r ${getKategoriColor(index)} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white text-center">
                            <i className={`${getKategoriIcon(item.nama_kategori)} text-4xl mb-2`}></i>
                            <div className="text-sm font-medium opacity-90">Kategori</div>
                          </div>
                        </div>
                        
                        {/* Floating decoration */}
                        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-500"></div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-nature-600 transition-colors">
                          {item.nama_kategori}
                        </h3>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed text-base">
                          {item.deskripsi || `Jelajahi destinasi wisata ${item.nama_kategori.toLowerCase()} terbaik di Indonesia dengan pemandangan spektakuler dan pengalaman tak terlupakan.`}
                        </p>
                        
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <i className="fa-solid fa-star text-yellow-500"></i>
                              <span className="text-sm font-medium text-gray-600">4.8</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <i className="fa-solid fa-map-location-dot text-gray-400"></i>
                              <span className="text-sm text-gray-600">Indonesia</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-nature-600">25+</div>
                            <div className="text-xs text-gray-500">Destinasi</div>
                          </div>
                        </div>
                        
                        <Link 
                          to={`/destinasi?kategori=${item.id_kategori}`} 
                          className="w-full bg-gradient-to-r from-nature-500 to-nature-600 hover:from-nature-600 hover:to-nature-700 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 no-underline transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <span>Jelajahi {item.nama_kategori}</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="mb-8">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fa-solid fa-folder-open text-gray-400 text-4xl"></i>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-gray-900">Belum Ada Kategori</h3>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                      Maaf, saat ini belum ada kategori wisata yang tersedia. 
                      Silakan coba lagi nanti atau hubungi administrator.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <button 
                        onClick={() => window.location.reload()}
                        className="bg-nature-500 hover:bg-nature-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-refresh"></i>
                        <span>Refresh Halaman</span>
                      </button>
                      <Link 
                        to="/" 
                        className="bg-white hover:bg-gray-50 text-nature-500 hover:text-nature-600 border-2 border-nature-500 hover:border-nature-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-2 no-underline"
                      >
                        <i className="fa-solid fa-home"></i>
                        <span>Kembali ke Beranda</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-nature-500 to-nature-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Petualangan?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Pilih kategori yang menarik minat Anda dan mulai jelajahi destinasi wisata terbaik di Indonesia
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/destinasi" 
                className="bg-white hover:bg-gray-100 text-nature-500 hover:text-nature-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-2 no-underline"
              >
                <i className="fa-solid fa-map"></i>
                <span>Lihat Semua Destinasi</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KategoriList;