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
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80") center/cover',
            minHeight: '100vh'
          }}
        ></div>
        <div className="container position-relative">
          <div className="row min-vh-100 align-items-center">
            <div className="col-lg-8 col-xl-7">
              <div className="hero-content text-white py-5">
                <h1 className="display-3 fw-bold mb-4 animate-fade-in">
                  Jelajahi Keindahan
                  <span className="d-block text-warning">Wisata Indonesia</span>
                </h1>
                <p className="lead mb-4 fs-5 opacity-90">
                  Temukan destinasi wisata lokal terbaik di Indonesia dengan panduan lengkap, 
                  ulasan terpercaya, dan pengalaman tak terlupakan yang menanti Anda.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-5">
                  <Link 
                    to="/destinasi" 
                    className="btn btn-warning btn-lg px-4 py-3 fw-semibold shadow-lg"
                  >
                    <i className="bi bi-compass me-2"></i>
                    Jelajahi Sekarang
                  </Link>
                  <Link 
                    to="/kategori" 
                    className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold"
                  >
                    <i className="bi bi-grid-3x3-gap me-2"></i>
                    Lihat Kategori
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="row text-center mt-5">
                  <div className="col-4">
                    <div className="stat-item">
                      <h3 className="fw-bold mb-1">500+</h3>
                      <p className="small opacity-75">Destinasi</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item">
                      <h3 className="fw-bold mb-1">10K+</h3>
                      <p className="small opacity-75">Ulasan</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item">
                      <h3 className="fw-bold mb-1">25K+</h3>
                      <p className="small opacity-75">Pengunjung</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
          <div className="scroll-indicator text-white text-center">
            <small className="d-block mb-2 opacity-75">Scroll untuk melihat lebih banyak</small>
            <i className="bi bi-chevron-down fs-4 animate-bounce"></i>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold mb-3">Mengapa Memilih Kami?</h2>
              <p className="lead text-muted">
                Platform terpercaya untuk menemukan destinasi wisata terbaik di Indonesia
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card text-center p-4 h-100 bg-white rounded-3 shadow-sm">
                <div className="feature-icon mb-3">
                  <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4 className="fw-bold mb-3">Destinasi Terpilih</h4>
                <p className="text-muted">
                  Kumpulan destinasi wisata terbaik yang telah dikurasi khusus untuk pengalaman terbaik Anda.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card text-center p-4 h-100 bg-white rounded-3 shadow-sm">
                <div className="feature-icon mb-3">
                  <i className="bi bi-star-fill text-warning" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4 className="fw-bold mb-3">Ulasan Terpercaya</h4>
                <p className="text-muted">
                  Dapatkan insight dari pengalaman nyata pengunjung lain untuk membantu perencanaan perjalanan Anda.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card text-center p-4 h-100 bg-white rounded-3 shadow-sm">
                <div className="feature-icon mb-3">
                  <i className="bi bi-heart-fill text-danger" style={{ fontSize: '3rem' }}></i>
                </div>
                <h4 className="fw-bold mb-3">Favorit Personal</h4>
                <p className="text-muted">
                  Simpan destinasi favorit Anda dan buat rencana perjalanan yang sempurna sesuai keinginan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-3">Destinasi Populer</h2>
              <p className="lead text-muted">
                Jelajahi destinasi wisata yang paling diminati dan dapatkan inspirasi untuk petualangan Anda selanjutnya.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/destinasi" className="btn btn-outline-primary btn-lg">
                Lihat Semua <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Memuat destinasi populer...</p>
            </div>
          ) : (
            <div className="row g-4">
              {destinasi.map((item, index) => (
                <div className="col-lg-4 col-md-6" key={item.id_destinasi}>
                  <div className="destination-card card border-0 shadow-sm h-100 overflow-hidden">
                    <div className="position-relative">
                      <img 
                        src={item.url_gambar || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'} 
                        className="card-img-top" 
                        alt={item.nama_destinasi} 
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge bg-primary px-3 py-2">
                          #{index + 1} Populer
                        </span>
                      </div>
                      <div className="card-overlay position-absolute bottom-0 start-0 w-100 p-3">
                        <div className="d-flex align-items-center text-white">
                          <i className="bi bi-geo-alt me-2"></i>
                          <small>Indonesia</small>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <h5 className="card-title fw-bold mb-2">{item.nama_destinasi}</h5>
                      <p className="card-text text-muted mb-3">
                        {item.deskripsi ? item.deskripsi.substring(0, 120) + '...' : 'Destinasi wisata yang menakjubkan dengan pemandangan indah dan pengalaman tak terlupakan.'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                          ))}
                          <small className="text-muted ms-1">(4.8)</small>
                        </div>
                        <Link 
                          to={`/destinasi/${item.id_destinasi}`} 
                          className="btn btn-primary btn-sm"
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

      {/* CTA Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container">
          <div className="row align-items-center text-white">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-3">Siap untuk Petualangan Berikutnya?</h2>
              <p className="lead mb-0">
                Bergabunglah dengan ribuan traveler lainnya dan mulai jelajahi keindahan Indonesia hari ini juga!
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <Link to="/register" className="btn btn-warning btn-lg px-4 py-3 fw-semibold">
                <i className="bi bi-person-plus me-2"></i>
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          position: relative;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .destination-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .destination-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        
        .feature-card {
          transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
        }
        
        .card-overlay {
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
        }
        
        .stat-item {
          padding: 1rem;
          border-radius: 0.5rem;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
};

export default Home;