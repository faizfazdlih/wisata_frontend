import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    destinasi: 0,
    kategori: 0,
    ulasan: 0,
    pengguna: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch destinasi count
      const destinasiRes = await axios.get('http://localhost:5000/api/destinasi');
      
      // Fetch kategori count
      const kategoriRes = await axios.get('http://localhost:5000/api/kategori');
      
      // Fetch ulasan count (assuming this endpoint exists)
      let ulasanCount = 0;
      try {
        const ulasanRes = await axios.get('http://localhost:5000/api/ulasan');
        ulasanCount = ulasanRes.data.length;
      } catch (err) {
        console.log('Ulasan count not available');
      }
      
      // Fetch pengguna count (assuming this endpoint exists)
      let penggunaCount = 0;
      try {
        const penggunaRes = await axios.get('http://localhost:5000/api/pengguna');
        penggunaCount = penggunaRes.data.length;
      } catch (err) {
        console.log('Pengguna count not available');
      }
      
      setStats({
        destinasi: destinasiRes.data.length,
        kategori: kategoriRes.data.length,
        ulasan: ulasanCount,
        pengguna: penggunaCount
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Gagal memuat data statistik');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h2 className="card-title">Selamat Datang, {currentUser?.nama || 'Admin'}!</h2>
              <p className="card-text">Ini adalah panel admin untuk mengelola konten Katalog Wisata Lokal.</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Destinasi</h5>
                  <h2 className="display-4">{stats.destinasi}</h2>
                </div>
                <i className="fas fa-map-marker-alt fa-3x"></i>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/destinasi" className="text-white text-decoration-none">Lihat Detail</Link>
              <i className="fas fa-arrow-circle-right text-white"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Kategori</h5>
                  <h2 className="display-4">{stats.kategori}</h2>
                </div>
                <i className="fas fa-tags fa-3x"></i>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/kategori" className="text-white text-decoration-none">Lihat Detail</Link>
              <i className="fas fa-arrow-circle-right text-white"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Ulasan</h5>
                  <h2 className="display-4">{stats.ulasan}</h2>
                </div>
                <i className="fas fa-comments fa-3x"></i>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/ulasan" className="text-white text-decoration-none">Lihat Detail</Link>
              <i className="fas fa-arrow-circle-right text-white"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Pengguna</h5>
                  <h2 className="display-4">{stats.pengguna}</h2>
                </div>
                <i className="fas fa-users fa-3x"></i>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/pengguna" className="text-white text-decoration-none">Lihat Detail</Link>
              <i className="fas fa-arrow-circle-right text-white"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Aksi Cepat</h5>
            </div>
            <div className="card-body">
              <div className="list-group">
                <Link to="/admin/destinasi/tambah" className="list-group-item list-group-item-action">
                  <i className="fas fa-plus-circle me-2"></i> Tambah Destinasi Baru
                </Link>
                <Link to="/admin/kategori/tambah" className="list-group-item list-group-item-action">
                  <i className="fas fa-plus-circle me-2"></i> Tambah Kategori Baru
                </Link>
                <Link to="/admin/gambar/tambah" className="list-group-item list-group-item-action">
                  <i className="fas fa-plus-circle me-2"></i> Tambah Gambar Baru
                </Link>
                <Link to="/admin/pengguna/tambah" className="list-group-item list-group-item-action">
                  <i className="fas fa-plus-circle me-2"></i> Tambah Pengguna Baru
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Informasi Sistem</h5>
            </div>
            <div className="card-body">
              <p><strong>Versi Aplikasi:</strong> 1.0.0</p>
              <p><strong>Status Server:</strong> <span className="badge bg-success">Online</span></p>
              <p><strong>Terakhir Diperbarui:</strong> {new Date().toLocaleDateString('id-ID')}</p>
              <p><strong>Pengguna Login:</strong> {currentUser?.nama || 'Admin'}</p>
              <p><strong>Peran:</strong> {currentUser?.peran || 'Admin'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;