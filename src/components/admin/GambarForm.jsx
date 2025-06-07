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
    const [message, setMessage] = useState({ text: '', type: '' });
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
            setMessage({ text: 'Gagal memuat data destinasi', type: 'error' });
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
            setMessage({ text: 'Destinasi harus dipilih', type: 'error' });
            return;
        }

        if (!formData.url_gambar.trim()) {
            setMessage({ text: 'URL gambar harus diisi', type: 'error' });
            return;
        }

        // Validasi URL
        try {
            new URL(formData.url_gambar);
        } catch {
            setMessage({ text: 'URL gambar tidak valid', type: 'error' });
            return;
        }

        if (formData.keterangan.length > 255) {
            setMessage({ text: 'Keterangan maksimal 255 karakter', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

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
            setMessage({ 
                text: error.response?.data?.message || 'Gagal menambahkan gambar', 
                type: 'error' 
            });
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
        setMessage({ text: '', type: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tambah Gambar Destinasi</h1>
                        <p className="text-gray-600">Menambahkan gambar untuk destinasi wisata</p>
                    </div>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 'bg-green-50 text-green-800 border-l-4 border-green-500'}`}>
                        <div className="flex items-center">
                            <i className={`mr-2 ${message.type === 'error' ? 'fa-solid fa-circle-exclamation text-red-500' : 'fa-solid fa-check-circle text-green-500'}`}></i>
                            <span>{message.text}</span>
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="bg-nature-500 text-white px-6 py-4">
                        <h2 className="text-lg font-semibold flex items-center">
                            <i className="fa-solid fa-image mr-2"></i>
                            Form Gambar Destinasi
                        </h2>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Destinasi Select */}
                            <div>
                                <label htmlFor="id_destinasi" className="block text-sm font-medium text-gray-700 mb-2">
                                    Destinasi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
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

                            {/* URL Gambar */}
                            <div>
                                <label htmlFor="url_gambar" className="block text-sm font-medium text-gray-700 mb-2">
                                    URL Gambar <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
                                    id="url_gambar"
                                    name="url_gambar"
                                    value={formData.url_gambar}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                    maxLength="255"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Masukkan URL gambar yang valid (maksimal 255 karakter)
                                </p>
                            </div>

                            {/* Preview Gambar */}
                            {imagePreview && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview Gambar:</label>
                                    <div className="border border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                                        {!imageError ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-w-full max-h-72 mx-auto object-contain rounded-lg shadow-sm"
                                                onError={handleImageError}
                                            />
                                        ) : (
                                            <div className="text-red-500 py-8">
                                                <i className="fa-solid fa-triangle-exclamation text-4xl mb-3"></i>
                                                <p className="text-sm">Gambar tidak dapat dimuat. Periksa kembali URL.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Keterangan */}
                            <div>
                                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
                                    Keterangan
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
                                    id="keterangan"
                                    name="keterangan"
                                    rows="3"
                                    value={formData.keterangan}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan keterangan gambar (opsional)"
                                    maxLength="255"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {formData.keterangan.length}/255 karakter
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                <button 
                                    type="submit" 
                                    className="inline-flex items-center justify-center px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    disabled={loading || imageError}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-check mr-2"></i>
                                            Simpan Gambar
                                        </>
                                    )}
                                </button>
                                
                                <button 
                                    type="button" 
                                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-300"
                                    onClick={handleReset}
                                    disabled={loading}
                                >
                                    <i className="fa-solid fa-rotate-right mr-2"></i>
                                    Reset
                                </button>
                                
                                <Link 
                                    to="/admin/gambar" 
                                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300 no-underline"
                                >
                                    <i className="fa-solid fa-arrow-left mr-2"></i>
                                    Kembali
                                </Link>
                            </div>
                        </form>

                        {/* Tips Section */}
                        <div className="mt-6 p-4 bg-nature-50 rounded-lg border border-nature-200">
                            <h3 className="text-sm font-semibold text-nature-800 mb-2 flex items-center">
                                <i className="fa-solid fa-lightbulb text-nature-600 mr-2"></i>
                                Tips Menambahkan Gambar:
                            </h3>
                            <ul className="text-sm text-nature-700 space-y-1">
                                <li>• Gunakan URL gambar yang dapat diakses publik</li>
                                <li>• Pastikan gambar berkualitas baik dan relevan dengan destinasi</li>
                                <li>• Berikan keterangan yang deskriptif untuk gambar</li>
                                <li>• Gunakan format gambar yang umum (JPG, PNG, WebP)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Back to Dashboard */}
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/admin')}
                        className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-all duration-300"
                    >
                        <i className="fa-solid fa-arrow-left mr-2"></i>
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GambarForm;