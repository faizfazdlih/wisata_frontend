import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const KategoriForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    nama_kategori: '',
    deskripsi: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchKategori();
    }
  }, [isEdit, id]);

  const fetchKategori = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/kategori/${id}`);
      setFormData({
        nama_kategori: response.data.nama_kategori || '',
        deskripsi: response.data.deskripsi || ''
      });
    } catch (error) {
      console.error('Error fetching kategori:', error);
      setError('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nama_kategori.trim()) {
      setError('Nama kategori harus diisi');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('Anda harus login untuk melakukan aksi ini');
        return;
      }
      
      const user = JSON.parse(storedUser);
      const token = user.token;
      
      if (isEdit) {
        await axios.patch(`http://localhost:5000/api/kategori/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSuccess('Kategori berhasil diperbarui');
      } else {
        await axios.post('http://localhost:5000/api/kategori', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSuccess('Kategori berhasil ditambahkan');
      }
      
      // Redirect setelah 1.5 detik
      setTimeout(() => {
        navigate('/admin/kategori');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving kategori:', error);
      setError(error.response?.data?.message || 'Gagal menyimpan kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (isEdit) {
      fetchKategori();
    } else {
      setFormData({
        nama_kategori: '',
        deskripsi: ''
      });
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
          </h1>
          <Link 
            to="/admin/kategori" 
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-300"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Kembali
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border-l-4 border-red-500">
                <div className="flex items-center">
                  <i className="fa-solid fa-circle-exclamation text-red-500 mr-2"></i>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-800 border-l-4 border-green-500">
                <div className="flex items-center">
                  <i className="fa-solid fa-check-circle text-green-500 mr-2"></i>
                  <span>{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nama_kategori" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nama_kategori"
                  name="nama_kategori"
                  value={formData.nama_kategori}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
                  placeholder="Masukkan nama kategori"
                  required
                />
              </div>

              <div>
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
                  placeholder="Masukkan deskripsi kategori (opsional)"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center min-w-[120px]"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEdit ? 'Memperbarui...' : 'Menyimpan...'}
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-save mr-2"></i>
                        {isEdit ? 'Perbarui' : 'Simpan'}
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center"
                  >
                    <i className="fa-solid fa-rotate mr-2"></i>
                    Reset
                  </button>
                </div>
                
                <Link
                  to="/admin/kategori"
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center"
                >
                  <i className="fa-solid fa-times mr-2"></i>
                  Batal
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KategoriForm;