import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminNavbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fungsi untuk menentukan apakah menu aktif
  const isActive = (path) => {
    return location.pathname.includes(path) ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/admin">
          <i className="fas fa-cogs me-2"></i>
          Admin Panel
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/destinasi')}`} to="/admin/destinasi">
                <i className="fas fa-map-marker-alt me-1"></i> Destinasi
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/kategori')}`} to="/admin/kategori">
                <i className="fas fa-tags me-1"></i> Kategori
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/gambar')}`} to="/admin/gambar">
                <i className="fas fa-images me-1"></i> Gambar
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/ulasan')}`} to="/admin/ulasan">
                <i className="fas fa-comments me-1"></i> Ulasan
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/admin/pengguna')}`} to="/admin/pengguna">
                <i className="fas fa-users me-1"></i> Pengguna
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user-circle me-1"></i>
                {currentUser?.nama || 'Admin'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/dashboard">
                    <i className="fas fa-user me-2"></i> Profil Saya
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/">
                    <i className="fas fa-home me-2"></i> Kembali ke Situs
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i> Keluar
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;