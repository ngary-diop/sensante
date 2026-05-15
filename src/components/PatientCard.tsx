import { User, MapPin, Calendar, Heart } from "lucide-react";

interface PatientCardProps {
  nom: string;
  region: string;
  age: number;
  sexe: "M" | "F";
}

export default function PatientCard({ nom, region, age, sexe }: PatientCardProps) {
  const genderColor = sexe === "F"
    ? "text-pink-500 bg-pink-50 border-pink-100"
    : "text-blue-500 bg-blue-50 border-blue-100";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:border-yellow-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-yellow-50 transition-colors">
          <User className="w-6 h-6 text-gray-400 group-hover:text-yellow-600" />
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${genderColor}`}>
          {sexe === "F" ? "Femme" : "Homme"}
        </div>
      </div>
      
      <h3 className="text-lg font-black text-gray-900 mb-3 group-hover:text-yellow-700 transition-colors">
        {nom}
      </h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{region}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{age} ans</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-50 flex justify-end">
        <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
