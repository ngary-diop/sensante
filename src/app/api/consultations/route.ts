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
      user: {
        select: { nom: true, prenom: true, role: true },
      },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(consultations);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { patientId, symptomes, notes } = body;

    if (!patientId || !symptomes) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
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
        symptomes: symptomes,
        notes: notes || null,
        statut: "en_attente",
      },
      include: { patient: true },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la consultation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
