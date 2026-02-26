import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            console.warn("Firebase Auth Error:", error);
            // Fallback for DEV/DEMO when Firebase console isn't configured yet
            if (error.code === 'auth/configuration-not-found' || error.message?.includes('configuration-not-found')) {
                console.warn("⚠️ AUTH CONFIGURATION NOT FOUND: Falling back to Mock Dev User to unblock UI.");
                setUser({
                    uid: 'dev-user-123',
                    email: 'dev@chromabase.com',
                    displayName: 'Chroma Admin (Dev Mode)',
                    photoURL: 'https://ui-avatars.com/api/?name=Chroma+Admin&background=FF4D0D&color=fff',
                    emailVerified: true,
                    isAnonymous: false,
                    providerData: [{
                        providerId: 'google.com',
                        uid: 'dev-user-123',
                        displayName: 'Chroma Admin (Dev Mode)',
                        email: 'dev@chromabase.com',
                        phoneNumber: null,
                        photoURL: 'https://ui-avatars.com/api/?name=Chroma+Admin&background=FF4D0D&color=fff',
                    }],
                    metadata: {
                        creationTime: new Date().toISOString(),
                        lastSignInTime: new Date().toISOString()
                    },
                    tenantId: null,
                    refreshToken: 'mock-refresh-token',
                    getIdToken: async () => 'mock-token',
                    getIdTokenResult: async () => ({ token: 'mock', claims: {}, authTime: '0', issuedAtTime: '0', expirationTime: '0', signInProvider: 'google.com', signInSecondFactor: null }),
                    reload: async () => { },
                    delete: async () => { },
                    toJSON: () => ({})
                } as unknown as User);
                return;
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            // If it's the mock user, just clear state
            if (user?.uid === 'dev-user-123') {
                setUser(null);
                return;
            }
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out", error);
            setUser(null); // Force clear on error
        }
    };


    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
