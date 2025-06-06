import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DestinasiList = () => {
  const [destinasi, setDestinasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDestinasi();
  }, []);

  const fetchDestinasi = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/destinasi');
      setDestinasi(res.data);
    } catch (err) {
      console.error('Error fetch destinasi:', err);
      setError('Gagal memuat data destinasi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus destinasi "${nama}"?`)) {
      try {
        const user = localStorage.getItem('user');
        let token = null;
        
        if (user) {
          const userData = JSON.parse(user);
          token = userData.token;
        } else {
          token = localStorage.getItem('token');
        }

        if (!token) {
          alert('Anda harus login untuk melakukan aksi ini');
          return;
        }

        await axios.delete(`http://localhost:5000/api/destinasi/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        alert('Destinasi berhasil dihapus');
        fetchDestinasi(); // Refresh data
      } catch (err) {
        console.error('Error delete destinasi:', err);
        if (err.response?.status === 403) {
          alert('Akses ditolak. Pastikan Anda login sebagai admin.');
        } else {
          alert('Gagal menghapus destinasi');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Kelola Destinasi</h2>
        <Link to="/admin/destinasi/tambah" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Tambah Destinasi
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {destinasi.length === 0 ? (
        <div className="alert alert-info">
          Belum ada destinasi yang terdaftar.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Destinasi</th>
                <th>Kategori</th>
                <th>Lokasi</th>
                <th>Harga Tiket</th>
                <th>Jam Buka</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {destinasi.map((item, index) => (
                <tr key={item.id_destinasi}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {item.url_gambar && (
                        <img 
                          src={item.url_gambar} 
                          alt={item.nama_destinasi}
                          className="rounded me-2"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <strong>{item.nama_destinasi}</strong>
                        <br />
                        <small className="text-muted">
                          {item.deskripsi?.length > 100 
                            ? item.deskripsi.substring(0, 100) + '...' 
                            : item.deskripsi}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-secondary">
                      {item.Kategori ? item.Kategori.nama_kategori : 'Tidak ada kategori'}
                    </span>
                  </td>
                  <td>{item.lokasi}</td>
                  <td>{item.harga_tiket || '-'}</td>
                  <td>{item.jam_buka || '-'}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link 
                        to={`/admin/destinasi/edit/${item.id_destinasi}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button 
                        onClick={() => handleDelete(item.id_destinasi, item.nama_destinasi)}
                        className="btn btn-sm btn-outline-danger"
                        title="Hapus"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DestinasiList;