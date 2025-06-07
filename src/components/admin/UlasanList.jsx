import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UlasanList = () => {
  const [ulasan, setUlasan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  // Fetch data ulasan
  const fetchUlasan = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/ulasan');
      setUlasan(response.data);
    } catch (error) {
      console.error('Error fetching ulasan:', error);
      setMessage({ text: 'Gagal memuat data ulasan', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Hapus ulasan
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setMessage({ text: 'Anda harus login untuk melakukan aksi ini', type: 'error' });
          return;
        }
        
        const user = JSON.parse(storedUser);
        const token = user.token;
        
        await axios.delete(`http://localhost:5000/api/ulasan/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setMessage({ text: 'Ulasan berhasil dihapus', type: 'success' });
        fetchUlasan();
      } catch (error) {
        console.error('Error deleting ulasan:', error);
        setMessage({ text: 'Gagal menghapus ulasan', type: 'error' });
      }
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Render rating stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    fetchUlasan();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-200 border-t-nature-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Ulasan</h1>
            <p className="text-gray-600">Manajemen ulasan dan review destinasi</p>
          </div>
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
        {ulasan.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mb-4">
              <i className="fa-solid fa-star text-nature-500 text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada ulasan</h3>
            <p className="text-gray-600 mb-6">
              Belum ada ulasan dari pengguna untuk destinasi wisata.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-nature-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Pengguna</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Destinasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Komentar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ulasan.map((item) => (
                    <tr key={item.id_ulasan} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">#{item.id_ulasan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.pengguna?.nama || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.id_pengguna}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.destinasi?.nama_destinasi || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.id_destinasi}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {renderStars(item.penilaian)}
                          </div>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                            {item.penilaian}/5
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          <div 
                            className="truncate" 
                            title={item.komentar}
                          >
                            {item.komentar || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(item.tanggal_ulasan)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleDelete(item.id_ulasan)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            title="Hapus ulasan"
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
                Total: {ulasan.length} ulasan
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

export default UlasanList;