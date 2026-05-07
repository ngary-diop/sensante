import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { nom, prenom, email, password } = await req.json();

  if (!nom || !prenom || !email || !password) {
    return NextResponse.json(
      { error: "Tous les champs sont obligatoires" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email déjà utilisé" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        password: hashedPassword,
        role: "AGENT", // rôle par défaut de ton schéma
      },
    });

    return NextResponse.json(
      { message: "Compte créé avec succès", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return NextResponse.json(
      { error: "Erreur serveur ou problème de connexion à la base de données." },
      { status: 500 }
    );
  }
}
