// src/components/Topbar.jsx
import React from 'react';
import { useLogout } from "../../constants/axiosInstance"; // Ensure the path is correct

export default function Topbar() {
    const logout = useLogout(); // Get the logout function

    return (
        <div className="bg-white shadow">
            <div className="flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Dashboard Title</h1>
                <div>
                    <button 
                        onClick={logout} // Call the logout function on button click
                        className="bg-indigo-600 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}