import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const KategoriList = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/kategori');
      setKategori(response.data);
    } catch (error) {
      console.error('Error fetching kategori:', error);
      setMessage({ text: 'Gagal memuat data kategori', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${nama}"?`)) {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setMessage({ text: 'Anda harus login untuk melakukan aksi ini', type: 'error' });
          return;
        }
        
        const user = JSON.parse(storedUser);
        const token = user.token;
        
        await axios.delete(`http://localhost:5000/api/kategori/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setMessage({ text: 'Kategori berhasil dihapus', type: 'success' });
        fetchKategori();
      } catch (error) {
        console.error('Error deleting kategori:', error);
        setMessage({ text: 'Gagal menghapus kategori', type: 'error' });
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Kategori</h1>
            <p className="text-gray-600">Manajemen kategori destinasi wisata</p>
          </div>
          <Link 
          to="/admin/kategori/tambah" 
          className="no-underline mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105"
        >
            <i className="fa-solid fa-plus mr-2"></i>
            Tambah Kategori
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
        {kategori.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mb-4">
              <i className="fa-solid fa-tags text-nature-500 text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada kategori</h3>
            <p className="text-gray-600 mb-6">
              Mulai dengan menambahkan kategori untuk destinasi wisata Anda.
            </p>
            <Link 
              to="/admin/kategori/tambah" 
              className="inline-flex items-center px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Tambah Kategori Pertama
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-nature-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Deskripsi</th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kategori.map((item, index) => (
                    <tr key={item.id_kategori} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{index + 1}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.nama_kategori}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{item.deskripsi || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Link 
                            to={`/admin/kategori/edit/${item.id_kategori}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Edit"
                          >
                            <i className="fa-solid fa-edit"></i>
                          </Link>
                          <button 
                            onClick={() => handleDelete(item.id_kategori, item.nama_kategori)}
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
                Total: {kategori.length} kategori
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

export default KategoriList;