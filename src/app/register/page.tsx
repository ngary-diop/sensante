"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Inscription
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Prénom" required
            className="w-full p-3 border rounded-lg"
            onChange={e => setForm({ ...form, prenom: e.target.value })} />
          <input placeholder="Nom" required
            className="w-full p-3 border rounded-lg"
            onChange={e => setForm({ ...form, nom: e.target.value })} />
          <input type="email" placeholder="Email" required
            className="w-full p-3 border rounded-lg"
            onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Mot de passe" required
            className="w-full p-3 border rounded-lg"
            onChange={e => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition">
            S'inscrire
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Déjà un compte ?{" "}
          <a href="/login" className="text-teal-600 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
