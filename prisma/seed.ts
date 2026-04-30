import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const membres = [
    { prenom: "Le Gardien",    nom: "Diop",    email: "gardien@sensante.sn",    password: "gardien123",    role: "AGENT"   },
    { prenom: "L'Architecte",  nom: "Diop",    email: "architecte@sensante.sn", password: "architecte123", role: "ADMIN"   },
    { prenom: "Le Bouclier",   nom: "Diop",    email: "bouclier@sensante.sn",   password: "bouclier123",   role: "AGENT"   },
    { prenom: "Le Médecin",    nom: "Diop",    email: "medecin@sensante.sn",    password: "medecin123",    role: "MEDECIN" },
    { prenom: "L'Oracle",      nom: "Diop",    email: "oracle@sensante.sn",     password: "oracle123",     role: "AGENT"   },
    { prenom: "Le Pilote",     nom: "Diop",    email: "pilote@sensante.sn",     password: "pilote123",     role: "AGENT"   },
  ];

  for (const m of membres) {
    const hashed = await bcrypt.hash(m.password, 10);
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: {
        nom: m.nom,
        prenom: m.prenom,
        email: m.email,
        password: hashed,
        role: m.role as "AGENT" | "MEDECIN" | "ADMIN",
      },
    });
    console.log(`✅ ${m.prenom} créé : ${user.email} / mdp: ${m.password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
