import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const KategoriForm = () => {
    const [formData, setFormData] = useState({
        nama_kategori: '',
        deskripsi: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            getKategoriById(id);
        }
    }, [id]);

    const getKategoriById = async (kategoriId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/kategori/${kategoriId}`);
            if (response.data) {
                setFormData({
                    nama_kategori: response.data.nama_kategori || '',
                    deskripsi: response.data.deskripsi || ''
                });
            }
        } catch (error) {
            console.error('Error fetching kategori:', error);
            setError('Gagal memuat data kategori');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi
        if (!formData.nama_kategori.trim()) {
            setError('Nama kategori harus diisi');
            return;
        }

        if (formData.nama_kategori.length > 100) {
            setError('Nama kategori maksimal 100 karakter');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await axios.patch(`http://localhost:5000/api/kategori/${id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/kategori', formData);
            }
            
            navigate('/admin/kategori', { 
                state: { 
                    message: `Kategori berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}` 
                } 
            });
        } catch (error) {
            console.error('Error saving kategori:', error);
            setError(error.response?.data?.message || `Gagal ${isEdit ? 'memperbarui' : 'menambahkan'} kategori`);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (isEdit) {
            getKategoriById(id);
        } else {
            setFormData({
                nama_kategori: '',
                deskripsi: ''
            });
        }
        setError('');
    };

    if (loading && isEdit) {
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
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">
                                {isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                            </h4>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nama_kategori" className="form-label">
                                        Nama Kategori <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nama_kategori"
                                        name="nama_kategori"
                                        value={formData.nama_kategori}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nama kategori"
                                        maxLength="100"
                                        required
                                    />
                                    <div className="form-text">
                                        {formData.nama_kategori.length}/100 karakter
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="deskripsi" className="form-label">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="deskripsi"
                                        name="deskripsi"
                                        rows="4"
                                        value={formData.deskripsi}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan deskripsi kategori (opsional)"
                                    />
                                    <div className="form-text">
                                        Deskripsi kategori untuk memberikan informasi lebih detail
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                {isEdit ? 'Memperbarui...' : 'Menyimpan...'}
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                {isEdit ? 'Perbarui Kategori' : 'Simpan Kategori'}
                                            </>
                                        )}
                                    </button>
                                    
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={handleReset}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-arrow-clockwise me-2"></i>
                                        Reset
                                    </button>
                                    
                                    <Link 
                                        to="/admin/kategori" 
                                        className="btn btn-outline-secondary"
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Kembali
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KategoriForm;