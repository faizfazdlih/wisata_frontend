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
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container py-5">
        {/* Header Welcome */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="card-body text-white p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-white rounded-circle p-3 me-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-person-circle text-primary" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <div>
                    <h3 className="mb-0">Selamat Datang, {currentUser?.nama}!</h3>
                    <p className="mb-0 opacity-75">Kelola profil Anda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Main Content */}
          <div className="col-12">
            {/* Alert Messages */}
            {message.text && (
              <div className={`alert alert-${message.type} border-0 shadow-sm mb-4 d-flex align-items-center`} role="alert">
                <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                {message.text}
              </div>
            )}
            
            {/* Profil Tab */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-4">
                <h4 className="mb-0 d-flex align-items-center">
                  <i className="bi bi-person-gear me-2 text-primary"></i>
                  Pengaturan Profil
                </h4>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleProfilUpdate}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="nama" className="form-label fw-semibold">
                        <i className="bi bi-person me-2 text-muted"></i>Nama Lengkap
                      </label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg border-0 shadow-sm" 
                        id="nama" 
                        value={profil.nama}
                        onChange={(e) => setProfil({...profil, nama: e.target.value})}
                        required
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="bi bi-envelope me-2 text-muted"></i>Email
                      </label>
                      <input 
                        type="email" 
                        className="form-control form-control-lg border-0 shadow-sm" 
                        id="email" 
                        value={profil.email}
                        readOnly
                        style={{ backgroundColor: '#e9ecef' }}
                      />
                    </div>
                  </div>
                  
                  <hr className="my-4" />
                  <h6 className="text-muted mb-3">Ganti Kata Sandi (Opsional)</h6>
                  
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="kata_sandi_baru" className="form-label fw-semibold">
                        <i className="bi bi-lock me-2 text-muted"></i>Kata Sandi Baru
                      </label>
                      <input 
                        type="password" 
                        className="form-control form-control-lg border-0 shadow-sm" 
                        id="kata_sandi_baru" 
                        value={profil.kata_sandi_baru}
                        onChange={(e) => setProfil({...profil, kata_sandi_baru: e.target.value})}
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="konfirmasi_kata_sandi" className="form-label fw-semibold">
                        <i className="bi bi-shield-check me-2 text-muted"></i>Konfirmasi Kata Sandi
                      </label>
                      <input 
                        type="password" 
                        className="form-control form-control-lg border-0 shadow-sm" 
                        id="konfirmasi_kata_sandi" 
                        value={profil.konfirmasi_kata_sandi}
                        onChange={(e) => setProfil({...profil, konfirmasi_kata_sandi: e.target.value})}
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <button 
                      type="button" 
                      className="btn btn-outline-danger btn-lg px-4 shadow-sm"
                      onClick={() => setShowConfirmDelete(true)}
                    >
                      <i className="bi bi-trash me-2"></i>Hapus Akun
                    </button>
                    
                    <button type="submit" className="btn btn-primary btn-lg px-4 shadow-sm">
                      <i className="bi bi-check-lg me-2"></i>Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Modal Konfirmasi Hapus Akun */}
            {showConfirmDelete && (
              <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 shadow">
                    <div className="modal-header bg-danger text-white">
                      <h5 className="modal-title"><i className="bi bi-exclamation-triangle-fill me-2"></i>Konfirmasi Hapus Akun</h5>
                      <button type="button" className="btn-close btn-close-white" onClick={() => setShowConfirmDelete(false)}></button>
                    </div>
                    <div className="modal-body p-4">
                      <p className="mb-0">Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini tidak dapat dibatalkan dan semua data Anda akan dihapus secara permanen.</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmDelete(false)}>Batal</button>
                      <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>
                        <i className="bi bi-trash me-2"></i>Hapus Akun
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;