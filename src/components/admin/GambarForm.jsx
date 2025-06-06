import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const GambarForm = () => {
    const [formData, setFormData] = useState({
        id_destinasi: '',
        url_gambar: '',
        keterangan: ''
    });
    const [destinasi, setDestinasi] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [imageError, setImageError] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        getDestinasi();
    }, []);

    const getDestinasi = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/destinasi');
            setDestinasi(response.data);
        } catch (error) {
            console.error('Error fetching destinasi:', error);
            setError('Gagal memuat data destinasi');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Update preview gambar ketika URL berubah
        if (name === 'url_gambar') {
            setImagePreview(value);
            setImageError(false);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi
        if (!formData.id_destinasi) {
            setError('Destinasi harus dipilih');
            return;
        }

        if (!formData.url_gambar.trim()) {
            setError('URL gambar harus diisi');
            return;
        }

        // Validasi URL
        try {
            new URL(formData.url_gambar);
        } catch {
            setError('URL gambar tidak valid');
            return;
        }

        if (formData.keterangan.length > 255) {
            setError('Keterangan maksimal 255 karakter');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const dataToSend = {
                ...formData,
                id_destinasi: parseInt(formData.id_destinasi)
            };

            await axios.post('http://localhost:5000/api/gambar', dataToSend);
            
            navigate('/admin/gambar', { 
                state: { 
                    message: 'Gambar berhasil ditambahkan' 
                } 
            });
        } catch (error) {
            console.error('Error saving gambar:', error);
            setError(error.response?.data?.message || 'Gagal menambahkan gambar');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            id_destinasi: '',
            url_gambar: '',
            keterangan: ''
        });
        setImagePreview('');
        setImageError(false);
        setError('');
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Tambah Gambar Destinasi</h4>
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
                                    <label htmlFor="id_destinasi" className="form-label">
                                        Destinasi <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        id="id_destinasi"
                                        name="id_destinasi"
                                        value={formData.id_destinasi}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Pilih Destinasi</option>
                                        {destinasi.map(dest => (
                                            <option key={dest.id_destinasi} value={dest.id_destinasi}>
                                                {dest.nama_destinasi}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="url_gambar" className="form-label">
                                        URL Gambar <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        id="url_gambar"
                                        name="url_gambar"
                                        value={formData.url_gambar}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                        maxLength="255"
                                        required
                                    />
                                    <div className="form-text">
                                        Masukkan URL gambar yang valid (maksimal 255 karakter)
                                    </div>
                                </div>

                                {/* Preview Gambar */}
                                {imagePreview && (
                                    <div className="mb-3">
                                        <label className="form-label">Preview Gambar:</label>
                                        <div className="border rounded p-3 text-center">
                                            {!imageError ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '300px',
                                                        objectFit: 'contain'
                                                    }}
                                                    onError={handleImageError}
                                                />
                                            ) : (
                                                <div className="text-danger">
                                                    <i className="bi bi-exclamation-triangle display-4"></i>
                                                    <p className="mt-2">Gambar tidak dapat dimuat. Periksa kembali URL.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label htmlFor="keterangan" className="form-label">
                                        Keterangan
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="keterangan"
                                        name="keterangan"
                                        rows="3"
                                        value={formData.keterangan}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan keterangan gambar (opsional)"
                                        maxLength="255"
                                    />
                                    <div className="form-text">
                                        {formData.keterangan.length}/255 karakter
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading || imageError}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Simpan Gambar
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
                                        to="/admin/gambar" 
                                        className="btn btn-outline-secondary"
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Kembali
                                    </Link>
                                </div>
                            </form>

                            {/* Tips */}
                            <div className="mt-4 p-3 bg-light rounded">
                                <h6><i className="bi bi-lightbulb text-warning"></i> Tips:</h6>
                                <ul className="mb-0 small">
                                    <li>Gunakan URL gambar yang dapat diakses publik</li>
                                    <li>Pastikan gambar berkualitas baik dan relevan dengan destinasi</li>
                                    <li>Berikan keterangan yang deskriptif untuk gambar</li>
                                    <li>Gunakan format gambar yang umum (JPG, PNG, WebP)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GambarForm;