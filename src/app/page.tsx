"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Client-side schema
const IdeaInput = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 chars"),
  note: z.string().min(1, "Note is required").max(500, "Max 500 chars"),
  tags: z.array(z.string()).max(5, "Max 5 tags"),
});

type Idea = {
  id: number;
  title: string;
  note: string;
  tags: string[];
  created_at: string;
};

export default function Home() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);

  // Create form
  const [form, setForm] = useState({ title: "", note: "", tags: "" });
  // Search filter
  const [search, setSearch] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", note: "", tags: "" });

  async function load() {
    setLoading(true);
    const res = await fetch("/api/ideas", { cache: "no-store" });
    const data = await res.json();
    setIdeas(data.ideas);
    setLoading(false);
  }

  useEffect(() => {
    // Check authentication first
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        setAuthenticated(true);
        load();
      } catch (err) {
        router.push("/login");
      }
    };
    
    checkAuth();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLogoutDropdown && !(event.target as Element).closest('.relative')) {
        setShowLogoutDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLogoutDropdown]);

  // Create new idea
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);

    const parsed = IdeaInput.safeParse({ title: form.title, note: form.note, tags });
    if (!parsed.success) {
      setError(parsed.error.errors.map(er => er.message).join(" • "));
      return;
    }

    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const j = await res.json();
      setError(j.error ?? "Failed to create idea");
      return;
    }
    const created: Idea = await res.json();
    setIdeas(prev => [created, ...prev]);
    setForm({ title: "", note: "", tags: "" });
  }

  // Delete idea
  async function remove(id: number) {
    const prev = ideas;
    setIdeas(ideas.filter(i => i.id !== id)); // optimistic
    const res = await fetch(`/api/ideas?id=${id}`, { method: "DELETE" });
    if (!res.ok) setIdeas(prev);
  }

  // Logout function
  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      setAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  // Edit handlers
  function startEdit(i: Idea) {
    setEditingId(i.id);
    setEditForm({ title: i.title, note: i.note, tags: i.tags.join(", ") });
  }
  function cancelEdit() {
    setEditingId(null);
    setEditForm({ title: "", note: "", tags: "" });
  }
  async function saveEdit() {
    if (editingId == null) return;
    setError(null);
    const tags = editForm.tags.split(",").map(t => t.trim()).filter(Boolean);

    const parsed = IdeaInput.safeParse({ title: editForm.title, note: editForm.note, tags });
    if (!parsed.success) {
      setError(parsed.error.errors.map(er => er.message).join(" • "));
      return;
    }

    const prev = ideas;
    const nextLocal = ideas.map(i => (i.id === editingId ? { ...i, ...parsed.data } : i));
    setIdeas(nextLocal);

    const res = await fetch(`/api/ideas?id=${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      setIdeas(prev);
      const j = await res.json();
      setError(j.error ?? "Failed to update idea");
      return;
    }

    const updated: Idea = await res.json();
    setIdeas(list => list.map(i => (i.id === updated.id ? updated : i)));
    cancelEdit();
  }

  // Filtered ideas
  const filtered = ideas.filter(i => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      i.title.toLowerCase().includes(q) ||
      i.note.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Idea Vault</h1>
        {authenticated && (
          <div className="relative">
            <button
              onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
              className="text-sm border rounded-lg px-3 py-1 hover:bg-black/5 flex items-center gap-2"
            >
              Account
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showLogoutDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-black border border-gray-300 rounded-lg shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create form */}
      {authenticated && (
        <form
          onSubmit={submit}
          className="grid gap-3 mb-6 bg-white/5 border rounded-2xl p-4"
        >
        <input
          className="border rounded-lg p-2"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="border rounded-lg p-2"
          placeholder="Note"
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
          required
        />
        <input
          className="border rounded-lg p-2"
          placeholder="tags (comma separated)"
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          className="justify-self-start rounded-xl px-4 py-2 border hover:bg-black/5"
          type="submit"
        >
          Add
        </button>
        </form>
      )}

      {/* Search */}
      <input
        className="border rounded-lg p-2 mb-4 w-full"
        placeholder="Search by title, note, or tag…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* List */}
      {loading ? (
        <p>Loading…</p>
      ) : filtered.length ? (
        <ul className="grid gap-3">
          {filtered.map(i => (
            <li key={i.id} className="rounded-2xl border p-4 bg-white/5">
              <div className="flex items-center justify-between gap-3">
                {editingId === i.id ? (
                  <input
                    className="border rounded-lg p-2 w-full mr-2"
                    value={editForm.title}
                    onChange={e =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                ) : (
                  <h2 className="font-semibold">{i.title}</h2>
                )}

                {editingId === i.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="text-xs border rounded-lg px-2 py-1 hover:bg-black/5"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-xs border rounded-lg px-2 py-1 hover:bg-black/5"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  authenticated && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(i)}
                        className="text-xs border rounded-lg px-2 py-1 hover:bg-black/5"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(i.id)}
                        className="text-xs border rounded-lg px-2 py-1 hover:bg-black/5"
                      >
                        Delete
                      </button>
                    </div>
                  )
                )}
              </div>

              {editingId === i.id ? (
                <>
                  <textarea
                    className="border rounded-lg p-2 mt-2 w-full"
                    value={editForm.note}
                    onChange={e =>
                      setEditForm({ ...editForm, note: e.target.value })
                    }
                  />
                  <input
                    className="border rounded-lg p-2 mt-2 w-full"
                    placeholder="tags (comma separated)"
                    value={editForm.tags}
                    onChange={e =>
                      setEditForm({ ...editForm, tags: e.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <p className="text-sm mt-1">{i.note}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {i.tags.map(t => (
                      <span
                        key={t}
                        className="text-xs border rounded-full px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <p className="text-xs text-gray-500 mt-2">
                {new Date(i.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No matching ideas found.</p>
      )}
    </main>
  );
}
