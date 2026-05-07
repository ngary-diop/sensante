import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Début du peuplement de la base de données (SénSanté Team + Data)...')

  // 1. Création des Utilisateurs (L'équipe complète)
  const membres = [
    { prenom: "Le Gardien",    nom: "Diop",    email: "gardien@sensante.sn",    password: "gardien123",    role: "AGENT"   },
    { prenom: "L'Architecte",  nom: "Diop",    email: "architecte@sensante.sn", password: "architecte123", role: "ADMIN"   },
    { prenom: "Le Bouclier",   nom: "Diop",    email: "bouclier@sensante.sn",   password: "bouclier123",   role: "AGENT"   },
    { prenom: "Le Médecin",    nom: "Diop",    email: "medecin@sensante.sn",    password: "medecin123",    role: "MEDECIN" },
    { prenom: "L'Oracle",      nom: "Diop",    email: "oracle@sensante.sn",     password: "oracle123",     role: "AGENT"   },
    { prenom: "Le Pilote",     nom: "Diop",    email: "pilote@sensante.sn",     password: "pilote123",     role: "AGENT"   },
    { prenom: "Admin",         nom: "SénSanté", email: "admin@sensante.sn",      password: "password123",   role: "ADMIN"   },
  ];

  const usersCreated = [];
  for (const m of membres) {
    const hashed = await bcrypt.hash(m.password, 10);
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: { password: hashed },
      create: {
        nom: m.nom,
        prenom: m.prenom,
        email: m.email,
        password: hashed,
        role: m.role as "AGENT" | "MEDECIN" | "ADMIN",
      },
    });
    usersCreated.push(user);
    console.log(`✅ ${m.prenom} prêt : ${user.email}`);
  }

  const admin = usersCreated.find(u => u.email === 'admin@sensante.sn')!;

  // 2. Création de Patients (40 patients)
  const regions = ['Dakar', 'Thiès', 'Saint-Louis', 'Touba', 'Ziguinchor', 'Louga', 'Kaolack', 'Kolda', 'Matam', 'Fatick']
  const prenoms = ['Moussa', 'Awa', 'Ibrahima', 'Fatou', 'Ousmane', 'Mariama', 'Modou', 'Khadidiatou', 'Cheikh', 'Astou']
  const noms = ['Diop', 'Ndiaye', 'Sarr', 'Fall', 'Sene', 'Gueye', 'Ba', 'Sow', 'Diallo', 'Faye']

  console.log('Création des patients...')
  for (let i = 0; i < 40; i++) {
    const naissance = new Date()
    naissance.setFullYear(naissance.getFullYear() - (20 + (i % 50)))
    
    await prisma.patient.create({
      data: {
        prenom: prenoms[i % prenoms.length],
        nom: noms[Math.floor(i / 4) % noms.length],
        dateNaissance: naissance,
        sexe: i % 2 === 0 ? 'M' : 'F',
        telephone: `77${Math.floor(1000000 + Math.random() * 9000000)}`,
        adresse: 'Rue ' + (i + 1),
        region: regions[i % regions.length],
      },
    })
  }

  // 3. Création de Consultations (150 consultations)
  console.log('Création des consultations...')
  const patientsList = await prisma.patient.findMany()
  const diagnostics = [
    'Paludisme simple suspecté', 
    'Infection respiratoire aiguë', 
    'Hypertension artérielle légère', 
    'Grippe saisonnière', 
    'Anémie ferriprive',
    'Gastro-entérite'
  ]

  for (let i = 0; i < 150; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6))
    date.setDate(Math.floor(Math.random() * 28) + 1)

    const patient = patientsList[i % patientsList.length]
    const isUrgent = Math.random() > 0.8

    await prisma.consultation.create({
      data: {
        date: date,
        symptomes: { texte: 'Symptômes variés pour test dashboard...', temperature: 37 + Math.random() * 2 },
        diagnosticIa: isUrgent ? 'URGENT: ' + diagnostics[i % diagnostics.length] : diagnostics[i % diagnostics.length],
        confiance: 50 + Math.floor(Math.random() * 45),
        statut: 'termine',
        notes: 'Notes de test pour le dashboard',
        patientId: patient.id,
        userId: admin.id,
      },
    })
  }

  console.log('Base de données synchronisée et peuplée !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
