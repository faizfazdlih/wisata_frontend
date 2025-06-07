import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DestinasiList = () => {
  const [destinasi, setDestinasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDestinasi();
  }, []);

  const fetchDestinasi = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/destinasi');
      console.log('Data destinasi:', res.data);
      setDestinasi(res.data);
    } catch (err) {
      console.error('Error fetch destinasi:', err);
      setError('Gagal memuat data destinasi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus destinasi "${nama}"?`)) {
      try {
        const user = localStorage.getItem('user');
        let token = null;
        
        if (user) {
          const userData = JSON.parse(user);
          token = userData.token;
        } else {
          token = localStorage.getItem('token');
        }

        if (!token) {
          alert('Anda harus login untuk melakukan aksi ini');
          return;
        }

        await axios.delete(`http://localhost:5000/api/destinasi/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        alert('Destinasi berhasil dihapus');
        fetchDestinasi();
      } catch (err) {
        console.error('Error delete destinasi:', err);
        if (err.response?.status === 403) {
          alert('Akses ditolak. Pastikan Anda login sebagai admin.');
        } else {
          alert('Gagal menghapus destinasi');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex justify-center items-center relative overflow-hidden">
        {/* Mountain Background */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-green-200 via-green-300 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-blue-300 via-green-400 to-blue-300 opacity-20 transform skew-y-1"></div>
        
        {/* Clouds */}
        <div className="absolute top-20 left-10 w-20 h-12 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-8 bg-white rounded-full opacity-50 animate-pulse"></div>
        
        <div className="text-center z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-200 border-t-sky-600 mx-auto mb-4"></div>
          <p className="text-sky-800 text-lg font-medium">Memuat data destinasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Mountain Background */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-green-200 via-green-300 to-transparent opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-blue-300 via-green-400 to-blue-300 opacity-20 transform skew-y-1"></div>
      
      {/* Clouds */}
      <div className="absolute top-20 left-10 w-20 h-12 bg-white rounded-full opacity-60 animate-float"></div>
      <div className="absolute top-32 right-20 w-16 h-8 bg-white rounded-full opacity-50 animate-float-delayed"></div>
      <div className="absolute top-16 right-1/3 w-24 h-10 bg-white rounded-full opacity-40 animate-float"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text text-transparent mb-2">Kelola Destinasi</h1>
            <p className="text-sky-700">Manajemen destinasi wisata lokal</p>
          </div>
          <Link 
            to="/admin/destinasi/tambah" 
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 no-underline group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tambah Destinasi
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Content */}
        {destinasi.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-sky-800 mb-2">Belum ada destinasi</h3>
            <p className="text-sky-700 mb-8 max-w-md mx-auto">
              Mulai dengan menambahkan destinasi wisata pertama untuk menarik pengunjung.
            </p>
            <Link 
              to="/admin/destinasi/tambah" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 no-underline group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Tambah Destinasi Pertama
            </Link>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-sky-700 to-blue-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">No</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Nama Destinasi</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Lokasi</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Harga Tiket</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Jam Buka</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-sky-200">
                  {destinasi.map((item, index) => (
                    <tr key={item.id_destinasi} className="hover:bg-sky-50/80 transition-all duration-300 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full text-sky-700 font-bold text-sm group-hover:from-sky-200 group-hover:to-blue-200 transition-all duration-300">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          {item.url_gambar && (
                            <img 
                              src={item.url_gambar} 
                              alt={item.nama_destinasi}
                              className="w-16 h-16 rounded-lg object-cover border-2 border-sky-200 shadow-md group-hover:shadow-lg transition-all duration-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <div className="font-bold text-sky-800 text-lg group-hover:text-sky-900 transition-colors duration-300">
                              {item.nama_destinasi}
                            </div>
                            <div className="text-sky-600 text-sm line-clamp-2">
                              {item.deskripsi}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-800 border border-cyan-200">
                          {item.kategori?.nama_kategori || 'Tidak ada kategori'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sky-700">
                          <svg className="w-4 h-4 mr-1 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {item.lokasi}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sky-800 font-semibold">
                          {item.harga_tiket ? `Rp ${parseInt(item.harga_tiket).toLocaleString('id-ID')}` : 'Gratis'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sky-700">
                          <svg className="w-4 h-4 mr-1 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {item.jam_buka || 'Tidak tersedia'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            to={`/admin/destinasi/edit/${item.id_destinasi}`}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg no-underline"
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id_destinasi, item.nama_destinasi)}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-xs font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clipRule="evenodd" />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DestinasiList;