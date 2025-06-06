import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profil');
  const [favorit, setFavorit] = useState([]);
  const [ulasan, setUlasan] = useState([]);
  const [profil, setProfil] = useState({
    nama: '',
    email: '',
    kata_sandi_baru: '',
    konfirmasi_kata_sandi: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const { currentUser, updateProfile } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      setProfil({
        ...profil,
        nama: currentUser.nama,
        email: currentUser.email
      });
      getFavorit();
      getUlasan();
    }
  }, [currentUser]);

  const getFavorit = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/favorit/pengguna/${currentUser.id_pengguna}`);
      setFavorit(response.data);
    } catch (error) {
      console.log(error);
      // Fallback ke data dummy jika API belum diimplementasikan
      setFavorit([
        { id_destinasi: 1, nama_destinasi: 'Pantai Kuta', url_gambar: 'https://via.placeholder.com/300x200' },
        { id_destinasi: 2, nama_destinasi: 'Gunung Bromo', url_gambar: 'https://via.placeholder.com/300x200' }
      ]);
    }
  };

  const getUlasan = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ulasan/pengguna/${currentUser.id_pengguna}`);
      setUlasan(response.data);
    } catch (error) {
      console.log(error);
      // Fallback ke data dummy jika API belum diimplementasikan
      setUlasan([
        { id_ulasan: 1, id_destinasi: 1, nama_destinasi: 'Pantai Kuta', penilaian: 5, komentar: 'Tempat yang indah!', tanggal_ulasan: '2023-06-15' },
        { id_ulasan: 2, id_destinasi: 3, nama_destinasi: 'Candi Borobudur', penilaian: 4, komentar: 'Bersejarah dan menakjubkan.', tanggal_ulasan: '2023-06-10' }
      ]);
    }
  };

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

  const handleHapusFavorit = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorit/${id}`);
      getFavorit();
      setMessage({ text: 'Favorit berhasil dihapus', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan saat menghapus favorit', type: 'danger' });
      console.log(error);
    }
  };

  const handleHapusUlasan = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ulasan/${id}`);
      getUlasan();
      setMessage({ text: 'Ulasan berhasil dihapus', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan saat menghapus ulasan', type: 'danger' });
      console.log(error);
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
                    <p className="mb-0 opacity-75">Kelola profil dan aktivitas wisata Anda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 text-primary">Menu Dashboard</h5>
              </div>
              <div className="list-group list-group-flush">
                <button 
                  className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center ${activeTab === 'profil' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('profil')}
                >
                  <i className="bi bi-person-gear me-3"></i>
                  <span>Profil Saya</span>
                </button>
                <button 
                  className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center ${activeTab === 'favorit' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('favorit')}
                >
                  <i className="bi bi-heart-fill me-3"></i>
                  <span>Destinasi Favorit</span>
                  {favorit.length > 0 && (
                    <span className={`badge ms-auto ${activeTab === 'favorit' ? 'bg-white text-primary' : 'bg-primary'}`}>
                      {favorit.length}
                    </span>
                  )}
                </button>
                <button 
                  className={`list-group-item list-group-item-action border-0 py-3 d-flex align-items-center ${activeTab === 'ulasan' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('ulasan')}
                >
                  <i className="bi bi-star-fill me-3"></i>
                  <span>Ulasan Saya</span>
                  {ulasan.length > 0 && (
                    <span className={`badge ms-auto ${activeTab === 'ulasan' ? 'bg-white text-primary' : 'bg-primary'}`}>
                      {ulasan.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Alert Messages */}
            {message.text && (
              <div className={`alert alert-${message.type} border-0 shadow-sm mb-4 d-flex align-items-center`} role="alert">
                <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                {message.text}
              </div>
            )}
            
            {/* Profil Tab */}
            {activeTab === 'profil' && (
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
                    
                    <div className="text-end mt-4">
                      <button type="submit" className="btn btn-primary btn-lg px-4 shadow-sm">
                        <i className="bi bi-check-lg me-2"></i>Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Favorit Tab */}
            {activeTab === 'favorit' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-4">
                  <h4 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-heart-fill me-2 text-danger"></i>
                    Destinasi Favorit Saya
                  </h4>
                </div>
                <div className="card-body p-4">
                  {favorit.length > 0 ? (
                    <div className="row g-4">
                      {favorit.map((item) => (
                        <div className="col-md-6 col-lg-4" key={item.id_destinasi}>
                          <div className="card border-0 shadow-sm h-100 overflow-hidden">
                            <div className="position-relative">
                              <img 
                                src={item.url_gambar} 
                                className="card-img-top" 
                                alt={item.nama_destinasi} 
                                style={{ height: '200px', objectFit: 'cover' }}
                              />
                              <div className="position-absolute top-0 end-0 m-2">
                                <span className="badge bg-danger">
                                  <i className="bi bi-heart-fill"></i>
                                </span>
                              </div>
                            </div>
                            <div className="card-body">
                              <h5 className="card-title mb-3">{item.nama_destinasi}</h5>
                              <div className="d-flex gap-2">
                                <Link 
                                  to={`/destinasi/${item.id_destinasi}`} 
                                  className="btn btn-outline-primary btn-sm flex-fill"
                                >
                                  <i className="bi bi-eye me-1"></i>Lihat Detail
                                </Link>
                                <button 
                                  className="btn btn-outline-danger btn-sm" 
                                  onClick={() => handleHapusFavorit(item.id_favorit)}
                                  title="Hapus dari favorit"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-heart text-muted" style={{ fontSize: '4rem' }}></i>
                      <h5 className="mt-3 text-muted">Belum Ada Favorit</h5>
                      <p className="text-muted">Mulai jelajahi destinasi dan tambahkan ke favorit Anda!</p>
                      <Link to="/destinasi" className="btn btn-primary">
                        <i className="bi bi-compass me-2"></i>Jelajahi Destinasi
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ulasan Tab */}
            {activeTab === 'ulasan' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-4">
                  <h4 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-star-fill me-2 text-warning"></i>
                    Ulasan Saya
                  </h4>
                </div>
                <div className="card-body p-4">
                  {ulasan.length > 0 ? (
                    <div className="row g-4">
                      {ulasan.map((item) => (
                        <div className="col-12" key={item.id_ulasan}>
                          <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <h5 className="card-title mb-2">{item.nama_destinasi}</h5>
                                  <div className="d-flex align-items-center mb-2">
                                    {[...Array(5)].map((_, i) => (
                                      <i 
                                        key={i} 
                                        className={`bi ${i < item.penilaian ? 'bi-star-fill' : 'bi-star'} text-warning me-1`}
                                      ></i>
                                    ))}
                                    <span className="ms-2 text-muted">({item.penilaian}/5)</span>
                                  </div>
                                </div>
                                <button 
                                  className="btn btn-outline-danger btn-sm" 
                                  onClick={() => handleHapusUlasan(item.id_ulasan)}
                                  title="Hapus ulasan"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                              <blockquote className="blockquote mb-3">
                                <p className="mb-0 fst-italic">"{item.komentar}"</p>
                              </blockquote>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  <i className="bi bi-calendar me-1"></i>
                                  {new Date(item.tanggal_ulasan).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </small>
                                <Link 
                                  to={`/destinasi/${item.id_destinasi}`}
                                  className="btn btn-outline-primary btn-sm"
                                >
                                  <i className="bi bi-eye me-1"></i>Lihat Destinasi
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-star text-muted" style={{ fontSize: '4rem' }}></i>
                      <h5 className="mt-3 text-muted">Belum Ada Ulasan</h5>
                      <p className="text-muted">Bagikan pengalaman Anda tentang destinasi wisata!</p>
                      <Link to="/destinasi" className="btn btn-primary">
                        <i className="bi bi-pencil-square me-2"></i>Tulis Ulasan Pertama
                      </Link>
                    </div>
                  )}
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