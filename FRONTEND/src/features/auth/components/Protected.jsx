import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading, user } = useAuth()

    if (loading) {
        // Updated to match your new sleek dark theme!
        return (
            <main className='loading-screen'>
                <div className="loader">Verifying session...</div>
            </main>
        )
    }

    if (!user) {
        return <Navigate to={'/login'} replace />
    }
    
    return children
}

export default Protected