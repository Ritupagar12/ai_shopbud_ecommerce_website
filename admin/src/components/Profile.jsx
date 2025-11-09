import React, { useState } from "react";
import defaultAvatar from "../assets/avatar.jpg";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { updateAdminProfile, updateAdminPassword } from "../store/slices/authSlice";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [editdata, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [avatar, setAvatar] = useState(null);
  const [updatingSection, setUpdatingSection] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);
  const handleProfileChange = (e) => setEditData({ ...editdata, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const dispatch = useDispatch();

  const updateProfile = () => {
    const formData = new FormData();
    formData.append("name", editdata.name);
    formData.append("email", editdata.email);
    formData.append("avatar", avatar);
    setUpdatingSection("Profile");
    dispatch(updateAdminProfile(formData));
  };

  const updatePassword = () => {
    const formData = new FormData();
    formData.append("currentPassword", passwordData.currentPassword);
    formData.append("newPassword", passwordData.newPassword);
    formData.append("confirmNewPassword", passwordData.confirmNewPassword);
    setUpdatingSection("Password");
    dispatch(updateAdminPassword(formData));
  };

  return (
    <main className="p-4 md:pl-64 w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex-1 md:p-6 mb-4">
        <Header />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your profile and account settings.</p>
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mb-10 hover:shadow-xl transition-shadow">
          <img
            src={user?.avatar?.url || defaultAvatar}
            alt={user?.name || "Avatar"}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="text-center md:text-left">
            <p className="text-2xl font-semibold text-gray-800">{user.name}</p>
            <p className="text-gray-500 mt-1">{user.email}</p>
            <p className="text-sm text-blue-500 mt-1">Role: {user.role}</p>
          </div>
        </div>

        {/* Update Profile Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={editdata.name}
              onChange={handleProfileChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Your Name"
            />
            <input
              type="email"
              name="email"
              value={editdata.email}
              onChange={handleProfileChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Your Email"
            />
            <input
              type="file"
              name="avatar"
              onChange={handleAvatarChange}
              className="p-3 border border-gray-300 rounded-lg col-span-1 md:col-span-2 cursor-pointer"
            />
          </div>
          <button
            onClick={updateProfile}
            className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 mt-4 rounded-lg transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading && updatingSection === "Profile" ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating Profile...</span>
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>

        {/* Update Password Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Current Password"
            />
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="New Password"
            />
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Confirm New Password"
            />
          </div>
          <button
            onClick={updatePassword}
            className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 mt-4 rounded-lg transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading && updatingSection === "Password" ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Profile;