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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        {/* Mountain ranges */}
        <div className="absolute bottom-0 left-0 w-full h-32">
          <svg viewBox="0 0 1200 200" className="w-full h-full fill-blue-300/40">
            <path d="M0,200 L0,120 L300,40 L600,80 L900,20 L1200,100 L1200,200 Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24">
          <svg viewBox="0 0 1200 150" className="w-full h-full fill-blue-400/50">
            <path d="M0,150 L0,100 L200,60 L500,90 L800,30 L1000,70 L1200,50 L1200,150 Z" />
          </svg>
        </div>
        {/* Clouds */}
        <div className="absolute top-10 right-20 w-24 h-12 bg-white/40 rounded-full"></div>
        <div className="absolute top-16 right-40 w-16 h-8 bg-white/30 rounded-full"></div>
        <div className="absolute top-8 left-1/4 w-32 h-16 bg-white/20 rounded-full"></div>
        <div className="absolute top-20 left-1/2 w-20 h-10 bg-white/35 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9l-5.91.74L12 16l-4.09-6.26L2 9l6.91-.74L12 2zm0 4.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                  {id ? '🏔️ Edit Destinasi Wisata' : '🏔️ Tambah Destinasi Wisata'}
                </h2>
                <p className="text-blue-100 mt-1">Kelola destinasi wisata yang menakjubkan</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Destinasi */}
                <div className="md:col-span-2">
                  <label htmlFor="nama_destinasi" className="block text-sm font-semibold text-gray-700 mb-2">
                    🏞️ Nama Destinasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama_destinasi"
                    name="nama_destinasi"
                    value={form.nama_destinasi}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Masukkan nama destinasi wisata"
                    required
                  />
                </div>

                {/* Lokasi */}
                <div>
                  <label htmlFor="lokasi" className="block text-sm font-semibold text-gray-700 mb-2">
                    📍 Lokasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lokasi"
                    name="lokasi"
                    value={form.lokasi}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Contoh: Bandung, Jawa Barat"
                    required
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label htmlFor="id_kategori" className="block text-sm font-semibold text-gray-700 mb-2">
                    🏷️ Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="id_kategori"
                    name="id_kategori"
                    value={form.id_kategori}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
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
                  <label htmlFor="jam_buka" className="block text-sm font-semibold text-gray-700 mb-2">
                    🕐 Jam Buka
                  </label>
                  <input
                    type="text"
                    id="jam_buka"
                    name="jam_buka"
                    value={form.jam_buka}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Contoh: 08:00 - 17:00"
                  />
                </div>

                {/* Harga Tiket */}
                <div>
                  <label htmlFor="harga_tiket" className="block text-sm font-semibold text-gray-700 mb-2">
                    💰 Harga Tiket
                  </label>
                  <input
                    type="text"
                    id="harga_tiket"
                    name="harga_tiket"
                    value={form.harga_tiket}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Contoh: Rp 25.000"
                  />
                </div>

                {/* URL Gambar */}
                <div className="md:col-span-2">
                  <label htmlFor="url_gambar" className="block text-sm font-semibold text-gray-700 mb-2">
                    🖼️ URL Gambar
                  </label>
                  <input
                    type="url"
                    id="url_gambar"
                    name="url_gambar"
                    value={form.url_gambar}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="https://example.com/gambar.jpg"
                  />
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-2">
                  <label htmlFor="deskripsi" className="block text-sm font-semibold text-gray-700 mb-2">
                    📝 Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Deskripsikan keindahan dan daya tarik destinasi wisata ini..."
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-blue-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  ❌ Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 hover:from-sky-600 hover:via-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    <span>✅ {id ? 'Perbarui' : 'Simpan'} Destinasi</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinasiForm;