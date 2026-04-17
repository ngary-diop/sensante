export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <ul className="space-y-2">
        <li className="font-semibold text-gray-700">Dashboard</li>
        <li className="text-gray-600">Patients</li>
        <li className="text-gray-600">Consultations</li>
      </ul>
    </aside>
  );
}
