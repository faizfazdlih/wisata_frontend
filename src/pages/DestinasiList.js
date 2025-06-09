import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const DestinasiList = () => {
  const [destinasi, setDestinasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategori, setKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Mengambil parameter kategori dari URL
    const params = new URLSearchParams(location.search);
    const kategoriParam = params.get('kategori');
    
    if (kategoriParam) {
      setSelectedKategori(kategoriParam);
    }
    
    getDestinasi();
    getKategori();
  }, [location.search]);

  const getDestinasi = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/destinasi');
      
      // Ambil data ulasan untuk setiap destinasi
      const destinasiWithRatings = await Promise.all(response.data.map(async (item) => {
        try {
          const ulasanResponse = await axios.get(`http://localhost:5000/api/ulasan/destinasi/${item.id_destinasi}`);
          const ulasanData = ulasanResponse.data;
          
          // Hitung rating rata-rata
          let totalRating = 0;
          ulasanData.forEach(ulasan => {
            totalRating += ulasan.penilaian;
          });
          
          const ratingRataRata = ulasanData.length > 0 ? (totalRating / ulasanData.length).toFixed(1) : '0.0';
          
          return {
            ...item,
            rating_rata_rata: ratingRataRata,
            jumlah_ulasan: ulasanData.length
          };
        } catch (error) {
          console.log(`Error fetching reviews for destinasi ${item.id_destinasi}:`, error);
          return {
            ...item,
            rating_rata_rata: '0.0',
            jumlah_ulasan: 0
          };
        }
      }));
      
      setDestinasi(destinasiWithRatings);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getKategori = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kategori');
      setKategori(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredDestinasi = destinasi.filter(item => {
    return (
      (selectedKategori === '' || item.id_kategori.toString() === selectedKategori) &&
      item.nama_destinasi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
                <i className="fa-solid fa-compass text-yellow-400"></i>
                <span>Jelajahi Destinasi</span>
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Destinasi Wisata
              <span className="block text-nature-200">Indonesia</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
              Temukan destinasi wisata terbaik di seluruh Indonesia dengan filter kategori dan pencarian yang mudah
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white shadow-lg relative -mt-8 mx-4 sm:mx-6 lg:mx-8 rounded-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-search text-gray-400"></i>
              </div>
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-nature-500 focus:ring-2 focus:ring-nature-200 transition-all duration-300" 
                placeholder="Cari destinasi impian Anda..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-filter text-gray-400"></i>
              </div>
              <select 
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-nature-500 focus:ring-2 focus:ring-nature-200 transition-all duration-300 bg-white appearance-none" 
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {kategori.map((item) => (
                  <option key={item.id_kategori} value={item.id_kategori.toString()}>
                    {item.nama_kategori}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
          
          {/* Filter Summary */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-gray-600 font-medium">
              Menampilkan {filteredDestinasi.length} dari {destinasi.length} destinasi
            </span>
            {selectedKategori && (
              <span className="bg-nature-100 text-nature-700 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                <span>Kategori: {kategori.find(k => k.id_kategori.toString() === selectedKategori)?.nama_kategori}</span>
                <button 
                  onClick={() => setSelectedKategori('')}
                  className="hover:text-nature-900 transition-colors"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                <span>Pencarian: "{searchTerm}"</span>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="hover:text-blue-900 transition-colors"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Destinasi Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-nature-500 mb-6"></div>
              <p className="text-2xl text-gray-600 font-medium">Memuat destinasi wisata...</p>
              <p className="text-gray-500 mt-2">Tunggu sebentar, kami sedang menyiapkan destinasi terbaik untuk Anda</p>
            </div>
          ) : (
            <>
              {filteredDestinasi.length > 0 ? (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                  {filteredDestinasi.map((item, index) => (
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100 group" key={item.id_destinasi}>
                      <div className="relative overflow-hidden">
                        <img 
                          src={item.url_gambar || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} 
                          className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105" 
                          alt={item.nama_destinasi} 
                        />
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <i className="fa-solid fa-heart text-red-500 text-lg"></i>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center">
                              <i className="fa-solid fa-location-dot mr-2"></i>
                              <small className="font-medium">Indonesia</small>
                            </div>
                            {item.kategori && (
                              <span className="bg-nature-500 px-3 py-1 rounded-full text-xs font-semibold">
                                {item.kategori.nama_kategori}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h5 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-nature-600 transition-colors">
                          {item.nama_destinasi}
                        </h5>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {item.deskripsi ? item.deskripsi.substring(0, 120) + '...' : 'Destinasi wisata yang menakjubkan dengan pemandangan indah dan pengalaman tak terlupakan yang akan selalu dikenang.'}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa-${i < Math.floor(item.rating_rata_rata || 0) ? 'solid' : 'regular'} fa-star text-yellow-500 text-sm`}></i>
                              ))}
                            </div>
                            <small className="text-gray-500 font-medium">({item.rating_rata_rata || '0.0'})</small>
                          </div>
                          <Link 
                            to={`/destinasi/${item.id_destinasi}`} 
                            className="bg-nature-500 hover:bg-nature-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-2 no-underline transform hover:scale-105"
                          >
                            <span>Lihat Detail</span>
                            <i className="fa-solid fa-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="mb-8">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fa-solid fa-search text-gray-400 text-4xl"></i>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-gray-900">Tidak Ada Destinasi Ditemukan</h3>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                      Maaf, tidak ada destinasi yang sesuai dengan kriteria pencarian Anda. 
                      Coba ubah kata kunci atau filter kategori.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedKategori('');
                        }}
                        className="bg-nature-500 hover:bg-nature-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-refresh"></i>
                        <span>Reset Filter</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Belum Menemukan Destinasi Impian?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Jelajahi lebih banyak destinasi wisata menarik di Indonesia atau hubungi kami untuk rekomendasi personal
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/kategori" 
                className="bg-white hover:bg-gray-100 text-nature-500 hover:text-nature-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 no-underline"
              >
                <i className="fa-solid fa-list"></i>
                <span>Lihat Semua Kategori</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DestinasiList;