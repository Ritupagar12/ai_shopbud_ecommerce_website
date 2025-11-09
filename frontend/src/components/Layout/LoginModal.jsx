import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { forgotPassword, login, register, resetPassword } from "../../store/slices/authSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { authUser, isSigningUp, isLoggingIn, isRequestingForToken } = useSelector((state) => state.auth);
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const [mode, setMode] = useState("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (location.pathname.startsWith("/password/reset/")) {
      setMode("reset");
      dispatch(toggleAuthPopup());
    }
  }, [location.pathname, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (mode === "signup") data.append("name", formData.name);

    if (mode === "forgot") {
      dispatch(forgotPassword({ email: formData.email })).then(() => {
        dispatch(toggleAuthPopup());
        setMode("signin");
      });
      return;
    }

    if (mode === "reset") {
      const token = location.pathname.split("/").pop();
      dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      );
      return;
    }

    if (mode === "signup") dispatch(register(data));
    else dispatch(login(data));

    if (authUser) setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  if (!isAuthPopupOpen || authUser) return null;

  const isLoading = isSigningUp || isLoggingIn || isRequestingForToken;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-[2px]"
        onClick={() => dispatch(toggleAuthPopup())}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {mode === "reset"
              ? "Reset Password"
              : mode === "signup"
              ? "Create Account"
              : mode === "forgot"
              ? "Forgot Password"
              : "Welcome Back"}
          </h2>
          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          )}

          {mode !== "reset" && (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          )}

          {mode !== "forgot" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          )}

          {mode === "reset" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          )}

          {mode === "signin" && (
            <div className="text-right text-sm">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 flex justify-center items-center gap-2 text-white font-semibold rounded-lg transition-all duration-300 ${
              isLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {mode === "reset"
                    ? "Reseting Password..."
                    : mode === "signup"
                    ? "Signing Up..."
                    : mode === "forgot"
                    ? "Requesting..."
                    : "Signing in..."}
                </span>
              </>
            ) : mode === "reset" ? (
              "Reset Password"
            ) : mode === "signup" ? (
              "Create Account"
            ) : mode === "forgot" ? (
              "Send Reset Email"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {["signin", "signup"].includes(mode) && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setMode((prev) => (prev === "signup" ? "signin" : "signup"))}
              className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {mode === "signup"
                ? "Already have an account? Sign in"
                : "Don’t have an account? Sign up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;