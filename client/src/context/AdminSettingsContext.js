import React, { createContext, useContext, useState, useEffect } from 'react';


import { getAdminSettings } from '../api';

const AdminSettingsContext = createContext();

export function AdminSettingsProvider({ children }) {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAdminSettings();
            setSettings(data);
        } catch (err) {
            setError(err.message);
            // Use default settings if API fails
            setSettings({
                maintenanceMode: false,
                maintenanceMessage: 'Site is under maintenance. Please check back later.',
                allowNewRegistrations: true,
                allowRoomPosting: true,
                allowReviews: true,
                allowContactHost: true,
                showFeaturedProperties: true,
                showPopularCities: true,
                showTestimonials: true,
                showWhyChooseUs: true,
                showMapView: true,
                autoApproveRooms: false,
                requireRoomApproval: true,
                maxImagesPerRoom: 10,
                maxPrice: 10000,
                minPrice: 0,
                allowGuestBrowsing: true,
                requireLoginForContact: false,
                welcomeMessage: 'Welcome to Room Finder!',
                footerMessage: '© 2024 Room Finder. All rights reserved.'
            });
        } finally {
            setLoading(false);
        }
    };

    const refreshSettings = () => {
        loadSettings();
    };

    const value = {
        settings,
        loading,
        error,
        refreshSettings
    };

    return (
        <AdminSettingsContext.Provider value={value}>
            {children}
        </AdminSettingsContext.Provider>
    );
}

export function useAdminSettings() {
    const context = useContext(AdminSettingsContext);
    if (!context) {
        throw new Error('useAdminSettings must be used within an AdminSettingsProvider');
    }
    return context;
} 