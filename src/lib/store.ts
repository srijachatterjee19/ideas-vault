import { promises as fs } from "fs";
import path from "path";

const file = path.join(process.cwd(), "data", "ideas.json");

export async function readIdeas() {
  try {
    const txt = await fs.readFile(file, "utf-8");
    return JSON.parse(txt) as any[];
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, "[]");
    return [];
  }
}

export async function writeIdeas(ideas: any[]) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(ideas, null, 2));
}
