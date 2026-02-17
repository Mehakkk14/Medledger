import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

interface User {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organization: string;
  role: 'admin' | 'user' | 'viewer';
  hospitalName: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  signup: (userData: any) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        // Fetch user profile from Firestore
        try {
          const userDocRef = doc(db, 'hospitals', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userProfile: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              organization: userData.organization || userData.hospitalName || '',
              hospitalName: userData.hospitalName || userData.organization || '',
              role: userData.role || 'user'
            };
            setUser(userProfile);
            localStorage.setItem('medledger_user', JSON.stringify(userProfile));
            localStorage.setItem('hospitalName', userProfile.hospitalName);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
        localStorage.removeItem('medledger_user');
        localStorage.removeItem('hospitalName');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Fetch user profile from Firestore
      const userDocRef = doc(db, 'hospitals', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userProfile: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          organization: userData.organization || userData.hospitalName || '',
          hospitalName: userData.hospitalName || userData.organization || '',
          role: userData.role || 'user'
        };
        setUser(userProfile);
        setFirebaseUser(firebaseUser);
        localStorage.setItem('medledger_user', JSON.stringify(userProfile));
        localStorage.setItem('hospitalName', userProfile.hospitalName);
        return true;
      } else {
        console.error('User profile not found in Firestore');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem('medledger_user');
      localStorage.removeItem('hospitalName');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      // Check if user profile exists in Firestore
      const userDocRef = doc(db, 'hospitals', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user profile for first-time Google sign-in
        const displayName = firebaseUser.displayName || '';
        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');
        
        const userProfile = {
          email: firebaseUser.email || '',
          firstName: firstName || '',
          lastName: lastName || '',
          organization: 'Google User',
          hospitalName: 'Google User',
          role: 'user',
          createdAt: new Date().toISOString(),
          uid: firebaseUser.uid
        };
        
        await setDoc(userDocRef, userProfile);
      }
      
      return true;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Popup was closed by user');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { email, password, ...profile } = userData;
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user profile in Firestore
      const hospitalName = profile.organization || profile.hospitalName || `${profile.firstName} ${profile.lastName}`;
      const userProfile = {
        email: email,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        organization: profile.organization || hospitalName,
        hospitalName: hospitalName,
        role: profile.role || 'user',
        createdAt: new Date().toISOString(),
        uid: firebaseUser.uid
      };
      
      await setDoc(doc(db, 'hospitals', firebaseUser.uid), userProfile);
      
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    logout,
    signup,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};