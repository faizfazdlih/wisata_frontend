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
              <div className="bg-green-50 text-green-600 px-6 py-3 rounded-full text-lg font-medium flex items-center gap-3">
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 40 40" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                >
                  <defs>
                    <linearGradient id="worldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                    <linearGradient id="planeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                  
                  {/* Globe/World */}
                  <circle 
                    cx="20" 
                    cy="20" 
                    r="16" 
                    fill="url(#worldGradient)" 
                    stroke="#1F2937" 
                    strokeWidth="1.5"
                  />
                  
                  {/* Continents/Land masses */}
                  <path 
                    d="M8 16C8 14 10 12 14 12C16 12 18 14 18 16C18 18 16 20 14 20C12 20 10 18 8 16Z" 
                    fill="#059669" 
                    opacity="0.8"
                  />
                  <path 
                    d="M22 14C22 12 24 10 28 10C30 10 32 12 32 14C32 16 30 18 28 18C26 18 24 16 22 14Z" 
                    fill="#059669" 
                    opacity="0.8"
                  />
                  <path 
                    d="M12 26C12 24 14 22 18 22C20 22 22 24 22 26C22 28 20 30 18 30C16 30 14 28 12 26Z" 
                    fill="#059669" 
                    opacity="0.8"
                  />
                  <path 
                    d="M26 28C26 26 28 24 32 24C34 24 36 26 36 28C36 30 34 32 32 32C30 32 28 30 26 28Z" 
                    fill="#059669" 
                    opacity="0.8"
                  />
                  
                  {/* Longitude/Latitude lines */}
                  <ellipse 
                    cx="20" 
                    cy="20" 
                    rx="16" 
                    ry="8" 
                    fill="none" 
                    stroke="#1F2937" 
                    strokeWidth="0.5" 
                    opacity="0.3"
                  />
                  <ellipse 
                    cx="20" 
                    cy="20" 
                    rx="8" 
                    ry="16" 
                    fill="none" 
                    stroke="#1F2937" 
                    strokeWidth="0.5" 
                    opacity="0.3"
                  />
                  <line 
                    x1="4" 
                    y1="20" 
                    x2="36" 
                    y2="20" 
                    stroke="#1F2937" 
                    strokeWidth="0.5" 
                    opacity="0.3"
                  />
                  
                  {/* Airplane */}
                  <g transform="translate(28, 8) rotate(45)">
                    <path 
                      d="M0 2L8 0L10 2L6 4L8 6L4 8L2 6L0 8L-2 6L2 4L0 2Z" 
                      fill="url(#planeGradient)" 
                      stroke="#1F2937" 
                      strokeWidth="0.8"
                    />
                    <circle cx="2" cy="4" r="1" fill="#FFF" opacity="0.8"/>
                  </g>
                  
                  {/* Flight path/trail */}
                  <path 
                    d="M10 30Q15 25 20 20Q25 15 30 10" 
                    fill="none" 
                    stroke="#F59E0B" 
                    strokeWidth="1.5" 
                    strokeDasharray="2,2" 
                    opacity="0.6"
                  />
                  
                  {/* Location pin */}
                  <g transform="translate(26, 26)">
                    <path 
                      d="M0 0C-2 0 -4 2 -4 4C-4 6 0 10 0 10S4 6 4 4C4 2 2 0 0 0Z" 
                      fill="#EF4444" 
                      stroke="#1F2937" 
                      strokeWidth="0.8"
                    />
                    <circle cx="0" cy="4" r="1.5" fill="#FFF"/>
                  </g>
                </svg>
                <span className="font-bold">ULIN</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang Kembali</h2>
            <p className="text-gray-600">Masuk untuk melanjutkan petualangan wisata Anda</p>
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
                placeholder="Masukkan kata sandi"
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
              ) : 'Masuk'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Belum punya akun? 
            <Link to="/register" className="text-nature-600 hover:text-nature-700 font-medium ml-1 transition-colors">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;