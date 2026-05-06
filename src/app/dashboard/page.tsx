"use client";

import { useEffect, useState } from "react";
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
    return <p className="text-gray-500">Chargement du dashboard...</p>;
  }

  if (!stats) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Tableau de bord
      </h1>

      {/* Zone 1 : KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
          <p className="text-sm text-gray-500">Patients</p>
          <p className="text-3xl font-bold text-gray-800">{stats.kpi.totalPatients}</p>
          <p className="text-xs text-gray-400">enregistrés</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <p className="text-sm text-gray-500">Consultations</p>
          <p className="text-3xl font-bold text-gray-800">{stats.kpi.totalConsultations}</p>
          <p className="text-xs text-gray-400">au total</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Diagnostics IA</p>
          <p className="text-3xl font-bold text-gray-800">{stats.kpi.consultationsTerminees}</p>
          <p className="text-xs text-gray-400">terminés</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Alertes</p>
          <p className="text-3xl font-bold text-gray-800">{stats.kpi.alertesUrgentes}</p>
          <p className="text-xs text-gray-400">urgentes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Zone 2 : Graphique barres */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Consultations par mois
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.parMois}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#E65100" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Zone 4 : Pie chart régions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Patients par région
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.parRegion}
                dataKey="total"
                nameKey="region"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {stats.parRegion.map((_, i) => (
                  <Cell key={i} fill={COULEURS_PIE[i % COULEURS_PIE.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone 3 : Dernières alertes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Derniers diagnostics IA
        </h2>
        <div className="space-y-3">
          {stats.dernieresAlertes.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div>
                <p className="font-semibold text-gray-800">{a.patient}</p>
                <p className="text-sm text-gray-500">
                  {a.region} —{" "}
                  {new Date(a.date).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700">
                  {a.diagnostic ? a.diagnostic.substring(0, 50) + "..." : "—"}
                </p>
                <p className="text-xs text-gray-500">
                  Confiance : {a.confiance}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}