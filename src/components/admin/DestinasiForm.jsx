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
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">{id ? 'Edit' : 'Tambah'} Destinasi</h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nama_destinasi" className="form-label">
                    Nama Destinasi <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="nama_destinasi"
                    name="nama_destinasi"
                    className="form-control"
                    value={form.nama_destinasi}
                    onChange={handleChange}
                    required
                    maxLength="150"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="deskripsi" className="form-label">
                    Deskripsi <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    className="form-control"
                    rows="4"
                    value={form.deskripsi}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="lokasi" className="form-label">
                    Lokasi <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="lokasi"
                    name="lokasi"
                    className="form-control"
                    value={form.lokasi}
                    onChange={handleChange}
                    required
                    maxLength="255"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="id_kategori" className="form-label">
                    Kategori <span className="text-danger">*</span>
                  </label>
                  <select
                    id="id_kategori"
                    name="id_kategori"
                    className="form-select"
                    value={form.id_kategori}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {kategori.map((k) => (
                      <option key={k.id_kategori} value={k.id_kategori}>
                        {k.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="url_gambar" className="form-label">URL Gambar</label>
                  <input
                    type="url"
                    id="url_gambar"
                    name="url_gambar"
                    className="form-control"
                    value={form.url_gambar}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    maxLength="255"
                  />
                  <div className="form-text">Masukkan URL gambar yang valid</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="jam_buka" className="form-label">Jam Buka</label>
                  <input
                    type="text"
                    id="jam_buka"
                    name="jam_buka"
                    className="form-control"
                    value={form.jam_buka}
                    onChange={handleChange}
                    placeholder="Contoh: 08:00 - 17:00"
                    maxLength="100"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="harga_tiket" className="form-label">Harga Tiket</label>
                  <input
                    type="text"
                    id="harga_tiket"
                    name="harga_tiket"
                    className="form-control"
                    value={form.harga_tiket}
                    onChange={handleChange}
                    placeholder="Contoh: Rp 25.000 atau Gratis"
                    maxLength="100"
                  />
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {id ? 'Memperbarui...' : 'Menyimpan...'}
                      </>
                    ) : (
                      id ? 'Update' : 'Simpan'
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinasiForm;