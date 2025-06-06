import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const KategoriList = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKategori();
  }, []);

  const getKategori = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kategori');
      setKategori(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Kategori Wisata</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {kategori.length > 0 ? (
            kategori.map((item) => (
              <div className="col-md-4 mb-4" key={item.id_kategori}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{item.nama_kategori}</h5>
                    <p className="card-text">{item.deskripsi}</p>
                    <Link 
                      to={`/destinasi?kategori=${item.id_kategori}`} 
                      className="btn btn-primary"
                    >
                      Lihat Destinasi
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>Tidak ada kategori yang ditemukan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KategoriList;