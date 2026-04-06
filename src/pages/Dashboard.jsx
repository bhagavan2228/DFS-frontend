import { Navigate } from 'react-router-dom';

/** Kept for bookmarks; main list lives at /discussions */
const Dashboard = () => <Navigate to="/discussions" replace />;

export default Dashboard;
