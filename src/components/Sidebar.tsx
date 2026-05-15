"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ClipboardList, LayoutDashboard, UserCircle, Zap } from "lucide-react";

const liens = [
  { nom: "Accueil", href: "/", icone: Home },
  { nom: "Patients", href: "/patients", icone: Users },
  { nom: "Consultations", href: "/consultations", icone: ClipboardList },
  { nom: "Dashboard", href: "/dashboard", icone: LayoutDashboard },
  { nom: "Mon Profil", href: "/profil", icone: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between">
      <nav className="space-y-1.5 mt-2">
        {liens.map((lien) => {
          const Icon = lien.icone;
          const actif = pathname === lien.href;
          return (
            <Link
              key={lien.href}
              href={lien.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                actif
                  ? "bg-yellow-50 text-yellow-700 shadow-sm shadow-yellow-100/50 font-bold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                actif ? "text-yellow-500" : "text-gray-400 group-hover:text-gray-600"
              }`} />
              <span className="text-[15px]">{lien.nom}</span>
              {actif && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
        <div className="flex items-center gap-2 mb-2 text-yellow-700">
          <Zap className="w-4 h-4 fill-current" />
          <span className="text-xs font-black uppercase tracking-wider">Mode Gardien</span>
        </div>
        <p className="text-[11px] text-yellow-600/80 leading-relaxed">
          Protection active des données patients activée.
        </p>
      </div>
    </aside>
  );
}
