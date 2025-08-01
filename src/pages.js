import HomePage from './pages/HomePage';
import RoomDetailPage from './pages/RoomDetailPage';
import PostRoomPage from './pages/PostRoomPage';
import AuthPage from './pages/AuthPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './admin/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

export const PAGES = {
  home: HomePage,
  detail: RoomDetailPage,
  post: PostRoomPage,
  auth: (props) => <AuthPage {...props} />,
  about: About,
  contact: Contact,
  profile: Profile,
  adminlogin: (props) => <AdminLoginPage {...props} />,
  admindashboard: (props) => <AdminDashboard {...props} />,
};



