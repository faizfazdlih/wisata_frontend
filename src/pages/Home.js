import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [destinasi, setDestinasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDestinasi();
  }, []);

  const getDestinasi = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/destinasi');
      setDestinasi(response.data.slice(0, 6)); // Ambil 6 destinasi terbaru
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden">
        <div            
          className="hero-bg position-absolute top-0 start-0 w-100 h-100"           
          style={{             
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.85) 0%, rgba(147, 197, 253, 0.85) 50%, rgba(255, 255, 255, 0.9) 100%), url("https://images.unsplash.com/photo-1748452478615-6f417bc4d29e?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") center/cover',             
            minHeight: '100vh'           
          }}         
        ></div>
        
        {/* Floating Elements */}
        <div className="floating-elements position-absolute w-100 h-100">
          <div className="floating-circle floating-1"></div>
          <div className="floating-circle floating-2"></div>
          <div className="floating-circle floating-3"></div>
        </div>
        
        <div className="container position-relative">
          <div className="row min-vh-100 align-items-center">
            <div className="col-lg-8 col-xl-7">
              <div className="hero-content text-white py-5">
                <h1 className="display-2 fw-bold mb-4 animate-fade-in hero-title">
                  Jelajahi Keindahan
                  <span className="d-block text-black">Wisata Indonesia</span>
                </h1>
                
                <p className="lead mb-5 fs-4 opacity-90 hero-description">
                  Temukan destinasi wisata lokal terbaik di Indonesia dengan panduan lengkap, 
                  ulasan terpercaya, dan pengalaman tak terlupakan yang menanti Anda.
                </p>
                
                <div className="d-flex flex-wrap gap-3 mb-5 hero-buttons">
                  <Link 
                    to="/destinasi" 
                    className="btn btn-cta-primary btn-lg px-5 py-3 fw-semibold"
                  >
                    <i className="bi bi-compass me-2"></i>
                    Jelajahi Sekarang
                  </Link>
                  <Link 
                    to="/kategori" 
                    className="btn btn-cta-secondary btn-lg px-5 py-3 fw-semibold"
                  >
                    <i className="bi bi-grid-3x3-gap me-2"></i>
                    Lihat Kategori
                  </Link>
                </div>
                
                {/* Enhanced Stats */}
                <div className="row text-center mt-5 stats-container">
                  <div className="col-4">
                    <div className="stat-item p-3 rounded-4">
                      <div className="stat-icon mb-2">
                        <i className="bi bi-geo-alt-fill text-warning fs-4"></i>
                      </div>
                      <h3 className="fw-bold mb-1 counter">500+</h3>
                      <p className="small opacity-75 mb-0">Destinasi Premium</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item p-3 rounded-4">
                      <div className="stat-icon mb-2">
                        <i className="bi bi-people-fill text-success fs-4"></i>
                      </div>
                      <h3 className="fw-bold mb-1 counter">10K+</h3>
                      <p className="small opacity-75 mb-0">Ulasan Terpercaya</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item p-3 rounded-4">
                      <div className="stat-icon mb-2">
                        <i className="bi bi-heart-fill text-danger fs-4"></i>
                      </div>
                      <h3 className="fw-bold mb-1 counter">25K+</h3>
                      <p className="small opacity-75 mb-0">Pengunjung Puas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Scroll Indicator */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
          <div className="scroll-indicator text-white text-center">
            <small className="d-block mb-2 opacity-75 fw-medium">Scroll untuk melihat lebih banyak</small>
            <div className="scroll-arrow">
              <i className="bi bi-chevron-down fs-3 animate-bounce"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-6 features-section">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <div className="section-badge mb-3">
                <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill fs-6">
                  Keunggulan Kami
                </span>
              </div>
              <h2 className="display-4 fw-bold mb-4 section-title">Mengapa Memilih Kami?</h2>
              <p className="lead text-muted fs-5">
                Platform terpercaya untuk menemukan destinasi wisata terbaik di Indonesia dengan layanan terdepan
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card text-center p-5 h-100 bg-white rounded-4 shadow-hover border border-light">
                <div className="feature-icon-wrapper mb-4">
                  <div className="feature-icon-bg bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-geo-alt-fill text-primary fs-2"></i>
                  </div>
                </div>
                <h4 className="fw-bold mb-3 h3">Destinasi Terpilih</h4>
                <p className="text-muted fs-6 lh-lg">
                  Kumpulan destinasi wisata terbaik yang telah dikurasi khusus oleh para ahli untuk pengalaman terbaik Anda.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card text-center p-5 h-100 bg-white rounded-4 shadow-hover border border-light">
                <div className="feature-icon-wrapper mb-4">
                  <div className="feature-icon-bg bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-star-fill text-warning fs-2"></i>
                  </div>
                </div>
                <h4 className="fw-bold mb-3 h3">Ulasan Terpercaya</h4>
                <p className="text-muted fs-6 lh-lg">
                  Dapatkan insight mendalam dari pengalaman nyata pengunjung lain untuk membantu perencanaan perjalanan Anda.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card text-center p-5 h-100 bg-white rounded-4 shadow-hover border border-light">
                <div className="feature-icon-wrapper mb-4">
                  <div className="feature-icon-bg bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-heart-fill text-danger fs-2"></i>
                  </div>
                </div>
                <h4 className="fw-bold mb-3 h3">Favorit Personal</h4>
                <p className="text-muted fs-6 lh-lg">
                  Simpan destinasi favorit Anda dan buat rencana perjalanan yang sempurna sesuai dengan keinginan hati.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Popular Destinations Section */}
      <section className="py-6 destinations-section bg-light">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-8">
              <div className="section-badge mb-3">
                <span className="badge bg-success bg-opacity-10 text-success px-4 py-2 rounded-pill fs-6">
                  Trending Sekarang
                </span>
              </div>
              <h2 className="display-4 fw-bold mb-4 section-title">Destinasi Populer</h2>
              <p className="lead text-muted fs-5">
                Jelajahi destinasi wisata yang paling diminati dan dapatkan inspirasi untuk petualangan Anda selanjutnya.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/destinasi" className="btn btn-outline-primary btn-lg px-4 py-3 fw-semibold">
                Lihat Semua <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="h5 text-muted">Memuat destinasi populer...</p>
            </div>
          ) : (
            <div className="row g-4">
              {destinasi.map((item, index) => (
                <div className="col-lg-4 col-md-6" key={item.id_destinasi}>
                  <div className="destination-card card border-0 shadow-sm h-100 overflow-hidden rounded-4">
                    <div className="position-relative overflow-hidden">
                      <img 
                        src={item.url_gambar || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} 
                        className="card-img-top destination-image" 
                        alt={item.nama_destinasi} 
                        style={{ height: '280px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold">
                          <i className="bi bi-trophy-fill me-1"></i>
                          #{index + 1} Populer
                        </span>
                      </div>
                      <div className="card-overlay position-absolute bottom-0 start-0 w-100 p-3">
                        <div className="d-flex align-items-center text-white">
                          <i className="bi bi-geo-alt-fill me-2"></i>
                          <small className="fw-medium">Indonesia</small>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <h5 className="card-title fw-bold mb-3 h4">{item.nama_destinasi}</h5>
                      <p className="card-text text-muted mb-4 lh-lg">
                        {item.deskripsi ? item.deskripsi.substring(0, 120) + '...' : 'Destinasi wisata yang menakjubkan dengan pemandangan indah dan pengalaman tak terlupakan yang akan selalu dikenang.'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                          ))}
                          <small className="text-muted ms-2 fw-medium">(4.8)</small>
                        </div>
                        <Link 
                          to={`/destinasi/${item.id_destinasi}`} 
                          className="btn btn-primary btn-sm px-3 py-2 fw-semibold"
                        >
                          Lihat Detail <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-6 cta-section" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)' }}>
        <div className="container">
          <div className="row align-items-center text-white">
            <div className="col-lg-8">
              <div className="cta-content">
                <div className="cta-badge mb-3">
                  <span className="badge bg-white bg-opacity-20 backdrop-blur px-4 py-2 rounded-pill fs-6">
                    <i className="bi bi-rocket-takeoff-fill text-warning me-2"></i>
                    Bergabung Sekarang
                  </span>
                </div>
                <h2 className="display-5 fw-bold mb-3">Siap untuk Petualangan Berikutnya?</h2>
                <p className="lead mb-0 fs-5 opacity-90">
                  Bergabunglah dengan ribuan traveler lainnya dan mulai jelajahi keindahan Indonesia hari ini juga!
                </p>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
              <Link to="/register" className="btn btn-warning btn-lg px-5 py-3 fw-semibold shadow-lg">
                <i className="bi bi-person-plus me-2"></i>
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        :root {
          --primary-gradient: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          --shadow-soft: 0 4px 20px rgba(0,0,0,0.08);
          --shadow-hover: 0 8px 30px rgba(0,0,0,0.12);
        }

        .py-6 {
          padding-top: 5rem;
          padding-bottom: 5rem;
        }
        
        .hero-section {
          position: relative;
          overflow: hidden;
        }
        
        .floating-elements {
          pointer-events: none;
        }
        
        .floating-circle {
          position: absolute;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          right: 10%;
          animation-delay: 0s;
        }
        
        .floating-2 {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 20%;
          animation-delay: 2s;
        }
        
        .floating-3 {
          width: 80px;
          height: 80px;
          top: 40%;
          right: 5%;
          animation-delay: 4s;
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #fb923c 0%, #f97316 50%, #c2410c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-title {
          line-height: 1.1;
          text-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }
        
        .hero-description {
          max-width: 600px;
          line-height: 1.6;
        }
        
        .btn-cta-primary {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border: none;
          color: #1f2937;
          transition: all 0.3s ease;
        }
        
        .btn-cta-primary:hover {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #1f2937;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
        }
        
        .btn-cta-secondary {
          background: rgba(255,255,255,0.15);
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .btn-cta-secondary:hover {
          background: rgba(255,255,255,0.25);
          border-color: rgba(255,255,255,0.5);
          color: white;
          transform: translateY(-2px);
        }
        
        .stats-container .stat-item {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }
        
        .stats-container .stat-item:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-3px);
        }
        
        .section-badge {
          margin-bottom: 1rem;
        }
        
        .section-title {
          color: #1f2937;
          line-height: 1.2;
        }
        
        .features-section {
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        }
        
        .feature-card {
          transition: all 0.4s ease;
          border: 1px solid #e5e7eb;
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-hover);
          border-color: #3b82f6;
        }
        
        .shadow-hover {
          box-shadow: var(--shadow-soft);
        }
        
        .destination-card {
          transition: all 0.4s ease;
          border: 1px solid #e5e7eb;
        }
        
        .destination-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-hover);
        }
        
        .destination-image {
          transition: transform 0.4s ease;
        }
        
        .destination-card:hover .destination-image {
          transform: scale(1.05);
        }
        
        .card-overlay {
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
        }
        
        .cta-section {
          position: relative;
          overflow: hidden;
        }
        
        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .animate-fade-in {
          animation: fadeIn 1.2s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(40px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { 
            transform: translateY(0); 
          }
          40% { 
            transform: translateY(-12px); 
          }
          60% { 
            transform: translateY(-6px); 
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }
        
        .counter {
          font-size: 2rem;
        }
        
        .backdrop-blur {
          backdrop-filter: blur(10px);
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .py-6 {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          
          .floating-circle {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;