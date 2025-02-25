"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase.config";

interface ContextProps {
    signInWithGoogle: () => Promise<void>;
    signInWithCredentials: (email: string, password: string) => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
    signOutUser: () => Promise<void>;
    isLoading: boolean;
    user: User | null;
    successMessage: string;
    errorMessage: string;
}

const Context = createContext<ContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (error) {
            console.error("Erro ao autenticar com Google:", error);
        }
    };

    const signInWithCredentials = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Erro ao autenticar com credenciais:", error);
        }
    };

    const createAccount = async (email: string, password: string) => {
        try {
            if(password.length < 7) {
                return setErrorMessage('A senha não pode conter menos de 6 dígitos');
            }
            setIsLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            setSuccessMessage('Conta criada com sucesso!');
            setErrorMessage('');
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            console.error("Erro ao criar conta:", error);
    
            if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('Este e-mail já está em uso. Tente outro.');
            } else {
                setErrorMessage('Erro ao criar conta. Tente novamente.');
            }
            
            setSuccessMessage('');
        }
    };

    const signOutUser = async () => {
        try {
          await signOut(auth);
          console.log("Usuário deslogado com sucesso");
        } catch (error) {
          console.error("Erro ao deslogar:", error);
        }
      };
      

    return (
        <Context.Provider value={{
            signInWithCredentials,
            createAccount,
            isLoading,
            signInWithGoogle,
            user,
            successMessage,
            errorMessage,
            signOutUser
        }}>
            {children}
        </Context.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(Context);

    if (!context) {
        throw new Error("O elemento pai deve estar envolvido com AuthProvider");
    }

    return context;
};
