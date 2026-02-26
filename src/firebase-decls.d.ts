declare module 'firebase/app' {
    export function initializeApp(config: any): any;
    export function getApp(): any;
    export function getApps(): any[];
}

declare module 'firebase/auth' {
    export function getAuth(app?: any): any;
    export function onAuthStateChanged(auth: any, next: (user: any) => void): any;
    export function signInWithPopup(auth: any, provider: any): Promise<any>;
    export function signOut(auth: any): Promise<void>;
    export class GoogleAuthProvider {
        constructor();
    }
    export type User = any;
}

declare module 'firebase/firestore' {
    export type QuerySnapshot<T = any, R = any> = {
        docs: Array<QueryDocumentSnapshot<T, R>>;
    };
    export type QueryDocumentSnapshot<T = any, R = any> = {
        id: string;
        data(): T;
    };
    export type DocumentData = any;
    export type FirestoreError = any;
    export function onSnapshot(query: any, onNext: (snapshot: any) => void, onError?: (error: any) => void): any;
    export function query(collection: any, ...queryConstraints: any[]): any;
    export function orderBy(field: string, direction?: 'asc' | 'desc'): any;
    export function collection(db: any, path: string): any;
    export function addDoc(collection: any, data: any): Promise<any>;
    export function updateDoc(docRef: any, data: any): Promise<void>;
    export function deleteDoc(docRef: any): Promise<void>;
    export function doc(db: any, path: string, ...segments: string[]): any;
    export function getDocs(query: any): Promise<any>;
}
