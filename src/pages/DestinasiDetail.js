import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DestinasiDetail = () => {
  const [destinasi, setDestinasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ulasan, setUlasan] = useState([]);
  const [newUlasan, setNewUlasan] = useState({
    penilaian: 5,
    komentar: ''
  });
  const { id } = useParams();

  useEffect(() => {
    getDestinasiById();
    getUlasan();
  }, []);

  const getDestinasiById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/destinasi/${id}`);
      setDestinasi(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getUlasan = async () => {
    try {
      // Implementasi API untuk mendapatkan ulasan berdasarkan id_destinasi
      // Untuk sementara, gunakan data dummy
      setUlasan([
        { id_ulasan: 1, nama: 'John Doe', penilaian: 5, komentar: 'Tempat yang sangat indah!', tanggal_ulasan: '2023-06-15' },
        { id_ulasan: 2, nama: 'Jane Smith', penilaian: 4, komentar: 'Pemandangan bagus, tapi agak ramai.', tanggal_ulasan: '2023-06-10' }
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUlasan({
      ...newUlasan,
      [name]: value
    });
  };

  const submitUlasan = async (e) => {
    e.preventDefault();
    // Implementasi API untuk mengirim ulasan
    alert('Fitur ulasan belum diimplementasikan');
    // Reset form
    setNewUlasan({
      penilaian: 5,
      komentar: ''
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!destinasi) {
    return <p>Destinasi tidak ditemukan</p>;
  }

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-6">
          <img 
            src={destinasi.url_gambar || 'https://via.placeholder.com/600x400'} 
            className="img-fluid rounded" 
            alt={destinasi.nama_destinasi} 
          />
        </div>
        <div className="col-md-6">
          <h2>{destinasi.nama_destinasi}</h2>
          <p className="text-muted">
            Kategori: {destinasi.kategori ? destinasi.kategori.nama_kategori : 'Tidak ada kategori'}
          </p>
          <p>{destinasi.deskripsi}</p>
          <div className="mb-3">
            <strong>Lokasi:</strong> {destinasi.lokasi}
          </div>
          <div className="mb-3">
            <strong>Jam Buka:</strong> {destinasi.jam_buka}
          </div>
          <div className="mb-3">
            <strong>Harga Tiket:</strong> {destinasi.harga_tiket}
          </div>
          <button className="btn btn-outline-primary me-2">
            <i className="bi bi-heart"></i> Tambah ke Favorit
          </button>
          <button className="btn btn-outline-secondary">
            <i className="bi bi-share"></i> Bagikan
          </button>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <h3>Ulasan</h3>
          <hr />
        </div>
      </div>

      {ulasan.length > 0 ? (
        ulasan.map((item) => (
          <div className="card mb-3" key={item.id_ulasan}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">{item.nama}</h5>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`bi ${i < item.penilaian ? 'bi-star-fill' : 'bi-star'} text-warning`}
                    ></i>
                  ))}
                </div>
              </div>
              <p className="card-text">{item.komentar}</p>
              <p className="card-text">
                <small className="text-muted">
                  {new Date(item.tanggal_ulasan).toLocaleDateString()}
                </small>
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>Belum ada ulasan untuk destinasi ini.</p>
      )}

      <div className="card mt-4">
        <div className="card-header">
          Tambahkan Ulasan
        </div>
        <div className="card-body">
          <form onSubmit={submitUlasan}>
            <div className="mb-3">
              <label className="form-label">Penilaian</label>
              <select 
                className="form-select" 
                name="penilaian" 
                value={newUlasan.penilaian}
                onChange={handleInputChange}
              >
                <option value="5">5 - Sangat Bagus</option>
                <option value="4">4 - Bagus</option>
                <option value="3">3 - Cukup</option>
                <option value="2">2 - Kurang</option>
                <option value="1">1 - Sangat Kurang</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Komentar</label>
              <textarea 
                className="form-control" 
                name="komentar" 
                rows="3" 
                value={newUlasan.komentar}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Kirim Ulasan</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DestinasiDetail;