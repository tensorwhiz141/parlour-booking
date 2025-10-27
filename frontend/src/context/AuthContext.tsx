// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { User, AuthState } from '../types';
// import { getCurrentUser } from '../services/authService';
// import Swal from 'sweetalert2';

// interface AuthContextProps {
//   authState: AuthState;
//   login: (user: User, token: string) => void;
//   logout: () => void;
//   updateUser: (user: User) => void;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [authState, setAuthState] = useState<AuthState>({
//     user: null,
//     token: localStorage.getItem('token'),
//     isAuthenticated: false,
//     loading: true,
//     error: null,
//   });

//   useEffect(() => {
//     // Check if user is logged in
//     const loadUser = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const user = getCurrentUser();

//         if (token && user) {
//           setAuthState({
//             user,
//             token,
//             isAuthenticated: true,
//             loading: false,
//             error: null,
//           });
//         } else {
//           setAuthState({
//             user: null,
//             token: null,
//             isAuthenticated: false,
//             loading: false,
//             error: null,
//           });
//         }
//       } catch (error) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         setAuthState({
//           user: null,
//           token: null,
//           isAuthenticated: false,
//           loading: false,
//           error: 'Authentication error',
//         });
//       }
//     };

//     loadUser();
//   }, []);

//   // Login user
//   const login = (user: User, token: string) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));

//     setAuthState({
//       user,
//       token,
//       isAuthenticated: true,
//       loading: false,
//       error: null,
//     });

//     Swal.fire({
//       icon: 'success',
//       title: 'Login Successful',
//       text: `Welcome back, ${user.name}!`,
//       timer: 2000,
//       showConfirmButton: false,
//     });
//   };

//   // Logout user
//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');

//     setAuthState({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       loading: false,
//       error: null,
//     });

//     Swal.fire({
//       icon: 'success',
//       title: 'Logged Out',
//       text: 'You have been logged out successfully',
//       timer: 2000,
//       showConfirmButton: false,
//     });
//   };

//   // Update user
//   const updateUser = (user: User) => {
//     localStorage.setItem('user', JSON.stringify(user));
    
//     setAuthState({
//       ...authState,
//       user,
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ authState, login, logout, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { getCurrentUser } from '../services/authService';
import Swal from 'sweetalert2';

interface AuthContextProps {
  authState: AuthState;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = getCurrentUser();

        // Validate token and user
        if (token && user && user._id && user.email) {
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: 'Authentication error',
        });
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setAuthState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: `Welcome back, ${user.name}!`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been logged out successfully',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  };

  // Update user
  const updateUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(child));
    
    setAuthState({
      ...authState,
      user,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};