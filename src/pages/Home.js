import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [destinasi, setDestinasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDestinasi();
  }, []);

  const getDestinasi = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/destinasi');
      setDestinasi(response.data.slice(0, 6)); // Ambil 6 destinasi terbaru
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div            
          className="absolute inset-0 w-full h-full"           
          style={{             
            background: 'linear-gradient(135deg, rgba(74, 107, 74, 0.85) 0%, rgba(120, 142, 89, 0.85) 50%, rgba(221, 221, 221, 0.85) 100%), url("https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") center/cover',             
            minHeight: '100vh'           
          }}         
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute w-24 h-24 bg-white bg-opacity-10 rounded-full top-1/5 right-1/10 animate-pulse"></div>
          <div className="absolute w-16 h-16 bg-white bg-opacity-10 rounded-full top-3/5 right-1/5 animate-pulse delay-1000"></div>
          <div className="absolute w-20 h-20 bg-white bg-opacity-10 rounded-full top-2/5 right-5 animate-pulse delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center min-h-screen">
            <div className="w-full lg:w-2/3 xl:w-3/5">
              <div className="text-white py-20">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  Jelajahi Keindahan
                  <span className="block text-nature-200">Wisata Indonesia</span>
                </h1>
                
                <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-2xl">
                  Temukan destinasi wisata lokal terbaik di Indonesia dengan panduan lengkap, 
                  ulasan terpercaya, dan pengalaman tak terlupakan yang menanti Anda.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <Link 
                    to="/destinasi" 
                    className="bg-nature-500 hover:bg-nature-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 no-underline"
                  >
                    <i className="fa-solid fa-compass text-yellow-400"></i>
                    <span>Jelajahi Sekarang</span>
                  </Link>
                  <Link 
                    to="/kategori" 
                    className="bg-nature-500 hover:bg-nature-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 no-underline"
                  >
                    <i className="fa-solid fa-list text-yellow-400"></i>
                    <span>Lihat Kategori</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-6">
          <div className="text-white text-center">
            <small className="block mb-2 opacity-75 font-medium">Scroll untuk melihat lebih banyak</small>
            <div className="animate-bounce">
              <i className="fa-solid fa-chevron-down text-2xl"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-nature-50 text-nature-600 px-6 py-3 rounded-full text-lg font-medium">
                Keunggulan Kami
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Mengapa Memilih Kami?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform terpercaya untuk menemukan destinasi wisata terbaik di Indonesia dengan layanan terdepan
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="mb-6">
                <div className="w-20 h-20 bg-nature-50 rounded-full flex items-center justify-center mx-auto">
                  <i className="fa-solid fa-mountain-sun text-nature-500 text-2xl"></i>
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Destinasi Terpilih</h4>
              <p className="text-gray-600 leading-relaxed">
                Kumpulan destinasi wisata terbaik yang telah dikurasi khusus oleh para ahli untuk pengalaman terbaik Anda.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="mb-6">
                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto">
                  <i className="fa-solid fa-star text-yellow-500 text-2xl"></i>
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Ulasan Terpercaya</h4>
              <p className="text-gray-600 leading-relaxed">
                Dapatkan insight mendalam dari pengalaman nyata pengunjung lain untuk membantu perencanaan perjalanan Anda.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <i className="fa-solid fa-heart text-red-500 text-2xl"></i>
                </div>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Favorit Personal</h4>
              <p className="text-gray-600 leading-relaxed">
                Simpan destinasi favorit Anda dan buat rencana perjalanan yang sempurna sesuai dengan keinginan hati.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Popular Destinations Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
            <div className="lg:w-2/3">
              <div className="inline-block mb-4">
                <span className="bg-nature-50 text-nature-600 px-6 py-3 rounded-full text-lg font-medium">
                  Trending Sekarang
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Destinasi Populer</h2>
              <p className="text-xl text-gray-600">
                Jelajahi destinasi wisata yang paling diminati dan dapatkan inspirasi untuk petualangan Anda selanjutnya.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <Link to="/destinasi" className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-nature-500 hover:text-nature-600 border-2 border-nature-500 hover:border-nature-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl no-underline">
                <span>Lihat Semua</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nature-500 mb-4"></div>
              <p className="text-xl text-gray-600">Memuat destinasi populer...</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {destinasi.map((item, index) => (
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100" key={item.id_destinasi}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.url_gambar || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} 
                      className="w-full h-72 object-cover transition-transform duration-300 hover:scale-105" 
                      alt={item.nama_destinasi} 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-nature-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <i className="fa-solid fa-trophy"></i>
                        <span>#{index + 1} Populer</span>
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center text-white">
                        <i className="fa-solid fa-location-dot mr-2"></i>
                        <small className="font-medium">Indonesia</small>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h5 className="text-xl font-bold mb-3 text-gray-900">{item.nama_destinasi}</h5>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {item.deskripsi ? item.deskripsi.substring(0, 120) + '...' : 'Destinasi wisata yang menakjubkan dengan pemandangan indah dan pengalaman tak terlupakan yang akan selalu dikenang.'}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="fa-solid fa-star text-yellow-500 text-sm"></i>
                          ))}
                        </div>
                        <small className="text-gray-500 font-medium">(4.8)</small>
                      </div>
                      <Link 
                        to={`/destinasi/${item.id_destinasi}`} 
                        className="bg-nature-500 hover:bg-nature-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-1 no-underline"
                      >
                        <span>Lihat Detail</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-nature-500 to-nature-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-white">
            <div className="lg:w-2/3">
              <div className="mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-medium flex items-center space-x-2 inline-flex">
                  <i className="fa-solid fa-rocket text-yellow-400"></i>
                  <span>Bergabung Sekarang</span>
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Siap untuk Petualangan Berikutnya?</h2>
              <p className="text-xl opacity-90">
                Bergabunglah dengan ribuan traveler lainnya dan mulai jelajahi keindahan Indonesia hari ini juga!
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <Link to="/register" className="inline-flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 no-underline">
                <i className="fa-solid fa-user-plus"></i>
                <span>Daftar Sekarang</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;