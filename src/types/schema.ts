import { z } from "zod";


export const IdeaInput = z.object({
  title: z.string().min(1).max(100),
  note: z.string().min(1).max(500),
  tags: z.array(z.string()).max(5).default([]),
});
export type Idea = {
  id: number;
  title: string;
  note: string;
  tags: string[];
  created_at: string;
};
