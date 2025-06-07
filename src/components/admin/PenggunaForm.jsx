import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PenggunaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    kata_sandi: '',
    konfirmasi_kata_sandi: '',
    peran: 'pengguna'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch data pengguna untuk edit
  const fetchPengguna = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('Token tidak ditemukan');
        return;
      }
      
      const user = JSON.parse(storedUser);
      const token = user.token;
      
      const response = await axios.get(`http://localhost:5000/api/pengguna/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = response.data;
      setFormData({
        nama: data.nama || '',
        email: data.email || '',
        kata_sandi: '',
        konfirmasi_kata_sandi: '',
        peran: data.peran || 'pengguna'
      });
    } catch (error) {
      setError('Gagal memuat data pengguna');
      console.error('Error fetching pengguna:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Validate form
  const validateForm = () => {
    if (!formData.nama.trim()) {
      setError('Nama harus diisi');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email harus diisi');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid');
      return false;
    }
    
    // Password validation untuk tambah atau jika diisi saat edit
    if (!isEdit || formData.kata_sandi) {
      if (!formData.kata_sandi) {
        setError('Kata sandi harus diisi');
        return false;
      }
      
      if (formData.kata_sandi.length < 6) {
        setError('Kata sandi minimal 6 karakter');
        return false;
      }
      
      if (formData.kata_sandi !== formData.konfirmasi_kata_sandi) {
        setError('Kata sandi dan konfirmasi kata sandi tidak cocok');
        return false;
      }
    }
    
    return true;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('Token tidak ditemukan');
        return;
      }
      
      const user = JSON.parse(storedUser);
      const token = user.token;
      
      const submitData = { ...formData };
      
      // Hapus konfirmasi_kata_sandi dari data yang dikirim
      delete submitData.konfirmasi_kata_sandi;
      
      // Jika edit dan kata sandi kosong, hapus kata_sandi dari data
      if (isEdit && !submitData.kata_sandi) {
        delete submitData.kata_sandi;
      }
      
      if (isEdit) {
        // Update pengguna
        await axios.patch(`http://localhost:5000/api/pengguna/${id}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setSuccess('Pengguna berhasil diperbarui');
      } else {
        // Tambah pengguna baru
        await axios.post('http://localhost:5000/api/register', submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setSuccess('Pengguna berhasil ditambahkan');
      }
      
      // Redirect setelah 2 detik
      setTimeout(() => {
        navigate('/admin/pengguna');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving pengguna:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(isEdit ? 'Gagal memperbarui pengguna' : 'Gagal menambahkan pengguna');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchPengguna();
    }
  }, [id, isEdit]);

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-200 border-t-nature-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Perbarui informasi pengguna' : 'Tambahkan pengguna baru ke sistem'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/pengguna')}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-300"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Kembali
          </button>
        </div>

        {/* Message Alerts */}
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

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-nature-500 text-white px-6 py-4">
            <div className="flex items-center">
              <i className="fa-solid fa-user-plus text-xl mr-3"></i>
              <h2 className="text-lg font-semibold">
                {isEdit ? 'Form Edit Pengguna' : 'Form Tambah Pengguna'}
              </h2>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Field */}
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan alamat email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
                  required
                />
              </div>

              {/* Peran Field */}
              <div>
                <label htmlFor="peran" className="block text-sm font-medium text-gray-700 mb-2">
                  Peran <span className="text-red-500">*</span>
                </label>
                <select
                  id="peran"
                  name="peran"
                  value={formData.peran}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
                  required
                >
                  <option value="pengguna">Pengguna</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="kata_sandi" className="block text-sm font-medium text-gray-700 mb-2">
                    Kata Sandi {!isEdit && <span className="text-red-500">*</span>}
                    {isEdit && <span className="text-sm text-gray-500 block">(Kosongkan jika tidak ingin mengubah)</span>}
                  </label>
                  <input
                    type="password"
                    id="kata_sandi"
                    name="kata_sandi"
                    value={formData.kata_sandi}
                    onChange={handleChange}
                    placeholder="Masukkan kata sandi"
                    minLength="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="konfirmasi_kata_sandi" className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Kata Sandi {!isEdit && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    id="konfirmasi_kata_sandi"
                    name="konfirmasi_kata_sandi"
                    value={formData.konfirmasi_kata_sandi}
                    onChange={handleChange}
                    placeholder="Konfirmasi kata sandi"
                    minLength="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin/pengguna')}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-300 disabled:opacity-50"
                >
                  <i className="fa-solid fa-times mr-2"></i>
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                      {isEdit ? 'Memperbarui...' : 'Menyimpan...'}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-save mr-2"></i>
                      {isEdit ? 'Perbarui Pengguna' : 'Simpan Pengguna'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Back to Dashboard Button */}
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

export default PenggunaForm;