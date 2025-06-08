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
    <div className="min-h-screen bg-gradient-to-r from-nature-500 to-nature-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute w-24 h-24 bg-white bg-opacity-10 rounded-full top-1/5 right-1/10 animate-pulse"></div>
        <div className="absolute w-16 h-16 bg-white bg-opacity-10 rounded-full top-3/5 right-1/5 animate-pulse delay-1000"></div>
        <div className="absolute w-20 h-20 bg-white bg-opacity-10 rounded-full top-2/5 right-5 animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl relative z-10">
        <div>
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="bg-nature-50 text-nature-600 px-6 py-3 rounded-full text-lg font-medium">
                Daftar Akun
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bergabung dengan Kami</h2>
            <p className="text-gray-600">Daftar untuk menjelajahi destinasi wisata terbaik di Indonesia</p>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-nature-600 focus:ring-4 focus:ring-nature-100 transition-all duration-300" 
                id="nama" 
                name="nama" 
                value={formData.nama}
                onChange={handleChange}
                required 
                placeholder="Masukkan nama lengkap"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-nature-600 focus:ring-4 focus:ring-nature-100 transition-all duration-300" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
                placeholder="Masukkan alamat email"
              />
            </div>
            
            <div>
              <label htmlFor="kata_sandi" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-nature-600 focus:ring-4 focus:ring-nature-100 transition-all duration-300" 
                id="kata_sandi" 
                name="kata_sandi" 
                value={formData.kata_sandi}
                onChange={handleChange}
                required 
                placeholder="Buat kata sandi"
              />
            </div>
            
            <div>
              <label htmlFor="konfirmasi_kata_sandi" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-nature-600 focus:ring-4 focus:ring-nature-100 transition-all duration-300" 
                id="konfirmasi_kata_sandi" 
                name="konfirmasi_kata_sandi" 
                value={formData.konfirmasi_kata_sandi}
                onChange={handleChange}
                required 
                placeholder="Konfirmasi kata sandi"
              />
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              className="w-full bg-nature-500 hover:bg-nature-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : 'Daftar Sekarang'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Sudah punya akun? 
            <Link to="/login" className="text-nature-600 hover:text-nature-700 font-medium ml-1 transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;