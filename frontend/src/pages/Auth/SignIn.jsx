import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { publicClient } from '../../constants/axiosInstance';
import { authActions } from '../../store/reducers/authReducer';

const SignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const identifier = e.target.identifier.value;
      const password = e.target.password.value;
  
      const response = await publicClient.post('/auth/login', {
        identifier,
        password,
      });
  
      const { user, modules, tokenId, refreshTokenId } = response.data.data;
      console.log('response',response.data);
      console.log('tokenId',tokenId)
  
      if (response.data.status===200) {
        localStorage.setItem('accessToken', tokenId);
        localStorage.setItem('refreshToken', refreshTokenId);
  
        dispatch(authActions.signin({ user, modules, accessToken: tokenId, refreshToken: refreshTokenId }));
  
        alert('Sign in successful!');
        navigate('/dashboard'); 
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Failed to sign in:', error);
  
      if (error.response) {
        console.error('Error Response:', error.response.data.message || error.response.data);
        alert(error.response.data.message || 'An error occurred. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from the server. Please check your connection.');
      } else {
        console.error('Error:', error.message);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };
  


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="identifier"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;