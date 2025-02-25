"use client"

import { Input } from "@/components/input";
import { useAuth } from "@/context/authContext";
import { FormValidateService } from "@/services/form_validate_service";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [passwordsMatch, setpasswordsMatch] = useState<Boolean>(true);
  const { signInWithGoogle, errorMessage, successMessage, createAccount, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/success");
    }
  }, [user, router]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputs = event.currentTarget;
    const email = inputs.elements.namedItem('email') as HTMLInputElement;
    const password = inputs.elements.namedItem('password') as HTMLInputElement;
    const inputConfirmPassword = inputs.elements.namedItem('confirmPassword') as HTMLInputElement;

    if (inputConfirmPassword?.value) {
      const passwordsIsTheSame = FormValidateService.confirmPassword(password?.value, inputConfirmPassword?.value);
      
      if (passwordsIsTheSame) return createAccount(email.value, password.value);

      return setpasswordsMatch(passwordsIsTheSame);
    }

  }

  return (
    <main className="min-h-screen flex items-center">
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{isSignUp ? 'Cadastre-se' : 'Entrar'}</h2>
        <form onSubmit={handleLogin} className="space-y-4 max-w-[20rem]">

          {/* SÓ VAI APARECER O INPUT NOME CASO ESTEJA NA PÁGINA DE CADASTRO */}
          {isSignUp && (
            <div>
              <Input name="name" type="text" placeholder="Nome" />
            </div>
          )}
          <div>
            <Input name="email" type="email" placeholder="Email" />
          </div>
          <div>
            <Input name="password" type="password" placeholder="Senha" />
          </div>

          {isSignUp && (
            <>
              <div>
                <Input name="confirmPassword" type="password" placeholder="Senha" />
              </div>
              <div className="flex flex-col gap-2">
                {!passwordsMatch && <span className="text-red-500 text-sm">As senhas não são iguais</span>}
                {errorMessage && <span className="text-red-500 text-sm w-max">{errorMessage}</span>}
                {successMessage && <span className="text-green-500 text-sm">{successMessage}</span>}
              </div>
            </>
          )}
          <button
            className="text-md font-semibold mb-4 text-center bg-black w-full p-3 rounded-md text-white flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader width={24} height={24} className="animate-spin" />
            ) : (
              isSignUp ? 'Cadastre-se' : 'Entrar'
            )}
          </button>
          <button
            onClick={signInWithGoogle}
            className="text-md font-semibold mb-4 text-center w-full p-3 rounded-md flex items-center justify-center gap-10 border-2 border-gray-300">
            <Image src={"/google.svg"} alt="Google Icon" width={20} height={20} />
            Entrar com Google
          </button>
        </form>

        {/* MUDAR ENTRE LOGIN E CADASTRO */}
        <p className="text-sm text-center mt-4">
          {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setpasswordsMatch(true) }}
            className="text-blue-500 hover:underline ml-1"
          >
            {isSignUp ? 'Entrar' : 'Cadastre-se'}
          </button>
        </p>
      </div>
    </main>
  );
}
