import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DestinasiDetail = () => {
  const [destinasi, setDestinasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ulasan, setUlasan] = useState([]);
  const [gambar, setGambar] = useState([]);
  const [isFavorit, setIsFavorit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newUlasan, setNewUlasan] = useState({
    penilaian: 5,
    komentar: ''
  });
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    getDestinasiById();
    getUlasan();
    getGambar();
    if (currentUser) {
      checkFavorit();
    }
  }, [id, currentUser]);

  const getDestinasiById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/destinasi/${id}`);
      setDestinasi(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getUlasan = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ulasan/destinasi/${id}`);
      setUlasan(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGambar = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/gambar/destinasi/${id}`);
      setGambar(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkFavorit = async () => {
    if (!currentUser) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/favorit/pengguna/${currentUser.id_pengguna}`);
      const favorit = response.data;
      const isFav = favorit.some(item => item.id_destinasi === parseInt(id));
      setIsFavorit(isFav);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUlasan({
      ...newUlasan,
      [name]: value
    });
  };

  const submitUlasan = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Silakan login terlebih dahulu untuk memberikan ulasan');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/ulasan', {
        id_destinasi: id,
        id_pengguna: currentUser.id_pengguna,
        penilaian: newUlasan.penilaian,
        komentar: newUlasan.komentar
      });
      
      alert('Ulasan berhasil ditambahkan');
      // Reset form
      setNewUlasan({
        penilaian: 5,
        komentar: ''
      });
      // Refresh ulasan
      getUlasan();
    } catch (error) {
      alert('Gagal menambahkan ulasan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFavorit = async () => {
    if (!currentUser) {
      alert('Silakan login terlebih dahulu untuk menambahkan ke favorit');
      return;
    }

    try {
      if (isFavorit) {
        // Cari ID favorit
        const response = await axios.get(`http://localhost:5000/api/favorit/pengguna/${currentUser.id_pengguna}`);
        const favorit = response.data;
        const favItem = favorit.find(item => item.id_destinasi === parseInt(id));
        
        if (favItem) {
          await axios.delete(`http://localhost:5000/api/favorit/${favItem.id_favorit}`);
          setIsFavorit(false);
          alert('Destinasi dihapus dari favorit');
        }
      } else {
        await axios.post('http://localhost:5000/api/favorit', {
          id_destinasi: id,
          id_pengguna: currentUser.id_pengguna
        });
        setIsFavorit(true);
        alert('Destinasi ditambahkan ke favorit');
      }
    } catch (error) {
      alert('Gagal: ' + (error.response?.data?.message || error.message));
    }
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-nature-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-nature-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Memuat destinasi...</p>
        </div>
      </div>
    );
  }

  if (!destinasi) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-nature-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Destinasi Tidak Ditemukan</h3>
          <p className="text-gray-600">Maaf, destinasi yang Anda cari tidak dapat ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-nature-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative">
              <img 
                src={destinasi.url_gambar || 'https://via.placeholder.com/600x400'} 
                className="w-full h-96 lg:h-full object-cover" 
                alt={destinasi.nama_destinasi} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Content Section */}
            <div className="p-8 lg:p-12">
              <div className="mb-4">
                <span className="inline-block bg-nature-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {destinasi.kategori ? destinasi.kategori.nama_kategori : 'Umum'}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{destinasi.nama_destinasi}</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{destinasi.deskripsi}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <svg className="w-6 h-6 text-nature-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Lokasi:</span>
                  <span className="ml-2">{destinasi.lokasi}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <svg className="w-6 h-6 text-nature-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Jam Buka:</span>
                  <span className="ml-2">{destinasi.jam_buka}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <svg className="w-6 h-6 text-nature-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="font-medium">Harga Tiket:</span>
                  <span className="ml-2 text-green-600 font-semibold">{destinasi.harga_tiket}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {currentUser ? (
                  <button 
                    className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isFavorit 
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                        : 'bg-white border-2 border-nature-500 text-nature-600 hover:bg-nature-600 shadow-lg'
                    }`}
                    onClick={handleFavorit}
                  >
                    <svg className="w-5 h-5 mr-2" fill={isFavorit ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isFavorit ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center px-6 py-3 bg-white border-2 border-nature-600 text-nature-600 hover:bg-nature-600 hover:text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Tambah ke Favorit
                  </Link>
                )}
                
                <button className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {gambar.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-8 h-8 text-nature-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Galeri Foto
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gambar.map((item, index) => (
                <div 
                  key={item.id_gambar}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setSelectedImage(item)}
                >
                  <img 
                    src={item.url_gambar} 
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300" 
                    alt={item.keterangan || destinasi.nama_destinasi} 
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
            <div className="max-w-4xl max-h-full bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold">{selectedImage.keterangan || destinasi.nama_destinasi}</h3>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <img 
                  src={selectedImage.url_gambar} 
                  className="w-full h-auto max-h-96 object-contain rounded-xl" 
                  alt={selectedImage.keterangan || destinasi.nama_destinasi} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-8 h-8 text-nature-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ulasan Pengunjung
          </h2>

          {ulasan.length > 0 ? (
            <div className="space-y-6">
              {ulasan.map((item) => (
                <div key={item.id_ulasan} className="bg-gray-50 rounded-2xl p-6 border-l-4 border-nature-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      <div className="w-10 h-10 bg-nature-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {(item.pengguna?.nama || 'Pengguna').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.pengguna?.nama || 'Pengguna'}</h4>
                        <p className="text-sm text-gray-500">{new Date(item.tanggal_ulasan).toLocaleDateString('id-ID', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    <StarRating rating={item.penilaian} />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item.komentar}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Ulasan</h3>
              <p className="text-gray-600">Jadilah yang pertama memberikan ulasan untuk destinasi ini!</p>
            </div>
          )}
        </div>

        {/* Review Form */}
        {currentUser ? (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-7 h-7 text-nature-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Tulis Ulasan Anda
            </h3>
            
            <form onSubmit={submitUlasan} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Berikan Penilaian</label>
                <select 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-nature-600 focus:ring-4 focus:ring-nature-100 transition-all duration-300" 
                  name="penilaian" 
                  value={newUlasan.penilaian}
                  onChange={handleInputChange}
                >
                  <option value="5">⭐⭐⭐⭐⭐ Sangat Bagus</option>
                  <option value="4">⭐⭐⭐⭐ Bagus</option>
                  <option value="3">⭐⭐⭐ Cukup</option>
                  <option value="2">⭐⭐ Kurang</option>
                  <option value="1">⭐ Sangat Kurang</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Ceritakan Pengalaman Anda</label>
                <textarea 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-nature-600 focus:ring-4 focus:ring-nature-100 transition-all duration-300 resize-none" 
                  name="komentar" 
                  rows="4" 
                  value={newUlasan.komentar}
                  onChange={handleInputChange}
                  placeholder="Bagikan pengalaman Anda mengunjungi destinasi ini..."
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-nature-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Kirim Ulasan
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-nature-50 to-purple-50 rounded-3xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-nature-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ingin Memberikan Ulasan?</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Bergabunglah dengan komunitas traveler dan bagikan pengalaman Anda untuk membantu orang lain menemukan destinasi terbaik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-nature-600 to-purple-600 hover:from-nature-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Masuk
                </Link>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-nature-600 text-nature-600 hover:bg-nature-600 hover:text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Daftar
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinasiDetail;