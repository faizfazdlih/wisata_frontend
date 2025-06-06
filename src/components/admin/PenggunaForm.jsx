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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin/pengguna')}
            >
              <i className="fas fa-arrow-left"></i> Kembali
            </button>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="alert alert-success" role="alert">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="nama" className="form-label">
                        Nama <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nama"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Masukkan alamat email"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="peran" className="form-label">
                        Peran <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="peran"
                        name="peran"
                        value={formData.peran}
                        onChange={handleChange}
                        required
                      >
                        <option value="pengguna">Pengguna</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="kata_sandi" className="form-label">
                        Kata Sandi {!isEdit && <span className="text-danger">*</span>}
                        {isEdit && <small className="text-muted"> (Kosongkan jika tidak ingin mengubah)</small>}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="kata_sandi"
                        name="kata_sandi"
                        value={formData.kata_sandi}
                        onChange={handleChange}
                        placeholder="Masukkan kata sandi"
                        minLength="6"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="konfirmasi_kata_sandi" className="form-label">
                        Konfirmasi Kata Sandi {!isEdit && <span className="text-danger">*</span>}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="konfirmasi_kata_sandi"
                        name="konfirmasi_kata_sandi"
                        value={formData.konfirmasi_kata_sandi}
                        onChange={handleChange}
                        placeholder="Konfirmasi kata sandi"
                        minLength="6"
                      />
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-md-2"
                        onClick={() => navigate('/admin/pengguna')}
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            {isEdit ? 'Memperbarui...' : 'Menyimpan...'}
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            {isEdit ? 'Perbarui' : 'Simpan'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenggunaForm;