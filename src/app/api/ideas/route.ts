import { NextResponse } from "next/server";
import { IdeaInput, IdeaUpdate } from "@/types/schema";
import { prisma } from "@/lib/prisma";
import { hit } from "@/lib/ratelimit";

export const runtime = "nodejs"; // Prisma needs Node

function serialize(i: { id: number; title: string; note: string; tags: unknown; created_at: Date }) {
    return {
      id: i.id,
      title: i.title,
      note: i.note,
      tags: Array.isArray(i.tags) ? i.tags : [],
      created_at: i.created_at.toISOString(),
    };
  }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
  const cursor = searchParams.get("cursor"); // pass last id from client

  const rows = await prisma.idea.findMany({
    take: limit,
    ...(cursor ? { skip: 1, cursor: { id: Number(cursor) } } : {}),
    orderBy: { id: "desc" },
  });

  const ideas = rows.map(serialize);
  const nextCursor = ideas.length ? ideas[ideas.length - 1].id : null;

  return NextResponse.json({ ideas, nextCursor });
}

export async function POST(req: Request) {
    const headers = req.headers;
    const ip = (headers.get("x-forwarded-for") ?? "").split(",")[0] || "local";
    const rl = hit(`write:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

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
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Invalid input";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
  }

  export async function DELETE(req: Request) {
    const headers = req.headers;
    const ip = (headers.get("x-forwarded-for") ?? "").split(",")[0] || "local";
    const rl = hit(`write:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  
    await prisma.idea.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  
  export async function PATCH(req: Request) {
    const headers = req.headers;
    const ip = (headers.get("x-forwarded-for") ?? "").split(",")[0] || "local";
    const rl = hit(`write:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

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
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Invalid input";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
  }
