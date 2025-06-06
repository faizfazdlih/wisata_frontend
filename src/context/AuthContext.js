import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Cek apakah ada user yang tersimpan di localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            // Set token untuk semua request axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        }
        setLoading(false);
    }, []);
    
    const login = async (email, kata_sandi) => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                kata_sandi
            });
            
            const user = response.data;
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Terjadi kesalahan saat login'
            };
        }
    };
    
    const register = async (nama, email, kata_sandi, konfirmasi_kata_sandi) => {
        try {
            await axios.post('http://localhost:5000/api/register', {
                nama,
                email,
                kata_sandi,
                konfirmasi_kata_sandi
            });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Terjadi kesalahan saat mendaftar'
            };
        }
    };
    
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };
    
    const updateProfile = async (userData) => {
        try {
            await axios.patch(`http://localhost:5000/api/pengguna/${currentUser.id_pengguna}`, userData);
            
            // Update user di state dan localStorage
            const updatedUser = { ...currentUser, ...userData };
            setCurrentUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil'
            };
        }
    };
    
    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};