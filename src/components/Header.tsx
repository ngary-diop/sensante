"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User, LogIn, Activity } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-yellow-400 p-2 rounded-lg group-hover:bg-yellow-500 transition-colors">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">
          Sén<span className="text-yellow-500">Santé</span>
        </h1>
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-bold text-gray-900 leading-none">
                {session.user?.name}
              </span>
              <span className="text-xs text-gray-500">
                Agent de santé
              </span>
            </div>
            <div className="bg-gray-100 p-2 rounded-full border border-gray-200">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-bold bg-yellow-400 text-white px-5 py-2.5 rounded-xl hover:bg-yellow-500 transition-all shadow-sm shadow-yellow-200"
          >
            <LogIn className="w-4 h-4" />
            Se connecter
          </Link>
        )}
      </div>
    </header>
  );
}
