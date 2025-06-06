import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    kata_sandi: '',
    konfirmasi_kata_sandi: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validasi kata sandi
    if (formData.kata_sandi !== formData.konfirmasi_kata_sandi) {
      setError('Kata sandi dan konfirmasi kata sandi tidak cocok');
      return;
    }
    
    setLoading(true);
    try {
      const result = await register(
        formData.nama,
        formData.email,
        formData.kata_sandi,
        formData.konfirmasi_kata_sandi
      );
      
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Terjadi kesalahan saat mendaftar');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h4 className="text-center">Daftar</h4>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nama" className="form-label">Nama</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="nama" 
                  name="nama" 
                  value={formData.nama}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="kata_sandi" className="form-label">Kata Sandi</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="kata_sandi" 
                  name="kata_sandi" 
                  value={formData.kata_sandi}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="konfirmasi_kata_sandi" className="form-label">Konfirmasi Kata Sandi</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="konfirmasi_kata_sandi" 
                  name="konfirmasi_kata_sandi" 
                  value={formData.konfirmasi_kata_sandi}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="d-grid gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Daftar'}
                </button>
              </div>
            </form>
            <div className="mt-3 text-center">
              <p>Sudah punya akun? <Link to="/login">Masuk</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;