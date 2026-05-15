"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import Link from "next/link";
import { 
  LayoutDashboard, TrendingUp, AlertCircle, 
  CheckCircle2, Map, Clock, ArrowUpRight, 
  Plus, Bell, Search, Download, Activity
} from "lucide-react";

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

const COULEURS_PIE = ["#FACC15", "#EAB308", "#FEF08A", "#71717a", "#a1a1aa", "#d4d4d8"];

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
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-yellow-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="mt-6 text-gray-400 font-black animate-pulse uppercase tracking-[0.2em] text-xs">
          Synchronisation...
        </p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-[1400px] mx-auto py-6 px-4">
      {/* Header Bento */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Console de Commandes</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            Bonjour, <span className="text-yellow-500 underline decoration-yellow-200 underline-offset-8">Gardien</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Recherche rapide..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none w-64 shadow-sm" />
          </div>
          <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-yellow-500 shadow-sm transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <Link href="/consultations" className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95">
            <Plus className="w-4 h-4" /> Nouvelle Analyse
          </Link>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Main Stats Area (Bento Left) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Top KPIs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard titre="Patients" valeur={stats.kpi.totalPatients} unite="Total" couleur="border-yellow-400" />
            <StatCard titre="Consultations" valeur={stats.kpi.totalConsultations} unite="Flux" couleur="border-gray-200" />
            <StatCard titre="Analyses" valeur={stats.kpi.consultationsTerminees} unite="IA" couleur="border-yellow-600" />
            <div className="bg-red-500 rounded-2xl p-6 text-white shadow-lg shadow-red-200 group hover:scale-[1.02] transition-transform">
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Urgences</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">{stats.kpi.alertesUrgentes}</span>
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
              <p className="text-[10px] mt-2 font-bold bg-white/20 inline-block px-2 py-0.5 rounded">Action Requise</p>
            </div>
          </div>

          {/* Activity Graph (Large Card) */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-50 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Activité Mensuelle</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase">Volume des consultations 2024</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.parMois}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#facc15" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Diagnostics Table */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-gray-900">Diagnostics IA</h2>
            <Link href="/consultations" className="flex items-center gap-2 text-xs font-black text-yellow-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
              Voir tout <ArrowUpRight className="w-4 h-4" />
            </Link>
            </div>
            <div className="space-y-3">
              {stats.dernieresAlertes.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-100/50 transition-all border border-transparent hover:border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-white shadow-lg shadow-yellow-100">
                      {a.patient.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 leading-none mb-1 group-hover:text-yellow-600 transition-colors">{a.patient}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{a.region} • {new Date(a.date).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  <div className="hidden md:block flex-1 px-10">
                    <p className="text-xs text-gray-500 font-medium line-clamp-1 italic italic">"{a.diagnostic}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {a.confiance}% IA
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-gray-300 group-hover:text-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Bento Right) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Map/Region Bento */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gray-50 rounded-2xl">
                <Map className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Zones Actives</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase">Répartition Régionale</p>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={stats.parRegion} 
                    dataKey="total" nameKey="region" 
                    cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8}
                    label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {stats.parRegion.map((_, i) => (
                      <Cell key={i} fill={COULEURS_PIE[i % COULEURS_PIE.length]} className="outline-none" />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-10 space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Flux de Travail</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Clock className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Temps de réponse IA</span>
                </div>
                <span className="text-sm font-black text-gray-900">1.2s</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Activity className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Santé Système</span>
                </div>
                <span className="text-sm font-black text-green-600">Optimum</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}