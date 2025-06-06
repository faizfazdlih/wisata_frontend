import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GambarList = () => {
    const [gambar, setGambar] = useState([]);
    const [destinasi, setDestinasi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filterDestinasi, setFilterDestinasi] = useState('');

    useEffect(() => {
        Promise.all([getGambar(), getDestinasi()]);
    }, []);

    const getGambar = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/gambar');
            setGambar(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching gambar:', error);
            setMessage('Gagal memuat data gambar');
            setLoading(false);
        }
    };

    const getDestinasi = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/destinasi');
            setDestinasi(response.data);
        } catch (error) {
            console.error('Error fetching destinasi:', error);
        }
    };

    const deleteGambar = async (id, keterangan) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus gambar "${keterangan || 'tanpa keterangan'}"?`)) {
            try {
                await axios.delete(`http://localhost:5000/api/gambar/${id}`);
                setMessage('Gambar berhasil dihapus');
                getGambar(); // Refresh data
                
                // Clear message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error('Error deleting gambar:', error);
                setMessage('Gagal menghapus gambar');
                setTimeout(() => setMessage(''), 3000);
            }
        }
    };

    // Filter gambar berdasarkan destinasi
    const filteredGambar = filterDestinasi 
        ? gambar.filter(item => item.id_destinasi === parseInt(filterDestinasi))
        : gambar;

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Kelola Gambar Destinasi</h2>
                <Link to="/admin/gambar/tambah" className="btn btn-primary">
                    <i className="bi bi-plus-circle"></i> Tambah Gambar
                </Link>
            </div>

            {message && (
                <div className={`alert ${message.includes('berhasil') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                </div>
            )}

            {/* Filter */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <label htmlFor="filterDestinasi" className="form-label">Filter berdasarkan Destinasi:</label>
                            <select
                                id="filterDestinasi"
                                className="form-select"
                                value={filterDestinasi}
                                onChange={(e) => setFilterDestinasi(e.target.value)}
                            >
                                <option value="">Semua Destinasi</option>
                                {destinasi.map(dest => (
                                    <option key={dest.id_destinasi} value={dest.id_destinasi}>
                                        {dest.nama_destinasi}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mt-3 mt-md-0">
                            <div className="text-muted">
                                Menampilkan {filteredGambar.length} dari {gambar.length} gambar
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    {filteredGambar.length === 0 ? (
                        <div className="text-center py-4">
                            <i className="bi bi-image display-1 text-muted"></i>
                            <p className="text-muted mt-3">
                                {filterDestinasi ? 'Tidak ada gambar untuk destinasi yang dipilih' : 'Belum ada gambar tersedia'}
                            </p>
                            <Link to="/admin/gambar/tambah" className="btn btn-primary">
                                Tambah Gambar Pertama
                            </Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>No</th>
                                        <th>Preview</th>
                                        <th>Destinasi</th>
                                        <th>Keterangan</th>
                                        <th>URL</th>
                                        <th width="120">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGambar.map((item, index) => (
                                        <tr key={item.id_gambar}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div style={{ width: '80px', height: '60px', overflow: 'hidden', borderRadius: '8px' }}>
                                                    <img
                                                        src={item.url_gambar}
                                                        alt={item.keterangan || 'Gambar destinasi'}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <strong>
                                                    {item.destinasi ? item.destinasi.nama_destinasi : 'Destinasi tidak ditemukan'}
                                                </strong>
                                            </td>
                                            <td>
                                                {item.keterangan ? (
                                                    item.keterangan.length > 50 
                                                        ? `${item.keterangan.substring(0, 50)}...`
                                                        : item.keterangan
                                                ) : (
                                                    <span className="text-muted">Tidak ada keterangan</span>
                                                )}
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {item.url_gambar.length > 30 
                                                        ? `${item.url_gambar.substring(0, 30)}...`
                                                        : item.url_gambar
                                                    }
                                                </small>
                                                <br />
                                                <a 
                                                    href={item.url_gambar} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary mt-1"
                                                >
                                                    <i className="bi bi-eye"></i> Lihat
                                                </a>
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => deleteGambar(item.id_gambar, item.keterangan)}
                                                    className="btn btn-sm btn-danger"
                                                    title="Hapus"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-3">
                <Link to="/dashboard" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Kembali ke Dashboard
                </Link>
            </div>
        </div>
    );
};

export default GambarList;