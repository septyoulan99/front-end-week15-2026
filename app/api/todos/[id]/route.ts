import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.todo.update({
      where: { id: Number(id) },
      data: {
        ...(body.title !== undefined
          ? { title: String(body.title).trim() }
          : {}),
        ...(body.completed !== undefined
          ? { completed: Boolean(body.completed) }
          : {}),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengubah data (SQLite di Vercel bersifat read-only)" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  void request;
  try {
    const { id } = await params;

    await prisma.todo.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus data (SQLite di Vercel bersifat read-only)" },
      { status: 500 }
    );
  }
}