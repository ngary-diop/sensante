interface StatCardProps {
  titre: string;
  valeur: number;
  unite: string;
  couleur: string;
}

export default function StatCard({
  titre, valeur, unite, couleur
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative overflow-hidden group`}>
      <div className={`absolute top-0 left-0 w-full h-1.5 ${couleur.replace('border-', 'bg-')}`} />
      
      <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-gray-700 transition-colors">
        {titre}
      </p>
      
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-black text-gray-900 tracking-tight">
          {valeur.toLocaleString()}
        </p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {unite}
        </p>
      </div>
    </div>
  );
}

