"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "../utils/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { useRouter } from "next/navigation";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  website?: string;
  createdAt: string;
  imagesGenerated?: number;
  plan?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get or create user profile
          const userProfileDoc = await getDoc(doc(db, "userProfiles", user.uid));
          if (userProfileDoc.exists()) {
            setUserProfile(userProfileDoc.data() as UserProfile);
          } else {
            // Create a new profile if it doesn't exist
            const newUserProfile: UserProfile = {
              uid: user.uid,
              displayName: user.displayName || "User",
              email: user.email || "",
              photoURL: user.photoURL || "",
              createdAt: new Date().toISOString(),
              imagesGenerated: 0,
              plan: "free"
            };
            await setDoc(doc(db, "userProfiles", user.uid), newUserProfile);
            setUserProfile(newUserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Create new user with email/password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile with displayName
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }
      
      // Create user profile in Firestore
      const newUserProfile: UserProfile = {
        uid: userCredential.user.uid,
        displayName,
        email,
        createdAt: new Date().toISOString(),
        imagesGenerated: 0,
        plan: "free"
      };
      
      await setDoc(doc(db, "userProfiles", userCredential.user.uid), newUserProfile);
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  // Login with email/password
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists
      const userProfileDoc = await getDoc(doc(db, "userProfiles", user.uid));
      
      if (!userProfileDoc.exists()) {
        // Create a user profile if it doesn't exist
        const newUserProfile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || "Google User",
          email: user.email || "",
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
          imagesGenerated: 0,
          plan: "free"
        };
        await setDoc(doc(db, "userProfiles", user.uid), newUserProfile);
      }
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/");
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!currentUser) throw new Error("No authenticated user");
    
    try {
      // Update Firestore profile
      await setDoc(
        doc(db, "userProfiles", currentUser.uid),
        { ...profileData },
        { merge: true }
      );
      
      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...profileData
        });
      }
      
      // Update Firebase Auth profile if display name or photo URL changes
      if (profileData.displayName || profileData.photoURL) {
        await updateProfile(currentUser, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL
        });
      }
      
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    signUp,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
