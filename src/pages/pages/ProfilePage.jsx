import { useContext, useState, useRef } from "react";
import { Pencil, Check, X, Camera, Upload } from "lucide-react";
import AppContext from "../context/AppContext";
import { updateProfile, uploadAvatar } from "../services/api";

export default function ProfilePage() {
  const {
    favorites,
    watchlist,
    user,
    setUser,
    isAuthenticated,
    triggerNotification,
    reviewsCount,
  } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const startEditing = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setAvatar(user?.avatar || "");
    setAvatarFile(null);
    setAvatarPreview("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setAvatarFile(null);
    setAvatarPreview("");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      triggerNotification("Please select a JPEG, PNG, or WebP image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      triggerNotification("Image must be less than 2MB");
      return;
    }

    setAvatarFile(file);
    setAvatar("");
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return null;
    setUploadingAvatar(true);
    try {
      const res = await uploadAvatar(avatarFile);
      triggerNotification("Avatar uploaded successfully");
      return res.data?.avatar || null;
    } catch (err) {
      triggerNotification(err.message || "Failed to upload avatar");
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let avatarUrl = avatar.trim() || undefined;

      if (avatarFile) {
        const uploadedUrl = await handleAvatarUpload();
        if (uploadedUrl) avatarUrl = uploadedUrl;
      }

      const payload = {};
      if (name.trim()) payload.name = name.trim();
      if (email.trim()) payload.email = email.trim();
      if (avatarUrl) payload.avatar = avatarUrl;

      if (Object.keys(payload).length > 0) {
        const res = await updateProfile(payload);
        if (res.data) setUser(res.data);
      }

      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview("");
      triggerNotification("Profile updated");
    } catch (err) {
      triggerNotification(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const displayAvatar = avatarPreview || user?.avatar;
  const avatarUrl =
    displayAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=dc2626&color=fff`;

  return (
    <div className="px-6 md:px-16 py-12">
      <div className="max-w-4xl mx-auto bg-zinc-950 rounded-3xl border border-zinc-900 p-8 md:p-12 space-y-8 shadow-2xl">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-zinc-900 pb-8">
          <div className="relative group">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-2xl border-4 border-red-600/30 object-cover shadow-2xl"
            />
            {isAuthenticated && !editing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                <Camera size={20} className="text-white" />
              </button>
            )}
          </div>
          <div className="text-center sm:text-left space-y-1 flex-1">
            <h2 className="text-2xl font-black text-white">
              {isAuthenticated ? user?.name || "User" : "Guest"}
            </h2>
            <p className="text-red-500 text-xs font-black uppercase tracking-widest">
              {isAuthenticated
                ? "Authenticated Member"
                : "Sign in to access full profile"}
            </p>
            {isAuthenticated && user?.email && (
              <p className="text-zinc-400 text-sm pt-2">{user.email}</p>
            )}
          </div>
          {isAuthenticated && !editing && (
            <button
              onClick={startEditing}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Pencil size={12} /> Edit Profile
            </button>
          )}
        </div>

        {/* Edit Form */}
        {editing && (
          <form
            onSubmit={handleSave}
            className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6 space-y-4"
          >
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Update Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Avatar
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Upload size={12} /> Upload File
                  </button>
                  <span className="text-zinc-600 text-xs">or</span>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => {
                      setAvatar(e.target.value);
                      setAvatarFile(null);
                      setAvatarPreview("");
                    }}
                    className="flex-1 bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="Paste image URL"
                  />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {(avatarPreview || (avatar && !avatarFile)) && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={avatarPreview || avatar}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-800"
                    />
                    <span className="text-zinc-500 text-[10px]">
                      {avatarFile
                        ? `${avatarFile.name} (${(avatarFile.size / 1024).toFixed(0)} KB)`
                        : "URL preview"}
                    </span>
                  </div>
                )}
                <p className="text-zinc-600 text-[10px]">
                  JPEG, PNG, or WebP. Max 2MB.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || uploadingAvatar}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check size={12} />{" "}
                {saving || uploadingAvatar ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold px-5 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          </form>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4">
            <span className="block text-2xl font-black text-red-500">
              {favorites.length}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Favorites Saved
            </span>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4">
            <span className="block text-2xl font-black text-zinc-100">
              {watchlist.length}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Watchlist Queue
            </span>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4">
            <span className="block text-2xl font-black text-blue-500">
              {reviewsCount}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Reviews Written
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
