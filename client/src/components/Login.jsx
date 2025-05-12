import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = isSigningUp
        ? await supabase.auth.signUp({
            email,
            password,
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) throw error;
      if (!isSigningUp) {
        navigate('/');
      } else {
        setError('Account created! You can now sign in.');
        setIsSigningUp(false);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-rose-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">IronVault</h2>
          <p className="mt-2 text-sm text-gray-600">Loan Risk Assessment System</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {error && (
            <div className={`bg-${error.includes('created') ? 'green' : 'red'}-50 border-l-4 border-${error.includes('created') ? 'green' : 'red'}-500 p-4 mb-4`}>
              <div className="flex">
                <div className="ml-3">
                  <p className={`text-sm text-${error.includes('created') ? 'green' : 'red'}-700`}>{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                minLength={6}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-rose-400"
            >
              {loading ? 'Processing...' : (isSigningUp ? 'Sign up' : 'Sign in')}
            </button>
            
            <button
              type="button"
              onClick={() => setIsSigningUp(!isSigningUp)}
              className="text-sm text-rose-600 hover:text-rose-500"
            >
              {isSigningUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
