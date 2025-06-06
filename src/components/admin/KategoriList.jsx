import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const KategoriList = () => {
    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        getKategori();
    }, []);

    const getKategori = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/kategori');
            setKategori(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching kategori:', error);
            setMessage('Gagal memuat data kategori');
            setLoading(false);
        }
    };

    const deleteKategori = async (id, nama) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${nama}"?`)) {
            try {
                await axios.delete(`http://localhost:5000/api/kategori/${id}`);
                setMessage('Kategori berhasil dihapus');
                getKategori(); // Refresh data
                
                // Clear message after 3 seconds
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error('Error deleting kategori:', error);
                setMessage('Gagal menghapus kategori');
                setTimeout(() => setMessage(''), 3000);
            }
        }
    };

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
                <h2>Kelola Kategori</h2>
                <Link to="/admin/kategori/tambah" className="btn btn-primary">
                    <i className="bi bi-plus-circle"></i> Tambah Kategori
                </Link>
            </div>

            {message && (
                <div className={`alert ${message.includes('berhasil') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    {kategori.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-muted">Belum ada kategori tersedia</p>
                            <Link to="/admin/kategori/tambah" className="btn btn-primary">
                                Tambah Kategori Pertama
                            </Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>No</th>
                                        <th>Nama Kategori</th>
                                        <th>Deskripsi</th>
                                        <th width="200">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kategori.map((item, index) => (
                                        <tr key={item.id_kategori}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <strong>{item.nama_kategori}</strong>
                                            </td>
                                            <td>
                                                {item.deskripsi ? (
                                                    item.deskripsi.length > 100 
                                                        ? `${item.deskripsi.substring(0, 100)}...`
                                                        : item.deskripsi
                                                ) : (
                                                    <span className="text-muted">Tidak ada deskripsi</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <Link 
                                                        to={`/admin/kategori/edit/${item.id_kategori}`}
                                                        className="btn btn-sm btn-warning"
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </Link>
                                                    <button 
                                                        onClick={() => deleteKategori(item.id_kategori, item.nama_kategori)}
                                                        className="btn btn-sm btn-danger"
                                                        title="Hapus"
                                                    >
                                                        <i className="bi bi-trash"></i>
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
            </div>

            <div className="mt-3">
                <Link to="/dashboard" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Kembali ke Dashboard
                </Link>
            </div>
        </div>
    );
};

export default KategoriList;