import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DestinasiList = () => {
  const [destinasi, setDestinasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategori, setKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getDestinasi();
    getKategori();
  }, []);

  const getDestinasi = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/destinasi');
      setDestinasi(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getKategori = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kategori');
      setKategori(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredDestinasi = destinasi.filter(item => {
    return (
      (selectedKategori === '' || item.id_kategori.toString() === selectedKategori) &&
      item.nama_destinasi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <h2 className="mb-4">Daftar Destinasi Wisata</h2>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Cari destinasi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select 
            className="form-select" 
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {kategori.map((item) => (
              <option key={item.id_kategori} value={item.id_kategori.toString()}>
                {item.nama_kategori}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {filteredDestinasi.length > 0 ? (
            filteredDestinasi.map((item) => (
              <div className="col-md-4 mb-4" key={item.id_destinasi}>
                <div className="card h-100">
                  <img 
                    src={item.url_gambar || 'https://via.placeholder.com/300x200'} 
                    className="card-img-top" 
                    alt={item.nama_destinasi} 
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.nama_destinasi}</h5>
                    <p className="card-text">{item.deskripsi.substring(0, 100)}...</p>
                    <p className="card-text">
                      <small className="text-muted">
                        Kategori: {item.kategori ? item.kategori.nama_kategori : 'Tidak ada kategori'}
                      </small>
                    </p>
                    <Link to={`/destinasi/${item.id_destinasi}`} className="btn btn-primary">Lihat Detail</Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>Tidak ada destinasi yang ditemukan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinasiList;