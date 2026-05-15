"use client";
import { useEffect, useState } from "react";
import PatientCard from "@/components/PatientCard";
import PatientForm from "@/components/PatientForm";
import { Search, Plus, Users, Filter } from "lucide-react";

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  telephone: string | null;
  adresse: string | null;
  region: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function chargerPatients() {
    try {
      const res = await fetch("/api/patients?t=" + Date.now());
      const data = await res.json();
      if (Array.isArray(data)) { setPatients(data); } else { setPatients([]); }
    } catch(e) { console.error(e); } finally { setLoading(false); }
  }

  useEffect(() => {
    chargerPatients();
  }, []);

  function calculerAge(dateNaissance: string): number {
    const naissance = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - naissance.getFullYear();
    const m = today.getMonth() - naissance.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < naissance.getDate())) { age--; }
    return age;
  }

  const patientsFiltrés = patients.filter(p => 
    `${p.prenom} ${p.nom}`.toLowerCase().includes(recherche.toLowerCase()) ||
    p.region.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <Users className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Gestion Médicale</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900">
            Répertoire <span className="text-yellow-500">Patients</span>
          </h1>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 bg-yellow-400 text-white font-black px-6 py-3.5 rounded-2xl hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-200 active:scale-95"
        >
          {showForm ? "Masquer le formulaire" : <><Plus className="w-5 h-5" /> Nouveau Patient</>}
        </button>
      </div>

      <div className={`transition-all duration-500 overflow-hidden ${showForm ? 'max-h-[1000px] mb-12' : 'max-h-0'}`}>
        <div className="bg-white rounded-3xl p-8 border-2 border-yellow-100 shadow-xl shadow-yellow-50/50">
          <PatientForm onSuccess={() => { chargerPatients(); setShowForm(false); }} />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Rechercher un patient par nom ou région..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-400 transition-all"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-colors">
          <Filter className="w-5 h-5" />
          Filtres
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">
          Liste des patients <span className="text-gray-400 font-medium ml-1">({patientsFiltrés.length})</span>
        </h2>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-12 h-12 border-4 border-yellow-100 border-t-yellow-400 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Chargement des dossiers...</p>
        </div>
      ) : patientsFiltrés.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Aucun patient trouvé pour cette recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patientsFiltrés.map((p) => (
            <PatientCard
              key={p.id}
              nom={`${p.prenom} ${p.nom}`}
              region={p.region}
              age={calculerAge(p.dateNaissance)}
              sexe={p.sexe as "M" | "F"}
            />
          ))}
        </div>
      )}
    </div>
  );
}



