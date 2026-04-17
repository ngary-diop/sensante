import PatientCard from "@/components/PatientCard";
export default function Home() {
return (
<main className="min-h-screen bg-gray -50 p-8">
<h1 className="text -3xl font-bold text-teal-700 mb-6">
SénSanté
</h1>
<h2 className="text-xl font-semibold text-gray -700 mb-4">
Patients
</h2>
<div className="grid grid-cols -1 md:grid-cols -3 gap -4">
<PatientCard
nom="Ndeye Laye THIAW" role="Pilote" groupe="G-7"
/>
<PatientCard
nom="Fatou Kiné SOW" role="Architecte" groupe="G-8"
/>
<PatientCard
nom="Mouhamed SECK" role="Gardien" groupe="G-9"
/>
</div>
<p className="text-xs text-gray -400 italic mt-8">
Ceci n'est pas un outil médical.
Consultez un professionnel de santé.
</p>
</main>
);
}