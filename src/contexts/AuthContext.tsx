import {ReactNode, createContext, useState, useEffect} from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConnection'

interface AuthProviderProps {
    children: ReactNode
}

interface AuthContextType {
    user: UserProps | null;
    signed: boolean;
    loadingAuth: boolean;
    handleInfoUser: (user: UserProps) => void
}

interface UserProps {
    uid: string;
    name: string;
    email: string;
}


export const AuthContext = createContext({} as AuthContextType)

export default function AuthProvider({children}: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | null>(null)
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true)

    useEffect(() => {
        setLoadingAuth(true)

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                const {uid, displayName, email} = user

                setUser({
                    uid,
                    name: displayName || '',
                    email: email || ''
                })

                setLoadingAuth(false)
            } else {
                setUser(null)
                setLoadingAuth(false)
            }
        })

        return () => {
            unsubscribe()
        }
    }, [])

    function handleInfoUser({name, email, uid}: UserProps) {
        setUser({
            uid,
            name,
            email
        })
    }

    return (
        <AuthContext.Provider value={{
            user,
            signed: !!user, 
            loadingAuth,
            handleInfoUser
            }}>
            {children}
        </AuthContext.Provider>
    )
}

