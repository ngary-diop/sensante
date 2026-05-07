import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Début du peuplement de la base de données (Schéma SénSanté)...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Création des Utilisateurs
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sensante.sn' },
    update: {},
    create: {
      email: 'admin@sensante.sn',
      nom: 'SénSanté',
      prenom: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // 2. Création de Patients
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

  // 3. Création de Consultations
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

  console.log('Peuplement terminé avec succès !')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
