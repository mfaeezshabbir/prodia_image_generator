"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LuUser,
  LuImagePlus,
  LuSettings,
  LuChevronRight,
  LuImage,
} from "react-icons/lu";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";

type RecentImage = {
  id: string;
  imageUrl: string;
  prompt?: string;
  timestamp: string | number | Date;
  // add other fields as needed
};

const ProfilePage = () => {
  const { userProfile, currentUser } = useAuth();
  const [recentImages, setRecentImages] = useState<RecentImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserImages = async () => {
      if (!currentUser) return;

      try {
        const imagesQuery = query(
          collection(db, "generatedImages"),
          where("userId", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(imagesQuery);
        const images = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              imageUrl: data.imageUrl,
              prompt: data.prompt,
              timestamp: data.timestamp,
              // add other fields as needed
            };
          })
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .slice(0, 4); // Get only the 4 most recent images

        setRecentImages(images);
      } catch (error) {
        console.error("Error fetching images:", error);
        toast.error("Failed to load your recent images");
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, [currentUser]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation header - will be handled by the Navigation component */}

        <div className="pt-24 px-6 pb-16 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  {userProfile?.photoURL ? (
                    <Image
                      src={userProfile.photoURL}
                      alt={userProfile.displayName}
                      width={96}
                      height={96}
                      className="rounded-full mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                      <LuUser className="text-indigo-600 text-3xl" />
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-gray-900">
                    {userProfile?.displayName}
                  </h2>
                  <p className="text-gray-600 mt-1">{userProfile?.email}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Member since{" "}
                    {new Date(
                      userProfile?.createdAt || ""
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center mb-2 text-gray-700">
                    <span>Plan</span>
                    <span className="font-medium capitalize">
                      {userProfile?.plan || "free"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2 text-gray-700">
                    <span>Images Generated</span>
                    <span className="font-medium">
                      {userProfile?.imagesGenerated || 0}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <Link
                    href="/profile/settings"
                    className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <LuSettings className="mr-3 text-gray-500" />
                      <span>Account Settings</span>
                    </div>
                    <LuChevronRight className="text-gray-400" />
                  </Link>

                  <Link
                    href="/profile/images"
                    className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <LuImage className="mr-3 text-gray-500" />
                      <span>My Images</span>
                    </div>
                    <LuChevronRight className="text-gray-400" />
                  </Link>
                </div>

                <div className="mt-6">
                  <Link
                    href="/generate"
                    className="gradient-bg text-white w-full py-2.5 rounded-lg flex items-center justify-center font-medium"
                  >
                    <LuImagePlus className="mr-2" /> Create New Image
                  </Link>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Profile Overview
                  </h2>
                  <Link
                    href="/profile/settings"
                    className="text-indigo-600 hover:text-indigo-700 flex items-center"
                  >
                    <FaRegEdit className="mr-1" /> Edit
                  </Link>
                </div>

                {userProfile?.bio ? (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      About
                    </h3>
                    <p className="text-gray-800">{userProfile.bio}</p>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                    <p className="text-gray-500 text-center">
                      Add a bio to tell others about yourself
                    </p>
                    <div className="flex justify-center mt-2">
                      <Link
                        href="/profile/settings"
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Add Bio
                      </Link>
                    </div>
                  </div>
                )}

                {userProfile?.website && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Website
                    </h3>
                    <a
                      href={
                        userProfile.website.startsWith("http")
                          ? userProfile.website
                          : `https://${userProfile.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      {userProfile.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Recent images */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recent Images
                  </h2>
                  <Link
                    href="/profile/images"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    View All
                  </Link>
                </div>

                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                ) : recentImages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative group overflow-hidden rounded-lg shadow-sm"
                      >
                        <Image
                          src={image.imageUrl}
                          alt={image.prompt || "Generated image"}
                          width={400}
                          height={400}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <p className="text-white text-sm truncate">
                            {image.prompt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <LuImagePlus className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      No Images Yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      You haven&#39;t generated any images yet
                    </p>
                    <Link
                      href="/generate"
                      className="gradient-bg text-white px-4 py-2 rounded-lg font-medium inline-flex items-center"
                    >
                      <LuImagePlus className="mr-2" /> Create Your First Image
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
