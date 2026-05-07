import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const consultations = await prisma.consultation.findMany({
    include: {
      patient: true,
      user: true,
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(consultations);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { patientId, symptomes, notes } = body;

    if (!patientId || !symptomes) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur connecté via son email
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const consultation = await prisma.consultation.create({
      data: {
        patientId: Number(patientId),
        userId: user.id,
        symptomes: symptomes, // symptomes est déjà un tableau de strings, le schéma Prisma accepte Json
        notes: notes || "",
        statut: "en_attente",
      },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la consultation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
