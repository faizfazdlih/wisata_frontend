// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/destinasi';

// // Fungsi utilitas untuk mendapatkan token dari localStorage
// const getAuthConfig = () => {
//   const token = localStorage.getItem('token');
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// // Ambil semua destinasi (public)
// export const getAllDestinasi = async () => {
//   const res = await axios.get(API_URL);
//   return res.data;
// };

// // Ambil destinasi berdasarkan ID (public)
// export const getDestinasiById = async (id) => {
//   const res = await axios.get(`${API_URL}/${id}`);
//   return res.data;
// };

// // Create destinasi (admin)
// export const createDestinasi = async (data) => {
//   const config = getAuthConfig();
//   const res = await axios.post(API_URL, data, config);
//   return res.data;
// };

// // Update destinasi (admin)
// export const updateDestinasi = async (id, data) => {
//   const config = getAuthConfig();
//   const res = await axios.put(`${API_URL}/${id}`, data, config);
//   return res.data;
// };

// // Hapus destinasi (admin)
// export const deleteDestinasi = async (id) => {
//   const config = getAuthConfig();
//   const res = await axios.delete(`${API_URL}/${id}`, config);
//   return res.data;
// };
