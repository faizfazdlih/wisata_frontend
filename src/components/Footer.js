import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Katalog Wisata Lokal</h5>
            <p>Temukan destinasi wisata lokal terbaik di Indonesia</p>
          </div>
          <div className="col-md-3">
            <h5>Tautan</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Beranda</a></li>
              <li><a href="/destinasi" className="text-white">Destinasi</a></li>
              <li><a href="/kategori" className="text-white">Kategori</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Kontak</h5>
            <ul className="list-unstyled">
              <li>Email: info@katalogwisata.com</li>
              <li>Telepon: +62 123 4567 890</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-3">
          <p>&copy; {new Date().getFullYear()} Katalog Wisata Lokal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;