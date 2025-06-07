import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DestinasiForm = () => {
  const [form, setForm] = useState({
    nama_destinasi: '',
    deskripsi: '',
    lokasi: '',
    url_gambar: '',
    jam_buka: '',
    harga_tiket: '',
    id_kategori: ''
  });

  const [kategori, setKategori] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Ambil token dari localStorage (sesuai dengan AuthContext)
  const getToken = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token;
    }
    return localStorage.getItem('token'); // fallback
  };

  useEffect(() => {
    fetchKategori();
    if (id) fetchDestinasiById();
  }, [id]);

  // Fetch list kategori
  const fetchKategori = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/kategori');
      setKategori(res.data);
    } catch (err) {
      console.error('Gagal fetch kategori:', err);
      setError('Gagal memuat data kategori.');
    }
  };

  // Fetch data destinasi berdasarkan id (untuk edit)
  const fetchDestinasiById = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/destinasi/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error('Gagal fetch destinasi:', err);
      setError('Gagal memuat data destinasi.');
    }
  };

  // Handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit form create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const token = getToken();
      if (!token) {
        setError('Anda harus login untuk melakukan aksi ini.');
        setLoading(false);
        return;
      }

      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Validasi form
      if (!form.nama_destinasi || !form.deskripsi || !form.lokasi || !form.id_kategori) {
        setError('Mohon lengkapi semua field yang wajib diisi.');
        setLoading(false);
        return;
      }

      // Convert id_kategori to number
      const formData = {
        ...form,
        id_kategori: parseInt(form.id_kategori),
        // Ensure numeric fields are properly formatted
        harga_tiket: form.harga_tiket || '0'
      };

      if (id) {
        // Update destinasi
        await axios.put(`http://localhost:5000/api/destinasi/${id}`, formData, config);
        alert('Destinasi berhasil diperbarui!');
      } else {
        // Create destinasi baru
        await axios.post('http://localhost:5000/api/destinasi', formData, config);
        alert('Destinasi berhasil ditambahkan!');
      }
      
      navigate('/admin/destinasi');
    } catch (err) {
      console.error('Error simpan destinasi:', err);
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Sesi Anda telah berakhir. Silakan login ulang.');
            break;
          case 403:
            setError('Akses ditolak. Pastikan Anda login sebagai admin.');
            break;
          case 400:
            setError(err.response.data.message || 'Data yang dimasukkan tidak valid.');
            break;
          default:
            setError('Gagal menyimpan destinasi. Silakan coba lagi.');
        }
      } else {
        setError('Terjadi kesalahan koneksi. Pastikan server berjalan.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/destinasi');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {id ? 'Edit Destinasi' : 'Tambah Destinasi'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Perbarui informasi destinasi wisata' : 'Tambahkan destinasi wisata baru'}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-300"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Kembali
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border-l-4 border-red-500">
            <div className="flex items-center">
              <i className="fa-solid fa-circle-exclamation text-red-500 mr-2"></i>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-nature-500 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <i className="fa-solid fa-map-location-dot text-white text-lg"></i>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Informasi Destinasi
                </h2>
                <p className="text-nature-100 text-sm">
                  Lengkapi data destinasi wisata
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Destinasi */}
              <div className="md:col-span-2">
                <label htmlFor="nama_destinasi" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Destinasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nama_destinasi"
                  name="nama_destinasi"
                  value={form.nama_destinasi}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan nama destinasi wisata"
                  required
                />
              </div>

              {/* Lokasi */}
              <div>
                <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lokasi"
                  name="lokasi"
                  value={form.lokasi}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all duration-200"
                  placeholder="Contoh: Bandung, Jawa Barat"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label htmlFor="id_kategori" className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="id_kategori"
                  name="id_kategori"
                  value={form.id_kategori}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {kategori.map(kat => (
                    <option key={kat.id_kategori} value={kat.id_kategori}>
                      {kat.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jam Buka */}
              <div>
                <label htmlFor="jam_buka" className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Buka
                </label>
                <input
                  type="text"
                  id="jam_buka"
                  name="jam_buka"
                  value={form.jam_buka}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all duration-200"
                  placeholder="Contoh: 08:00 - 17:00"
                />
              </div>

              {/* Harga Tiket */}
              <div>
                <label htmlFor="harga_tiket" className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Tiket
                </label>
                <input
                  type="text"
                  id="harga_tiket"
                  name="harga_tiket"
                  value={form.harga_tiket}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all duration-200"
                  placeholder="Contoh: 25000"
                />
              </div>

              {/* URL Gambar */}
              <div className="md:col-span-2">
                <label htmlFor="url_gambar" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Gambar
                </label>
                <input
                  type="url"
                  id="url_gambar"
                  name="url_gambar"
                  value={form.url_gambar}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com/gambar.jpg"
                />
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-2">
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Deskripsikan keindahan dan daya tarik destinasi wisata ini..."
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200"
              >
                <i className="fa-solid fa-times mr-2"></i>
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <>
                    <i className={`mr-2 ${id ? 'fa-solid fa-save' : 'fa-solid fa-plus'}`}></i>
                    {id ? 'Perbarui' : 'Simpan'} Destinasi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DestinasiForm;