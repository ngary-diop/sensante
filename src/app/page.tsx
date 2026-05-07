"use client";
import { useSession } from "next-auth/react";
import PatientCard from "@/components/PatientCard";
import AlerteIA from "@/components/AlerteIA";
import StatCard from "@/components/StatCard";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Tableau de bord
          </h2>
          {!session && (
            <Link href="/login"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
              Se connecter
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard titre="Patients" valeur={127} unite="enregistrés" couleur="border-teal-500" />
          <StatCard titre="Consultations" valeur={43} unite="ce mois" couleur="border-orange-500" />
          <StatCard titre="Alertes IA" valeur={8} unite="urgentes" couleur="border-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Derniers patients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <PatientCard nom="Aminata Sow" region="Dakar" age={34} sexe="F" />
          <PatientCard nom="Ibrahima Ba" region="Thiès" age={45} sexe="M" />
          <PatientCard nom="Awa Diallo" region="Saint-Louis" age={28} sexe="F" />
        </div>
        <div className="mt-6">
          <AlerteIA diagnostic="Suspicion de paludisme. Orientation recommandée." confiance={78} niveau="urgent" />
        </div>
      </main>
    </div>
  );
}
