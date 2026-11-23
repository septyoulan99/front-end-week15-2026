import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(todos);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();

    if (!title) {
      return NextResponse.json(
        { error: "Judul tidak boleh kosong" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: { title },
    });
    return NextResponse.json(todo, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal menambah data (SQLite di Vercel bersifat read-only)" },
      { status: 500 }
    );
  }
}