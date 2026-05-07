"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface Stats {
  kpi: {
    totalPatients: number;
    totalConsultations: number;
    consultationsTerminees: number;
    alertesUrgentes: number;
  };
  parRegion: { region: string; total: number }[];
  parMois: { mois: string; total: number }[];
  dernieresAlertes: {
    id: number;
    patient: string;
    region: string;
    diagnostic: string | null;
    confiance: number | null;
    date: string;
  }[];
}

const COULEURS_PIE = [
  "#0088FE", "#00C49F", "#FFBB28",
  "#FF8042", "#8884D8", "#82CA9D",
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 animate-pulse text-lg">
          Chargement du dashboard...
        </p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Tableau de bord
      </h1>
      
      {/* Zone 1 : KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard titre="Patients" valeur={stats.kpi.totalPatients} unite="enregistrés" couleur="border-teal-500" />
        <StatCard titre="Consultations" valeur={stats.kpi.totalConsultations} unite="au total" couleur="border-orange-500" />
        <StatCard titre="Diagnostics IA" valeur={stats.kpi.consultationsTerminees} unite="terminés" couleur="border-purple-500" />
        <StatCard titre="Alertes" valeur={stats.kpi.alertesUrgentes} unite="urgentes" couleur="border-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Zone 2 : Graphique barres */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Consultations par mois
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.parMois}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#E65100" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone 4 : Pie chart régions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Patients par région
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.parRegion} 
                  dataKey="total" 
                  nameKey="region" 
                  cx="50%" cy="50%" 
                  innerRadius={60}
                  outerRadius={100} 
                  paddingAngle={5}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.parRegion.map((_, i) => (
                    <Cell key={i} fill={COULEURS_PIE[i % COULEURS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Zone 3 : Dernières alertes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Derniers diagnostics IA
        </h2>
        <div className="overflow-hidden">
          <div className="space-y-4">
            {stats.dernieresAlertes.length > 0 ? (
              stats.dernieresAlertes.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {a.patient}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <span className="px-2 py-0.5 bg-white rounded border border-gray-200">{a.region}</span>
                      <span>•</span>
                      <span>{new Date(a.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  <div className="flex-1 px-4">
                    <p className="text-sm text-gray-700 italic">
                      {a.diagnostic ? (a.diagnostic.length > 60 ? a.diagnostic.substring(0, 60) + "..." : a.diagnostic) : "Pas de diagnostic"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-medium">
                      Confiance : {a.confiance}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-400 italic">Aucune alerte récente à afficher.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}