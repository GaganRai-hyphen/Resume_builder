import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth.context';
import { login, register, logout, getMe } from '../services/auth.api';

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            const data = await login(email, password);
            setUser(data.user);
        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try {
            const data = await register(username, email, password);
            setUser(data.user);
        } catch (error) {
            console.error("Register error:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleGetMe = async () => {
        setLoading(true);
        try {
            const data = await getMe();
            setUser(data.user);
        } catch (error) {
            console.error("GetMe error:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // The try...catch block must go INSIDE the async function
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (error) {
                console.error("Failed to fetch user on mount:", error.message);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);

    return { 
        user, setUser, 
        loading, setLoading, 
        handleLogin, handleRegister, 
        handleLogout, handleGetMe 
    };
};