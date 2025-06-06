import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-modern fixed-top">
        <div className="container">
          {/* Brand Logo */}
          <Link className="navbar-brand brand-modern" to="/">
            <div className="brand-content">
              <div className="brand-text">
                <span className="brand-name">Katalog Wisata</span>
                <small className="brand-subtitle">Indonesia</small>
              </div>
            </div>
          </Link>

          {/* Mobile Toggle */}
          <button 
            className="navbar-toggler custom-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="toggler-line"></span>
            <span className="toggler-line"></span>
            <span className="toggler-line"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Main Navigation */}
            <ul className="navbar-nav nav-main me-auto">
              <li className="nav-item">
                <Link className="nav-link nav-link-modern" to="/destinasi">
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  Destinasi
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-link-modern" to="/kategori">
                  <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                  Kategori
                </Link>
              </li>
            </ul>

            {/* Auth Navigation */}
            <ul className="navbar-nav nav-auth">
              {currentUser ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link nav-link-user" to="/dashboard">
                      <div className="user-avatar">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <span className="user-name">{currentUser.nama}</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn-logout" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Keluar
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link nav-link-auth" to="/login">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Masuk
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link btn-register" to="/register">
                      <i className="bi bi-person-plus me-2"></i>
                      Daftar
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Navbar Background Blur */}
        <div className="navbar-bg"></div>
      </nav>

      {/* Add padding to body to account for fixed navbar */}
      <div className="navbar-spacer"></div>

      <style jsx>{`
        .navbar-modern {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(37, 99, 235, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 1rem 0;
          transition: all 0.3s ease;
          z-index: 1030;
        }

        .navbar-modern.scrolled {
          padding: 0.5rem 0;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 2px 30px rgba(0, 0, 0, 0.12);
        }

        .navbar-spacer {
          height: 80px;
        }

        /* Brand Styling */
        .brand-modern {
          text-decoration: none;
          color: #1f2937;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .brand-modern:hover {
          color: #2563eb;
          text-decoration: none;
          transform: translateY(-1px);
        }

        .brand-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .brand-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
        }

        .brand-subtitle {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          margin-top: -2px;
        }

        /* Custom Toggler */
        .custom-toggler {
          border: none;
          padding: 8px;
          background: rgba(37, 99, 235, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .custom-toggler:hover {
          background: rgba(37, 99, 235, 0.2);
        }

        .custom-toggler:focus {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
        }

        .toggler-line {
          display: block;
          width: 20px;
          height: 2px;
          background: #2563eb;
          margin: 4px 0;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        /* Navigation Links */
        .nav-main .nav-link-modern {
          color: #4b5563;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          margin: 0 4px;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
        }

        .nav-main .nav-link-modern:hover {
          color: #2563eb;
          background: rgba(37, 99, 235, 0.1);
          transform: translateY(-1px);
        }

        .nav-main .nav-link-modern.active {
          color: #2563eb;
          background: rgba(37, 99, 235, 0.1);
        }

        /* Auth Navigation */
        .nav-auth {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link-user {
          color: #4b5563;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link-user:hover {
          color: #2563eb;
          background: rgba(37, 99, 235, 0.1);
          text-decoration: none;
        }

        .user-avatar {
          font-size: 1.5rem;
          color: #2563eb;
        }

        .user-name {
          font-weight: 600;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .nav-link-auth {
          color: #4b5563;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .nav-link-auth:hover {
          color: #2563eb;
          background: rgba(37, 99, 235, 0.1);
          text-decoration: none;
        }

        .btn-logout {
          background: none;
          border: none;
          color: #dc2626;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .btn-logout:hover {
          color: #dc2626;
          background: rgba(220, 38, 38, 0.1);
        }

        .btn-register {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          color: white;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 10px;
          transition: all 0.3s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .btn-register:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
          color: white;
          text-decoration: none;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        /* Mobile Responsive */
        @media (max-width: 991.98px) {
          .navbar-modern {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
          }

          .nav-main {
            margin-top: 1rem;
            margin-bottom: 1rem;
          }

          .nav-main .nav-link-modern {
            padding: 12px 16px;
            margin: 4px 0;
            border-radius: 12px;
          }

          .nav-auth {
            flex-direction: column;
            width: 100%;
            gap: 8px;
          }

          .nav-auth .nav-item {
            width: 100%;
          }

          .nav-link-user,
          .nav-link-auth,
          .btn-logout,
          .btn-register {
            padding: 12px 16px;
            width: 100%;
            justify-content: flex-start;
            border-radius: 12px;
          }

          .btn-register {
            margin-top: 8px;
            justify-content: center;
          }

          .brand-content {
            gap: 10px;
          }

          .brand-icon {
            width: 36px;
            height: 36px;
            font-size: 1.1rem;
          }

          .brand-name {
            font-size: 1.1rem;
          }

          .brand-subtitle {
            font-size: 0.7rem;
          }
        }

        /* Smooth scroll behavior */
        @media (min-width: 992px) {
          .navbar-collapse {
            justify-content: space-between;
          }
        }

        /* Focus states for accessibility */
        .nav-link-modern:focus,
        .nav-link-user:focus,
        .nav-link-auth:focus,
        .btn-logout:focus,
        .btn-register:focus {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        /* Animation for navbar items */
        .nav-item {
          animation: fadeInUp 0.6s ease forwards;
        }

        .nav-item:nth-child(1) { animation-delay: 0.1s; }
        .nav-item:nth-child(2) { animation-delay: 0.2s; }
        .nav-item:nth-child(3) { animation-delay: 0.3s; }
        .nav-item:nth-child(4) { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;