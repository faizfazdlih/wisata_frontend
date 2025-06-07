import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserFavorit = () => {
  const [favorit, setFavorit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      getFavorit();
    }
  }, [currentUser]);

  const getFavorit = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/favorit/pengguna/${currentUser.id_pengguna}`);
      setFavorit(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      // Fallback ke data dummy jika API belum diimplementasikan
      setFavorit([
        { 
          id_destinasi: 1, 
          nama_destinasi: 'Pantai Kuta', 
          deskripsi: 'Pantai Kuta adalah salah satu pantai terindah di Bali yang terkenal dengan pasir putihnya yang halus dan ombak yang sempurna untuk berselancar. Tempat ini menawarkan sunset yang menakjubkan dan berbagai aktivitas menarik.',
          url_gambar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          id_favorit: 1,
          kategori: { nama_kategori: 'Pantai' }
        },
        { 
          id_destinasi: 2, 
          nama_destinasi: 'Gunung Bromo', 
          deskripsi: 'Gunung Bromo merupakan gunung berapi aktif yang terletak di Jawa Timur. Pemandangan matahari terbit dari kawah Bromo sangat memukau dan menjadi daya tarik utama bagi para wisatawan dari seluruh dunia.',
          url_gambar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          id_favorit: 2,
          kategori: { nama_kategori: 'Gunung' }
        }
      ]);
      setLoading(false);
    }
  };

  const handleHapusFavorit = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorit/${id}`);
      getFavorit();
      setMessage({ text: 'Favorit berhasil dihapus', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan saat menghapus favorit', type: 'danger' });
      console.log(error);
    }
  };

  // Fungsi untuk mendapatkan URL gambar dengan fallback
  const getImageUrl = (item) => {
    // Cek berbagai kemungkinan properti gambar
    return item.url_gambar || 
           item.destinasi?.url_gambar || 
           item.gambar || 
           'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  };

  // Fungsi untuk mendapatkan nama destinasi
  const getNamaDestinasi = (item) => {
    return item.nama_destinasi || item.destinasi?.nama_destinasi || 'Destinasi Wisata';
  };

  // Fungsi untuk mendapatkan deskripsi destinasi
  const getDeskripsi = (item) => {
    const deskripsi = item.deskripsi || item.destinasi?.deskripsi;
    if (deskripsi) {
      return deskripsi.length > 120 ? deskripsi.substring(0, 120) + '...' : deskripsi;
    }
    return 'Destinasi wisata yang menakjubkan dengan pemandangan indah dan pengalaman tak terlupakan yang akan selalu dikenang.';
  };

  // Fungsi untuk mendapatkan nama kategori
  const getNamaKategori = (item) => {
    return item.kategori?.nama_kategori || item.destinasi?.kategori?.nama_kategori || null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-emerald-500 p-8">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-4 mr-6 shadow-lg">
                  <svg className="w-8 h-8 text-emerald-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-2">Favorit Saya</h1>
                  <p className="text-emerald-100 text-lg">Lihat dan kelola destinasi favorit Anda</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl shadow-md border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-700' 
              : 'bg-red-50 border-red-500 text-red-700'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 text-emerald-500 fill-current mr-3" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Destinasi Favorit Saya
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                <p className="text-gray-600 text-lg">Memuat favorit...</p>
              </div>
            ) : favorit.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorit.map((item) => (
                  <div key={item.id_destinasi} className="group">
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
                      <div className="relative overflow-hidden">
                        <img 
                          src={getImageUrl(item)}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                          alt={getNamaDestinasi(item)}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <div className="bg-emerald-500 text-white px-2 py-1 rounded-full shadow-lg">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <small className="font-medium">Indonesia</small>
                            </div>
                            {getNamaKategori(item) && (
                              <span className="bg-emerald-500 px-3 py-1 rounded-full text-xs font-semibold">
                                {getNamaKategori(item)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                          {getNamaDestinasi(item)}
                        </h3>
                        
                        {/* Deskripsi destinasi */}
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                          {getDeskripsi(item)}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            ))}
                          </div>
                          <small className="text-gray-500 font-medium">(4.8)</small>
                        </div>
                        
                        <div className="flex gap-3">
                          <Link 
                            to={`/destinasi/${item.id_destinasi}`} 
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center no-underline transform hover:scale-105"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Lihat Detail
                          </Link>
                          <button 
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                            onClick={() => handleHapusFavorit(item.id_favorit)}
                            title="Hapus dari favorit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mb-6">
                  <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-3">Belum Ada Favorit</h3>
                <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                  Mulai jelajahi destinasi dan tambahkan ke favorit Anda!
                </p>
                <Link 
                  to="/destinasi" 
                  className="inline-flex items-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  Jelajahi Destinasi
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFavorit;