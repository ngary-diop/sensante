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
      router.push("/auth/login");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Prénom" required
          onChange={e => setForm({ ...form, prenom: e.target.value })} />
        <input placeholder="Nom" required
          onChange={e => setForm({ ...form, nom: e.target.value })} />
        <input type="email" placeholder="Email" required
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Mot de passe" required
          onChange={e => setForm({ ...form, password: e.target.value })} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
