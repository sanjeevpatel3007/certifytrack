"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiAlertCircle, FiArrowRight, FiCheck } from "react-icons/fi";
import { useAuthStore, signupUser } from "@/store/authStore";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      setError("You must accept the Terms and Privacy Policy to continue");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      
      const result = await signupUser(userData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: 'bg-slate-200' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const getColor = () => {
      if (strength === 0) return 'bg-slate-200';
      if (strength === 1) return 'bg-red-500';
      if (strength === 2) return 'bg-orange-500';
      if (strength === 3) return 'bg-yellow-500';
      return 'bg-green-500';
    };
    
    const getText = () => {
      if (strength === 0) return '';
      if (strength === 1) return 'Weak';
      if (strength === 2) return 'Fair';
      if (strength === 3) return 'Good';
      return 'Strong';
    };
    
    return { 
      strength, 
      text: getText(), 
      color: getColor() 
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Create an account
          </h2>
          <p className="text-slate-600">
            Join our community of learners
          </p>
        </div>
      
      {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-start" role="alert">
            <FiAlertCircle className="flex-shrink-0 mt-0.5 mr-3" />
            <span>{error}</span>
        </div>
      )}
      
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
          </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-slate-400" />
                  </div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
                    placeholder="John Doe"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 bg-white"
          />
                </div>
        </div>
        
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
          </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-slate-400" />
                  </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 bg-white"
          />
                </div>
        </div>
        
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-slate-400" />
                  </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 bg-white"
                  />
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div className={`h-full ${passwordStrength.color}`} style={{ width: `${passwordStrength.strength * 25}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-600 ml-2 min-w-[48px] text-right">{passwordStrength.text}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
                      <div className="flex items-center">
                        <div className={`mr-1 text-xs ${formData.password.length >= 8 ? 'text-green-500' : 'text-slate-400'}`}>
                          {formData.password.length >= 8 ? <FiCheck size={12} /> : '•'}
                        </div>
                        <span>At least 8 characters</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`mr-1 text-xs ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-slate-400'}`}>
                          {/[A-Z]/.test(formData.password) ? <FiCheck size={12} /> : '•'}
                        </div>
                        <span>Uppercase letter</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`mr-1 text-xs ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-slate-400'}`}>
                          {/[0-9]/.test(formData.password) ? <FiCheck size={12} /> : '•'}
                        </div>
                        <span>Number</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`mr-1 text-xs ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-slate-400'}`}>
                          {/[^A-Za-z0-9]/.test(formData.password) ? <FiCheck size={12} /> : '•'}
                        </div>
                        <span>Special character</span>
                      </div>
                    </div>
                  </div>
                )}
        </div>
        
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
            Confirm Password
          </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-slate-400" />
                  </div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 bg-white"
                  />
                </div>
                {formData.password && formData.confirmPassword && (
                  <div className="mt-1 flex items-center text-xs">
                    {formData.password === formData.confirmPassword ? (
                      <span className="text-green-500 flex items-center">
                        <FiCheck className="mr-1" size={12} /> Passwords match
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center">
                        <FiAlertCircle className="mr-1" size={12} /> Passwords don't match
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
                I agree to the <Link href="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>
              </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors`}
        >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <FiArrowRight className="ml-2" />}
        </button>
      </form>
      
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
          Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
                Sign in
          </Link>
        </p>
          </div>
        </div>
      </div>
    </div>
  );
}
