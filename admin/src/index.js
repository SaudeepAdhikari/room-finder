// Re-export admin modules for use by the client app
export { default as AdminDashboard } from './admin/AdminDashboard.js';
export { default as AdminLayout } from './admin/AdminLayout.js';
export { default as AdminDashboardPage } from './admin/AdminDashboardPage.js';
export { default as AdminRoomsPage } from './admin/AdminRoomsPage.js';
export { default as AdminUsersPage } from './admin/AdminUsersPage.js';
export { default as AdminBookingsPage } from './admin/AdminBookingsPage.js';
export { default as AdminReviewsPage } from './admin/AdminReviewsPage.js';
export { default as AdminSettingsPage } from './admin/AdminSettingsPage.js';
export { default as AdminAnalyticsPage } from './admin/AdminAnalyticsPage.js';
export { default as AdminLogin } from './admin/AdminLogin.js';
export * from './admin/AdminAuthContext.js';
export * from './admin/AdminUserContext.js';



export async function mountStandalone(containerId = 'root') {

	const React = await import('react');
	const ReactDOMClient = await import('react-dom/client');
		const App = (await import('./App.jsx')).default;

	const container = document.getElementById(containerId);
	if (!container) {
		throw new Error(`Container #${containerId} not found`);
	}

	const root = ReactDOMClient.createRoot(container);
	root.render(
		React.createElement(React.StrictMode, null, React.createElement(App))
	);
}

// Auto-mount when the global flag is present (set REACT_APP_STANDALONE=true in CRA)
// Auto-mount when running the admin app in development (CRA) or when the
// explicit global standalone flag is present. This keeps the module usable
// as a library while allowing `npm start` (CRA) to render the admin UI.
if (typeof window !== 'undefined' && (window.__ADMIN_STANDALONE__ === true || process.env.NODE_ENV === 'development')) {
	// best-effort mount; ignore errors to keep library usage unaffected
	mountStandalone().catch(() => {});
}
