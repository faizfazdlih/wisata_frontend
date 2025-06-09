import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [profil, setProfil] = useState({
    nama: '',
    email: '',
    kata_sandi_baru: '',
    konfirmasi_kata_sandi: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { currentUser, updateProfile, deleteAccount } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setProfil({
        ...profil,
        nama: currentUser.nama,
        email: currentUser.email
      });
    }
  }, [currentUser]);

  const handleProfilUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    // Validasi kata sandi
    if (profil.kata_sandi_baru && profil.kata_sandi_baru !== profil.konfirmasi_kata_sandi) {
      setMessage({ text: 'Kata sandi baru dan konfirmasi kata sandi tidak cocok', type: 'danger' });
      return;
    }
    
    try {
      const userData = {
        nama: profil.nama
      };
      
      if (profil.kata_sandi_baru) {
        userData.kata_sandi = profil.kata_sandi_baru;
      }
      
      const result = await updateProfile(userData);
      
      if (result.success) {
        setMessage({ text: 'Profil berhasil diperbarui', type: 'success' });
        setProfil({
          ...profil,
          kata_sandi_baru: '',
          konfirmasi_kata_sandi: ''
        });
      } else {
        setMessage({ text: result.message, type: 'danger' });
      }
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan saat memperbarui profil', type: 'danger' });
      console.log(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount();
      if (result.success) {
        navigate('/');
      } else {
        setMessage({ text: result.message, type: 'danger' });
        setShowConfirmDelete(false);
      }
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan saat menghapus akun', type: 'danger' });
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Main Content */}
      <section className="py-6 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Alert Messages */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl shadow-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-start space-x-3">
                <i className={`${
                  message.type === 'success' 
                    ? 'fa-solid fa-check-circle text-green-500' 
                    : 'fa-solid fa-exclamation-triangle text-red-500'
                } text-lg mt-0.5 flex-shrink-0`}></i>
                <span className="font-medium text-sm sm:text-base break-words">{message.text}</span>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-nature-500 to-nature-600 px-4 sm:px-8 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-user-gear text-white text-lg sm:text-2xl"></i>
                </div>
                <div className="text-white">
                  <h2 className="text-xl sm:text-2xl font-bold">Pengaturan Profil</h2>
                  <p className="opacity-90 text-sm sm:text-base">Perbarui informasi dan keamanan akun Anda</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 sm:p-8">
              <form onSubmit={handleProfilUpdate} className="space-y-6 sm:space-y-8">
                {/* Personal Information */}
                <div>
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-8 h-8 bg-nature-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="fa-solid fa-user text-nature-600 text-sm"></i>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Informasi Personal</h3>
                  </div>
                  
                  <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                    <div className="w-full">
                      <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fa-solid fa-user mr-2 text-gray-400"></i>Nama Lengkap
                      </label>
                      <input 
                        type="text" 
                        id="nama" 
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                        value={profil.nama}
                        onChange={(e) => setProfil({...profil, nama: e.target.value})}
                        required
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    
                    <div className="w-full">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fa-solid fa-envelope mr-2 text-gray-400"></i>Email
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed text-sm sm:text-base"
                        value={profil.email}
                        readOnly
                        placeholder="Email tidak dapat diubah"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div>
                  <div className="flex flex-wrap items-center mb-4 sm:mb-6 gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <i className="fa-solid fa-shield text-blue-600 text-sm"></i>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Keamanan Akun</h3>
                    <span className="text-xs sm:text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Opsional</span>
                  </div>
                  
                  <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                    <div className="w-full">
                      <label htmlFor="kata_sandi_baru" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fa-solid fa-lock mr-2 text-gray-400"></i>Kata Sandi Baru
                      </label>
                      <input 
                        type="password" 
                        id="kata_sandi_baru" 
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                        value={profil.kata_sandi_baru}
                        onChange={(e) => setProfil({...profil, kata_sandi_baru: e.target.value})}
                        placeholder="Masukkan kata sandi baru"
                      />
                    </div>
                    
                    <div className="w-full">
                      <label htmlFor="konfirmasi_kata_sandi" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fa-solid fa-shield-check mr-2 text-gray-400"></i>Konfirmasi Kata Sandi
                      </label>
                      <input 
                        type="password" 
                        id="konfirmasi_kata_sandi" 
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                        value={profil.konfirmasi_kata_sandi}
                        onChange={(e) => setProfil({...profil, konfirmasi_kata_sandi: e.target.value})}
                        placeholder="Konfirmasi kata sandi baru"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-6 border-t border-gray-200">
                  <button 
                    type="button" 
                    className="order-2 sm:order-1 bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    onClick={() => setShowConfirmDelete(true)}
                  >
                    <i className="fa-solid fa-trash text-sm"></i>
                    <span>Hapus Akun</span>
                  </button>
                  
                  <button 
                    type="submit" 
                    className="order-1 sm:order-2 bg-gradient-to-r from-nature-500 to-nature-600 hover:from-nature-600 hover:to-nature-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    <i className="fa-solid fa-check text-sm"></i>
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Konfirmasi Hapus Akun */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-exclamation-triangle text-white text-sm sm:text-lg"></i>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white truncate">Konfirmasi Hapus Akun</h3>
                </div>
                <button 
                  type="button" 
                  className="text-white hover:text-gray-200 transition-colors ml-2 flex-shrink-0"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  <i className="fa-solid fa-times text-lg sm:text-xl"></i>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              <div className="text-center mb-6">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-user-slash text-red-500 text-xl sm:text-2xl"></i>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  Apakah Anda yakin ingin menghapus akun Anda? 
                  <strong className="text-red-600"> Tindakan ini tidak dapat dibatalkan</strong> dan 
                  semua data Anda akan dihapus secara permanen.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  type="button" 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  <i className="fa-solid fa-arrow-left mr-2"></i>
                  Batal
                </button>
                <button 
                  type="button" 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  onClick={handleDeleteAccount}
                >
                  <i className="fa-solid fa-trash mr-2"></i>
                  Hapus Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;