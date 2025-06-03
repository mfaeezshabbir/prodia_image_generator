"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuUser, LuChevronLeft, LuSave, LuUpload, LuLoader } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../utils/firebaseConfig";

const ProfileSettingsPage = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    website: ""
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        bio: userProfile.bio || "",
        website: userProfile.website || ""
      });
      
      if (userProfile.photoURL) {
        setPhotoPreview(userProfile.photoURL);
      }
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let photoURL = userProfile?.photoURL;
      
      // Upload new photo if selected
      if (photoFile) {
        setUploadingPhoto(true);
        const fileRef = ref(storage, `profile-photos/${userProfile?.uid}/${Date.now()}-${photoFile.name}`);
        const snapshot = await uploadBytes(fileRef, photoFile);
        photoURL = await getDownloadURL(snapshot.ref);
        setUploadingPhoto(false);
      }
      
      // Update profile
      await updateUserProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        website: formData.website,
        photoURL
      });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Content starts below the Navigation component */}
        <div className="pt-24 px-6 pb-16 max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/profile" className="mr-4 text-gray-700 hover:text-indigo-600">
              <LuChevronLeft size={20} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                {/* Photo upload section */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="mb-4">
                    {photoPreview ? (
                      <div className="relative w-32 h-32 rounded-full overflow-hidden">
                        <Image 
                          src={photoPreview}
                          alt="Profile photo"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center">
                        <LuUser className="text-indigo-600 text-4xl" />
                      </div>
                    )}
                  </div>
                  
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handlePhotoChange}
                      disabled={loading || uploadingPhoto}
                    />
                    {uploadingPhoto ? (
                      <>
                        <LuLoader className="mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <LuUpload className="mr-2" />
                        Change Photo
                      </>
                    )}
                  </label>
                </div>
                
                {/* Form fields */}
                <div className="w-full md:w-2/3 space-y-6">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="w-full p-3 text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full p-3 text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none h-32"
                      placeholder="Tell others about yourself..."
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full p-3 text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 rounded-lg flex items-center justify-center font-medium ${
                        loading
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "gradient-bg text-white hover:shadow-md transition-all"
                      }`}
                    >
                      {loading ? (
                        <>
                          <LuLoader className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <LuSave className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between pb-4 border-b border-gray-100">
                <div className="text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{userProfile?.email}</div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between pb-4 border-b border-gray-100">
                <div className="text-gray-600">Current Plan</div>
                <div className="font-medium text-gray-900 capitalize">{userProfile?.plan || "free"}</div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between pb-4 border-b border-gray-100">
                <div className="text-gray-600">Images Generated</div>
                <div className="font-medium text-gray-900">{userProfile?.imagesGenerated || 0}</div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between pb-4">
                <div className="text-gray-600">Member Since</div>
                <div className="font-medium text-gray-900">
                  {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfileSettingsPage;
