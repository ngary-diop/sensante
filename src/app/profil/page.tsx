"use client";

import { useSession } from "next-auth/react";

export default function ProfilPage() {
  const { data: session } = useSession();

  if (!session) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Mon profil
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
        <p className="text-gray-600">
          <strong>Nom :</strong> {session.user?.name}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Email :</strong> {session.user?.email}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Rôle :</strong> {(session.user as any)?.role ?? "—"}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Région :</strong> {(session.user as any)?.region ?? "—"}
        </p>
      </div>
    </div>
  );
}