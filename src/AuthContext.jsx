import React, { createContext, useState, useEffect } from 'react';
import api from './api';
import { supabase } from './supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);

        // Listen for Supabase Auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                const currentToken = localStorage.getItem('token');
                if (!currentToken) {
                    try {
                        const res = await api.post('/auth/sync', { access_token: session.access_token });
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('user', JSON.stringify(res.data.user));
                        setUser(res.data.user);
                    } catch (err) {
                        console.error('Failed to sync user with backend:', err);
                        supabase.auth.signOut();
                    }
                }
            } else if (event === 'SIGNED_OUT') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // backend sync handled by onAuthStateChange
        return data.user;
    };

    const register = async (email, password, name, role, phone, city) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, role, phone, city }
            }
        });
        if (error) throw error;
        // backend sync handled by onAuthStateChange
        return data.user;
    };

    const updateUser = (updatedFields) => {
        const newUser = { ...user, ...updatedFields };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
