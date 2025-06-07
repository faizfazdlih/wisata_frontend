import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GambarList = () => {
    const [gambar, setGambar] = useState([]);
    const [destinasi, setDestinasi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [filterDestinasi, setFilterDestinasi] = useState('');
    const navigate = useNavigate();

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
            setMessage({ text: 'Gagal memuat data gambar', type: 'error' });
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
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    setMessage({ text: 'Anda harus login untuk melakukan aksi ini', type: 'error' });
                    return;
                }
                
                const user = JSON.parse(storedUser);
                const token = user.token;
                
                await axios.delete(`http://localhost:5000/api/gambar/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                setMessage({ text: 'Gambar berhasil dihapus', type: 'success' });
                getGambar();
                
                // Clear message after 3 seconds
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } catch (error) {
                console.error('Error deleting gambar:', error);
                setMessage({ text: 'Gagal menghapus gambar', type: 'error' });
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            }
        }
    };

    // Filter gambar berdasarkan destinasi
    const filteredGambar = filterDestinasi 
        ? gambar.filter(item => item.id_destinasi === parseInt(filterDestinasi))
        : gambar;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-nature-200 border-t-nature-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Gambar Destinasi</h1>
                        <p className="text-gray-600">Manajemen gambar untuk destinasi wisata</p>
                    </div>
                    <Link 
                        to="/admin/gambar/tambah" 
                        className="no-underline mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105"
                    >
                        <i className="fa-solid fa-plus mr-2"></i>
                        Tambah Gambar
                    </Link>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 'bg-green-50 text-green-800 border-l-4 border-green-500'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <i className={`mr-2 ${message.type === 'error' ? 'fa-solid fa-circle-exclamation text-red-500' : 'fa-solid fa-check-circle text-green-500'}`}></i>
                                <span>{message.text}</span>
                            </div>
                            <button 
                                onClick={() => setMessage({ text: '', type: '' })}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* Filter Card */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
                    <div className="bg-nature-500 text-white px-6 py-3">
                        <h2 className="text-lg font-semibold flex items-center">
                            <i className="fa-solid fa-filter mr-2"></i>
                            Filter Gambar
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                                <label htmlFor="filterDestinasi" className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter berdasarkan Destinasi:
                                </label>
                                <select
                                    id="filterDestinasi"
                                    className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nature-500 focus:border-nature-500 transition-colors duration-200"
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
                            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                Menampilkan <span className="font-semibold text-nature-600">{filteredGambar.length}</span> dari <span className="font-semibold">{gambar.length}</span> gambar
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {filteredGambar.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-nature-100 rounded-full flex items-center justify-center mb-4">
                            <i className="fa-solid fa-image text-nature-500 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {filterDestinasi ? 'Tidak ada gambar untuk destinasi yang dipilih' : 'Belum ada gambar'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {filterDestinasi 
                                ? 'Coba pilih destinasi lain atau tambahkan gambar untuk destinasi ini.'
                                : 'Mulai dengan menambahkan gambar untuk destinasi wisata Anda.'
                            }
                        </p>
                        <Link 
                            to="/admin/gambar/tambah" 
                            className="inline-flex items-center px-4 py-2 bg-nature-500 hover:bg-nature-600 text-white font-medium rounded-lg shadow-sm transition-all duration-300 no-underline"
                        >
                            <i className="fa-solid fa-plus mr-2"></i>
                            Tambah Gambar
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-nature-500 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Preview</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Destinasi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Keterangan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">URL</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredGambar.map((item, index) => (
                                        <tr key={item.id_gambar} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{index + 1}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-20 h-16 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                                                    <img
                                                        src={item.url_gambar}
                                                        alt={item.keterangan || 'Gambar destinasi'}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/80x64/e5e7eb/6b7280?text=No+Image';
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.destinasi ? item.destinasi.nama_destinasi : 'Destinasi tidak ditemukan'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-xs">
                                                    {item.keterangan ? (
                                                        item.keterangan.length > 50 
                                                            ? `${item.keterangan.substring(0, 50)}...`
                                                            : item.keterangan
                                                    ) : (
                                                        <span className="italic text-gray-400">Tidak ada keterangan</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-500 max-w-xs break-all mb-2">
                                                    {item.url_gambar.length > 40 
                                                        ? `${item.url_gambar.substring(0, 40)}...`
                                                        : item.url_gambar
                                                    }
                                                </div>
                                                <a 
                                                    href={item.url_gambar} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium rounded transition-colors duration-200 no-underline"
                                                >
                                                    <i className="fa-solid fa-eye mr-1"></i>
                                                    Lihat
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button 
                                                    onClick={() => deleteGambar(item.id_gambar, item.keterangan)}
                                                    className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 hover:bg-red-50 rounded"
                                                    title="Hapus"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Total: {filteredGambar.length} gambar ditampilkan
                            </div>
                        </div>
                    </div>
                )}
                
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

export default GambarList;