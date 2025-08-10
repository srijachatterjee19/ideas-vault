import { NextResponse } from "next/server";
import { readIdeas, writeIdeas } from "@/lib/store";
import { IdeaInput } from "@/types/schema";

export const runtime = "nodejs"; // file I/O requires Node runtime

export async function GET() {
  const ideas = await readIdeas();
  ideas.sort((a: any, b: any) => b.id - a.id);
  return NextResponse.json({ ideas });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = IdeaInput.parse({
      ...body,
      tags: Array.isArray(body.tags)
        ? body.tags.map((t: string) => t.trim()).filter(Boolean)
        : [],
    });

    const ideas = await readIdeas();
    const id = ideas.length ? Math.max(...ideas.map((i: any) => i.id)) + 1 : 1;
    const created = {
      id,
      title: parsed.title,
      note: parsed.note,
      tags: parsed.tags,
      created_at: new Date().toISOString(),
    };
    ideas.push(created);
    await writeIdeas(ideas);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Invalid input" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const ideas = await readIdeas();
  const next = ideas.filter((i: any) => i.id !== id);
  await writeIdeas(next);
  return NextResponse.json({ ok: true });
}
