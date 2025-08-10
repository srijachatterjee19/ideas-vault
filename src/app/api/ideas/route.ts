import { NextResponse } from "next/server";
import { readIdeas, writeIdeas } from "@/lib/store";
import { IdeaInput,IdeaUpdate } from "@/types/schema";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // file I/O requires Node runtime

function serialize(i: any) {
    return {
      id: i.id,
      title: i.title,
      note: i.note,
      tags: Array.isArray(i.tags) ? i.tags : [], // Prisma JSON → JS array
      created_at: i.created_at.toISOString(),
    };
  }

export async function GET() {
  const rows = await prisma.idea.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json({ ideas: rows.map(serialize) });
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
  
      const created = await prisma.idea.create({
        data: {
          title: parsed.title,
          note: parsed.note,
          tags: parsed.tags, // JSON column
        },
      });
      return NextResponse.json(serialize(created), { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ error: e.message ?? "Invalid input" }, { status: 400 });
    }
  }

  export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  
    await prisma.idea.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  
  export async function PATCH(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  
    try {
      const body = await req.json();
      const parsed = IdeaUpdate.parse({
        ...body,
        tags: Array.isArray(body.tags)
          ? body.tags.map((t: string) => t.trim()).filter(Boolean)
          : body.tags, // allow undefined
      });
  
      const updated = await prisma.idea.update({
        where: { id },
        data: {
          ...(parsed.title !== undefined ? { title: parsed.title } : {}),
          ...(parsed.note !== undefined ? { note: parsed.note } : {}),
          ...(parsed.tags !== undefined ? { tags: parsed.tags } : {}),
        },
      });
      return NextResponse.json(serialize(updated));
    } catch (e: any) {
      return NextResponse.json({ error: e.message ?? "Invalid input" }, { status: 400 });
    }
  }
