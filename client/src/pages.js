
import HomePage from './pages/HomePage';
import RoomDetailPage from './pages/RoomDetailPage';
import PostRoomPage from './pages/PostRoomPage';
import AuthPage from './pages/AuthPage';
import AdminLoginPage from './pages/AdminLoginPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AllListings from './pages/AllListings';

export const PAGES = {
  Home: HomePage,
  Detail: RoomDetailPage,
  Post: PostRoomPage,
  Auth: (props) => <AuthPage {...props} />,
  About: About,
  Contact: Contact,
  Profile: Profile,
  AllListings: AllListings,
  AdminLogin: (props) => <AdminLoginPage {...props} />,
};



