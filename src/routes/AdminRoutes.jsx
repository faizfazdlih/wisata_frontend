import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminDashboard from '../components/admin/AdminDashboard';
import DestinasiList from '../components/admin/DestinasiList';
import DestinasiForm from '../components/admin/DestinasiForm';
import KategoriList from '../components/admin/KategoriList';
import KategoriForm from '../components/admin/KategoriForm';
import GambarList from '../components/admin/GambarList';
import GambarForm from '../components/admin/GambarForm';
import UlasanList from '../components/admin/UlasanList';
import PenggunaList from '../components/admin/PenggunaList';
import PenggunaForm from '../components/admin/PenggunaForm';

const AdminRoutes = () => {
  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          
          {/* Destinasi Routes */}
          <Route path="destinasi" element={<DestinasiList />} />
          <Route path="destinasi/tambah" element={<DestinasiForm />} />
          <Route path="destinasi/edit/:id" element={<DestinasiForm />} />
          
          {/* Kategori Routes */}
          <Route path="kategori" element={<KategoriList />} />
          <Route path="kategori/tambah" element={<KategoriForm />} />
          <Route path="kategori/edit/:id" element={<KategoriForm />} />
          
          {/* Gambar Routes */}
          <Route path="gambar" element={<GambarList />} />
          <Route path="gambar/tambah" element={<GambarForm />} />
          
          {/* Ulasan Routes */}
          <Route path="ulasan" element={<UlasanList />} />
          
          {/* Pengguna Routes */}
          <Route path="pengguna" element={<PenggunaList />} />
          <Route path="pengguna/tambah" element={<PenggunaForm />} />
          <Route path="pengguna/edit/:id" element={<PenggunaForm />} />
        </Routes>
      </div>
    </>
  );
};

export default AdminRoutes;