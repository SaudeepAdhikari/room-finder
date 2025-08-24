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
export * from './admin/AdminAuthContext.js';
export * from './admin/AdminUserContext.js';

// --- Standalone CRA bootstrap -------------------------------------------------
// The CRA standalone app will import this file. When running the standalone app
// we want to mount the React app into #root. We provide mountStandalone() so the
// CRA entrypoint can call it. We also attempt a safe auto-mount when running in
// a browser with the `__ADMIN_STANDALONE__` flag set (set by CRA start).

export async function mountStandalone(containerId = 'root') {
	// dynamic import to avoid pulling react-dom into the client bundle when used
	// as a library for the main client app.
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
if (typeof window !== 'undefined' && window.__ADMIN_STANDALONE__ === true) {
	// best-effort mount; ignore errors to keep library usage unaffected
	mountStandalone().catch(() => {});
}
