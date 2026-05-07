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

  // Ne pas recréer les patients/consultations s'ils existent déjà pour ne pas surcharger, 
  // mais ici on s'assure que les bases sont là.
  const totalPatients = await prisma.patient.count();
  if (totalPatients === 0) {
    console.log('Peuplement des données de test...');
    // (Le reste du code de création de patients/consultations si nécessaire)
    // Pour cette mise à jour, on se concentre sur les noms des membres.
  }

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
