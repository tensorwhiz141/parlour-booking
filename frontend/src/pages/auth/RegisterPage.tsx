// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { registerUser } from "../../services/authService";
// import Swal from "sweetalert2";

// const RegisterPage: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const isStrongPassword = (pwd: string) => {
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
//     return regex.test(pwd);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Passwords Do Not Match",
//         text: "Please ensure both password fields match",
//       });
//       return;
//     }

//     if (!isStrongPassword(formData.password)) {
//       Swal.fire({
//         icon: "error",
//         title: "Weak Password",
//         text: "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
//       });
//       return;
//     }

//     const phoneRegex = /^[6-9]\d{9}$/;
//     if (!phoneRegex.test(formData.phone)) {
//       Swal.fire({
//         icon: "error",
//         title: "Invalid Phone Number",
//         text: "Please enter a valid 10-digit Indian phone number",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await registerUser({
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         role: "user",
//       });

//       if (response.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Registration Successful",
//           text: "You can now login with your credentials",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         navigate("/login");
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Registration Failed",
//           text: response.error || "There was a problem with registration",
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Registration Failed",
//         text: "An unexpected error occurred. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">
//         Create Account
//       </h1>

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label
//             htmlFor="name"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Full Name
//           </label>
//           <input
//             id="name"
//             name="name"
//             type="text"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             placeholder="Priya Sharma"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Email Address
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             placeholder="your@email.com"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="phone"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Phone Number
//           </label>
//           <input
//             id="phone"
//             name="phone"
//             type="tel"
//             value={formData.phone}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             placeholder="9876543210"
//             required
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             10-digit Indian mobile number
//           </p>
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Password
//           </label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             placeholder=""
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label
//             htmlFor="confirmPassword"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Confirm Password
//           </label>
//           <input
//             id="confirmPassword"
//             name="confirmPassword"
//             type="password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//             placeholder=""
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
//         >
//           {loading ? "Creating Account..." : "Create Account"}
//         </button>
//       </form>

//       <div className="mt-6 text-center text-sm">
//         <span className="text-gray-600">Already have an account? </span>
//         <Link
//           to="/login"
//           className="text-primary-600 hover:text-primary-800 font-medium"
//         >
//           Sign in
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import Swal from "sweetalert2";
import './auth.css'; // Already imported

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Added state for confirm password visibility
    const navigate = useNavigate();

    const isStrongPassword = (pwd: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        return regex.test(pwd);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Passwords Do Not Match",
                text: "Please ensure both password fields match",
            });
            return;
        }

        if (!isStrongPassword(formData.password)) {
            Swal.fire({
                icon: "error",
                title: "Weak Password",
                text: "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
            });
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Phone Number",
                text: "Please enter a valid 10-digit Indian phone number",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await registerUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: "user",
            });

            if (response.success) {
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful",
                    text: "You can now login with your credentials",
                    timer: 2000,
                    showConfirmButton: false,
                });
                navigate("/login");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: response.error || "There was a problem with registration",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div>
            <h1 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">
                Create Account
            </h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Priya Sharma"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="9876543210"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        10-digit Indian mobile number
                    </p>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password
                    </label>
                    <div className="input-group">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder=""
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? '👁️‍🗨️' : '👁️'}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Confirm Password
                    </label>
                    <div className="input-group">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder=""
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                        </span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-800 font-medium"
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;