import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PenggunaList = () => {
  const [pengguna, setPengguna] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPengguna();
  }, []);

  // Fetch data pengguna
  const fetchPengguna = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setMessage({ text: 'Token tidak ditemukan', type: 'error' });
        return;
      }
      
      const user = JSON.parse(storedUser);
      const token = user.token;
      
      const response = await axios.get('http://localhost:5000/api/pengguna', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPengguna(response.data);
    } catch (error) {
      console.error('Error fetching pengguna:', error);
      setMessage({ text: 'Gagal memuat data pengguna', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Hapus pengguna
  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${nama}"?`)) {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setMessage({ text: 'Anda harus login untuk melakukan aksi ini', type: 'error' });
          return;
        }
        
        const user = JSON.parse(storedUser);
        const token = user.token;
        
        await axios.delete(`http://localhost:5000/api/pengguna/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setMessage({ text: 'Pengguna berhasil dihapus', type: 'success' });
        fetchPengguna();
      } catch (error) {
        console.error('Error deleting pengguna:', error);
        setMessage({ text: 'Gagal menghapus pengguna', type: 'error' });
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

  // Get badge class untuk peran
  const getBadgeClass = (peran) => {
    return peran === 'admin' 
      ? 'bg-red-100 text-red-800 border border-red-200' 
      : 'bg-blue-100 text-blue-800 border border-blue-200';
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Pengguna</h1>
            <p className="text-gray-600">Manajemen pengguna sistem</p>
          </div>
          <Link 
            to="/admin/pengguna/tambah" 
            className="no-underline mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Tambah Pengguna
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
        {pengguna.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mb-4">
              <i className="fa-solid fa-users text-nature-500 text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada pengguna</h3>
            <p className="text-gray-600 mb-6">
              Mulai dengan menambahkan pengguna untuk mengakses sistem.
            </p>
            <Link 
              to="/admin/pengguna/tambah" 
              className="inline-flex items-center px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Tambah Pengguna Pertama
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-nature-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Peran</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tanggal Dibuat</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pengguna.map((item) => (
                    <tr key={item.id_pengguna} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">#{item.id_pengguna}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{item.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeClass(item.peran)}`}>
                          {item.peran.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(item.tanggal_dibuat)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Link 
                            to={`/admin/pengguna/edit/${item.id_pengguna}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Edit"
                          >
                            <i className="fa-solid fa-edit"></i>
                          </Link>
                          <button 
                            onClick={() => handleDelete(item.id_pengguna, item.nama)}
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
                Total: {pengguna.length} pengguna
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

export default PenggunaList;