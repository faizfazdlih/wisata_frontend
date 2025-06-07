import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DestinasiList = () => {
  const [destinasi, setDestinasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

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
      setMessage({ text: 'Gagal memuat data destinasi', type: 'error' });
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
          setMessage({ text: 'Anda harus login untuk melakukan aksi ini', type: 'error' });
          return;
        }

        await axios.delete(`http://localhost:5000/api/destinasi/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setMessage({ text: 'Destinasi berhasil dihapus', type: 'success' });
        fetchDestinasi();
      } catch (err) {
        console.error('Error delete destinasi:', err);
        if (err.response?.status === 403) {
          setMessage({ text: 'Akses ditolak. Pastikan Anda login sebagai admin.', type: 'error' });
        } else {
          setMessage({ text: 'Gagal menghapus destinasi', type: 'error' });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-200 border-t-nature-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Destinasi</h1>
            <p className="text-gray-600">Manajemen destinasi wisata lokal</p>
          </div>
          <Link 
            to="/admin/destinasi/tambah" 
            className="no-underline mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Tambah Destinasi
          </Link>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 'bg-green-50 text-green-800 border-l-4 border-green-500'}`}>
            <div className="flex items-center">
              <i className={`mr-2 ${message.type === 'error' ? 'fa-solid fa-circle-exclamation text-red-500' : 'fa-solid fa-check-circle text-green-500'}`}></i>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Content */}
        {destinasi.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mb-4">
              <i className="fa-solid fa-map-location-dot text-nature-500 text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada destinasi</h3>
            <p className="text-gray-600 mb-6">
              Mulai dengan menambahkan destinasi wisata pertama untuk menarik pengunjung.
            </p>
            <Link 
              to="/admin/destinasi/tambah" 
              className="inline-flex items-center px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Tambah Destinasi Pertama
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-nature-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama Destinasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Lokasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Harga Tiket</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Jam Buka</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {destinasi.map((item, index) => (
                    <tr key={item.id_destinasi} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{index + 1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {item.url_gambar && (
                            <img 
                              src={item.url_gambar} 
                              alt={item.nama_destinasi}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.nama_destinasi}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {item.deskripsi}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.kategori?.nama_kategori || 'Tidak ada kategori'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <i className="fa-solid fa-location-dot mr-1 text-gray-400"></i>
                          {item.lokasi}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.harga_tiket ? `Rp ${parseInt(item.harga_tiket).toLocaleString('id-ID')}` : 'Gratis'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <i className="fa-solid fa-clock mr-1 text-gray-400"></i>
                          {item.jam_buka || 'Tidak tersedia'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            to={`/admin/destinasi/edit/${item.id_destinasi}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Edit"
                          >
                            <i className="fa-solid fa-edit"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id_destinasi, item.nama_destinasi)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            title="Hapus"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Total: {destinasi.length} destinasi
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-300"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinasiList;