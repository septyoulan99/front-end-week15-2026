import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TodoApp from "./components/TodoApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const todos = await prisma.todo.findMany({
    select: {
      id: true,
      title: true,
      completed: true,
    },
    orderBy: { id: "desc" },
  });

  return (
    <main
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>Todo List (Prisma 7 + SQLite)</h1>
        <Link href="/about">About</Link>
      </div>
      <TodoApp initialTodos={todos} />
    </main>
  );
}