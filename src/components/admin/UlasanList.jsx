import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UlasanList = () => {
  const [ulasan, setUlasan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data ulasan
  const fetchUlasan = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/ulasan');
      setUlasan(response.data);
    } catch (error) {
      setError('Gagal memuat data ulasan');
      console.error('Error fetching ulasan:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hapus ulasan
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/ulasan/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Refresh data setelah hapus
        fetchUlasan();
        alert('Ulasan berhasil dihapus');
      } catch (error) {
        console.error('Error deleting ulasan:', error);
        alert('Gagal menghapus ulasan');
      }
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Render rating stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={i <= rating ? 'text-warning' : 'text-muted'}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    fetchUlasan();
  }, []);

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
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Kelola Ulasan</h2>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Pengguna</th>
                      <th>Destinasi</th>
                      <th>Rating</th>
                      <th>Komentar</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ulasan.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          Tidak ada data ulasan
                        </td>
                      </tr>
                    ) : (
                      ulasan.map((item) => (
                        <tr key={item.id_ulasan}>
                          <td>{item.id_ulasan}</td>
                          <td>
                            <div>
                              <strong>{item.pengguna?.nama || 'Unknown'}</strong>
                              <br />
                              <small className="text-muted">
                                ID: {item.id_pengguna}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{item.destinasi?.nama_destinasi || 'Unknown'}</strong>
                              <br />
                              <small className="text-muted">
                                ID: {item.id_destinasi}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="me-2">{renderStars(item.penilaian)}</span>
                              <span className="badge bg-primary">
                                {item.penilaian}/5
                              </span>
                            </div>
                          </td>
                          <td>
                            <div 
                              style={{ 
                                maxWidth: '300px', 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={item.komentar}
                            >
                              {item.komentar || '-'}
                            </div>
                          </td>
                          <td>
                            <small>{formatDate(item.tanggal_ulasan)}</small>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(item.id_ulasan)}
                              title="Hapus ulasan"
                            >
                              <i className="fas fa-trash"></i> Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {ulasan.length > 0 && (
            <div className="mt-3">
              <small className="text-muted">
                Total: {ulasan.length} ulasan
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UlasanList;