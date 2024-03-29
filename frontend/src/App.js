import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import MagazinePage from './pages/Magazine';
import SubscriptionPage from './pages/Subscription';
import LogoutPage from './pages/Logout';

function App() {
  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
     <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/magazine" element={<MagazinePage/>} />
            <Route path="/subscription" element={<SubscriptionPage/>} />
            <Route path="/logout" element={<LogoutPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  </div>
  );
}

export default App;