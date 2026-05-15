import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Mise à jour des membres de l\'équipe SénSanté...')

  const membres = [
    { prenom: "Aiou",              nom: "LOUM",     email: "gardien@sensante.sn",    password: "gardien123",    role: "AGENT"   },
    { prenom: "L'Architecte",      nom: "SénSanté", email: "architecte@sensante.sn", password: "architecte123", role: "ADMIN"   },
    { prenom: "Seydina Ababacar Counta", nom: "DIOUM",    email: "bouclier@sensante.sn",   password: "bouclier123",   role: "AGENT"   },
    { prenom: "Mamadou Lamarana",  nom: "DOUCOURE", email: "medecin@sensante.sn",    password: "medecin123",    role: "MEDECIN" },
    { prenom: "Mouhamad Youssouf", nom: "DIOUM",    email: "oracle@sensante.sn",     password: "oracle123",     role: "AGENT"   },
    { prenom: "Ndeye Laye",        nom: "THIAW",    email: "pilote@sensante.sn",     password: "pilote123",     role: "AGENT"   },
    { prenom: "Admin",             nom: "SénSanté", email: "admin@sensante.sn",      password: "password123",   role: "ADMIN"   },
  ];

  for (const m of membres) {
    const hashed = await bcrypt.hash(m.password, 10);
    await prisma.user.upsert({
      where: { email: m.email },
      update: {
        nom: m.nom,
        prenom: m.prenom,
      },
      create: {
        nom: m.nom,
        prenom: m.prenom,
        email: m.email,
        password: hashed,
        role: m.role as "AGENT" | "MEDECIN" | "ADMIN",
      },
    });
    console.log(`✅ Membre mis à jour : ${m.prenom} ${m.nom}`);
  }

  // Peuple avec plus de données
  console.log('Peuplement des données médicales...');

  const regions = ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Louga", "Matam"];
  const symptomesList = [
    ["Fièvre", "Maux de tête", "Fatigue"],
    ["Toux sèche", "Difficultés respiratoires"],
    ["Douleurs abdominales", "Nausées"],
    ["Éruptions cutanées", "Démangeaisons"],
    ["Palpitations", "Vertiges"]
  ];

  // Récupérer le premier utilisateur (Le Gardien) pour lier les consultations
  const gardien = await prisma.user.findFirst({ where: { email: "gardien@sensante.sn" } });
  const userId = gardien ? gardien.id : 1;

  const nomsSene = ["Diop", "Ndiaye", "Faye", "Ba", "Sow", "Fall", "Sy", "Gueye", "Sane", "Diatta"];
  const prenomsSene = ["Moussa", "Fatou", "Abdoulaye", "Aissatou", "Ousmane", "Khady", "Ibrahima", "Mariama", "Cheikh", "Seynabou"];

  for (let i = 0; i < 10; i++) {
    const patient = await prisma.patient.create({
      data: {
        nom: nomsSene[i],
        prenom: prenomsSene[i],
        dateNaissance: new Date(1960 + Math.floor(Math.random() * 40), i % 12, 1),
        sexe: i % 2 === 0 ? "M" : "F",
        telephone: `77${Math.floor(1000000 + Math.random() * 8999999)}`,
        adresse: `Quartier ${i + 1}, Villa ${10 + i}`,
        region: regions[Math.floor(Math.random() * regions.length)],
      }
    });

    // Créer 2 consultations par patient
    for (let j = 1; j <= 2; j++) {
      await prisma.consultation.create({
        data: {
          patientId: patient.id,
          userId: userId, // Ajout de l'ID utilisateur obligatoire
          symptomes: symptomesList[Math.floor(Math.random() * symptomesList.length)],
          notes: `Consultation de suivi numéro ${j} pour ${patient.prenom}.`,
          statut: j === 1 ? "termine" : "en_attente",
          diagnosticIa: j === 1 ? "Suspicion de paludisme léger à confirmer par test TDR." : null,
          confiance: j === 1 ? 85 : null,
        }
      });
    }
  }

  console.log('✅ Base de données enrichie avec 10 patients et 20 consultations !');
  console.log('Équipe SénSanté synchronisée !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
