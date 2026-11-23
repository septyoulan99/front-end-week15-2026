"use client";

import { useState, type FormEvent } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TodoApp({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function refreshTodos() {
    const res = await fetch("/api/todos");
    if (res.ok) {
      const data: Todo[] = await res.json();
      setTodos(data);
    }
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("");
    if (!title.trim()) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menambah data");
      return;
    }

    setTitle("");
    setStatus("Berhasil menambah data");
    await refreshTodos();
  }

  async function handleToggle(todo: Todo) {
    setError("");
    setStatus("");
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal mengubah status");
      return;
    }

    setStatus("Berhasil mengubah status data");
    await refreshTodos();
  }

  async function handleSaveEdit(id: number) {
    setError("");
    setStatus("");
    if (!editingTitle.trim()) return;

    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal mengubah data");
      return;
    }

    setEditingId(null);
    setEditingTitle("");
    setStatus("Berhasil mengubah data");
    await refreshTodos();
  }

  async function handleDelete(id: number) {
    setError("");
    setStatus("");
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menghapus data");
      return;
    }

    setStatus("Berhasil menghapus data");
    await refreshTodos();
  }

  return (
    <div>
      {status && <p style={{ color: "green", marginBottom: 12 }}>{status}</p>}
      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: 8, marginBottom: 20 }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambah tugas baru..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Tambah
        </button>
      </form>

      {todos.length === 0 ? (
        <p>Belum ada data.</p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
              />

              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    style={{ flex: 1, padding: 6 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(todo.id)}
                  >
                    Simpan
                  </button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      flex: 1,
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingTitle(todo.title);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(todo.id)}>
                    Hapus
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}