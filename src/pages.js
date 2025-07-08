import HomePage from './HomePage';
import SearchPage from './SearchPage';
import RoomDetailPage from './RoomDetailPage';
import PostRoomPage from './PostRoomPage';
import AuthPage from './AuthPage';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboard from './AdminDashboard';

export const PAGES = {
  home: HomePage,
  search: SearchPage,
  detail: RoomDetailPage,
  post: PostRoomPage,
  auth: (props) => <AuthPage {...props} />,
  adminlogin: (props) => <AdminLoginPage {...props} />,
  admindashboard: (props) => <AdminDashboard {...props} />,
};
// Only use implemented keys: home, search, detail
