// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { loginUser } from '../../services/authService';
// import Swal from 'sweetalert2';

// const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email || !password) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Validation Error',
//         text: 'Please fill in all fields',
//       });
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const response = await loginUser(email, password);
      
//       if (response.success && response.data && response.token) {
//         login(response.data, response.token);
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Login Failed',
//           text: response.error || 'Invalid email or password',
//         });
//       }
//     // } catch (error) {
//     //   Swal.fire({
//     //     icon: 'error',
//     //     title: 'Login Failed',
//     //     text: 'An unexpected error occurred. Please try again.',
//     //   });
//     // } 
//   } catch (error: any) {
//     const errorMessage =
//       error?.response?.data?.message || 'An unexpected error occurred. Please try again.';

//     Swal.fire({
//       icon: 'error',
//       title: 'Login Failed',
//       text: errorMessage,
//     });
//   }
//     finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">Welcome Back</h1>
      
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//             Email Address
//           </label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             placeholder="your@email.com"
//             required
//           />
//         </div>
        
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-1">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <a href="#" className="text-xs text-primary-600 hover:text-primary-800">
//               Forgot password?
//             </a>
//           </div>
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             placeholder="********"
//             required
//           />
//         </div>
        
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
//         >
//           {loading ? 'Signing In...' : 'Sign In'}
//         </button>
//       </form>
      
//       <div className="mt-6 text-center text-sm">
//         <span className="text-gray-600">Don't have an account? </span>
//         <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
//           Register here
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;




// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { loginUser } from '../../services/authService';
// import Swal from 'sweetalert2';
// import './auth.css'; // Import the CSS file we'll create

// const LoginPage: React.FC = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
//     const { login } = useAuth();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!email || !password) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Validation Error',
//                 text: 'Please fill in all fields',
//             });
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await loginUser(email, password);

//             if (response.success && response.data && response.token) {
//                 login(response.data, response.token);
//             } else {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Login Failed',
//                     text: response.error || 'Invalid email or password',
//                 });
//             }
//         } catch (error: any) {
//             const errorMessage =
//                 error?.response?.data?.message || 'An unexpected error occurred. Please try again.';

//             Swal.fire({
//                 icon: 'error',
//                 title: 'Login Failed',
//                 text: errorMessage,
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     return (
//         <div>
//             <h1 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">
//                 Welcome Back
//             </h1>

//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                         Email Address
//                     </label>
//                     <input
//                         id="email"
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                         placeholder="your@email.com"
//                         required
//                     />
//                 </div>

//                 <div className="mb-6">
//                     <div className="flex items-center justify-between mb-1">
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                             Password
//                         </label>
//                         <a href="#" className="text-xs text-primary-600 hover:text-primary-800">
//                             Forgot password?
//                         </a>
//                     </div>
//                     <div className="input-group">
//                         <input
//                             id="password"
//                             type={showPassword ? 'text' : 'password'}
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                             placeholder="********"
//                             required
//                         />
//                         <span
//                             className="toggle-password"
//                             onClick={togglePasswordVisibility}
//                         >
//                             {showPassword ? '👁️‍🗨️' : '👁️'}
//                         </span>
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
//                 >
//                     {loading ? 'Signing In...' : 'Sign In'}
//                 </button>
//             </form>

//             <div className="mt-6 text-center text-sm">
//                 <span className="text-gray-600">Don't have an account? </span>
//                 <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
//                     Register here
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OTPLoginPage from './OTPLoginPage';

const LoginPage: React.FC = () => {
  return <OTPLoginPage />;
};

export default LoginPage;