export interface User {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
}

export interface Document {
    id: string;
    data: Record<string, any>;
}

export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}