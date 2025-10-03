import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { photos } = await req.json()

    // Update positions in a transaction
    await prisma.$transaction(
      photos.map((photo: { id: string; position: number }) =>
        prisma.photo.update({
          where: { id: photo.id },
          data: { position: photo.position },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reordering photos:", error)
    return NextResponse.json(
      { error: "Failed to reorder photos" },
      { status: 500 }
    )
  }
}
