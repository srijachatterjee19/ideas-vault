import { promises as fs } from "fs";
import path from "path";
import type { Idea } from "@/types/schema";

const file = path.join(process.cwd(), "data", "ideas.json");

export async function readIdeas(): Promise<Idea[]> {
  try {
    const txt = await fs.readFile(file, "utf-8");
    return JSON.parse(txt) as Idea[];
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, "[]");
    return [];
  }
}

export async function writeIdeas(ideas: Idea[]): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(ideas, null, 2));
}

export function serialize(i: { id: number; title: string; note: string; tags: string[]; created_at: Date }): Idea {
  return {
    id: i.id,
    title: i.title,
    note: i.note,
    tags: i.tags,
    created_at: i.created_at.toISOString(),
  };
}
