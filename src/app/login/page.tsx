"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (result?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Connexion
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email"
            className="w-full p-3 border rounded-lg" required />
          <input name="password" type="password" placeholder="Mot de passe"
            className="w-full p-3 border rounded-lg" required />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition">
            Se connecter
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-teal-600 hover:underline">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
}