// AdminSettingsContext retired. Provide minimal safe API so imports don't fail.

import React, { createContext, useContext } from 'react';

const AdminSettingsContext = createContext({ settings: null, loading: false, error: null, refreshSettings: () => {} });

export function AdminSettingsProvider({ children }) {
    return (
        <AdminSettingsContext.Provider value={{ settings: null, loading: false, error: null, refreshSettings: () => {} }}>
            {children}
        </AdminSettingsContext.Provider>
    );
}

export function useAdminSettings() {
    return useContext(AdminSettingsContext);
}