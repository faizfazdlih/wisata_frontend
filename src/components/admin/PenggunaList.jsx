import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PenggunaList = () => {
  const [pengguna, setPengguna] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data pengguna
  const fetchPengguna = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError('Token tidak ditemukan');
        return;
      }
      
      const user = JSON.parse(storedUser);
      const token = user.token;
      
      const response = await axios.get('http://localhost:5000/api/pengguna', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPengguna(response.data);
    } catch (error) {
      setError('Gagal memuat data pengguna');
      console.error('Error fetching pengguna:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hapus pengguna
  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${nama}"?`)) {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          alert('Token tidak ditemukan');
          return;
        }
        
        const user = JSON.parse(storedUser);
        const token = user.token;
        
        await axios.delete(`http://localhost:5000/api/pengguna/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Refresh data setelah hapus
        fetchPengguna();
        alert('Pengguna berhasil dihapus');
      } catch (error) {
        console.error('Error deleting pengguna:', error);
        alert('Gagal menghapus pengguna');
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

  // Get badge class untuk peran
  const getBadgeClass = (peran) => {
    return peran === 'admin' ? 'bg-danger' : 'bg-primary';
  };

  useEffect(() => {
    fetchPengguna();
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
            <h2>Kelola Pengguna</h2>
            <Link to="/admin/pengguna/tambah" className="btn btn-primary">
              <i className="fas fa-plus"></i> Tambah Pengguna
            </Link>
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
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Peran</th>
                      <th>Tanggal Dibuat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengguna.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Tidak ada data pengguna
                        </td>
                      </tr>
                    ) : (
                      pengguna.map((item) => (
                        <tr key={item.id_pengguna}>
                          <td>{item.id_pengguna}</td>
                          <td>
                            <strong>{item.nama}</strong>
                          </td>
                          <td>{item.email}</td>
                          <td>
                            <span className={`badge ${getBadgeClass(item.peran)}`}>
                              {item.peran.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <small>{formatDate(item.tanggal_dibuat)}</small>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/admin/pengguna/edit/${item.id_pengguna}`}
                                className="btn btn-warning btn-sm"
                                title="Edit pengguna"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(item.id_pengguna, item.nama)}
                                title="Hapus pengguna"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {pengguna.length > 0 && (
            <div className="mt-3">
              <small className="text-muted">
                Total: {pengguna.length} pengguna
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PenggunaList;