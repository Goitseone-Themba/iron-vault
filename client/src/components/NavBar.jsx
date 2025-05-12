import { LogOut } from 'lucide-react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import HealthIndicator from './HealthIndicator';
import { Shield } from 'lucide-react';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <span className="font-semibold text-xl text-gray-800">IronVault</span>
          </div>
          <div className="flex items-center space-x-4">
            <HealthIndicator />
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;