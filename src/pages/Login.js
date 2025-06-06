import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    kata_sandi: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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
    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.kata_sandi);
      if (result.success) {
        // Cek peran pengguna dan redirect sesuai peran
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.peran === 'admin') {
          navigate('/admin'); // Redirect admin ke dashboard admin
        } else {
          navigate('/'); // Redirect pengguna biasa ke dashboard
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login');
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
            <h4 className="text-center">Masuk</h4>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
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
              <div className="d-grid gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
              </div>
            </form>
            <div className="mt-3 text-center">
              <p>Belum punya akun? <Link to="/register">Daftar</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;