import OpenAI from "openai";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getClient() {
  return new OpenAI({
    apiKey: process.env.ALIBABA_API_KEY!,
    baseURL: process.env.ALIBABA_API_BASE!,
  });
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { message, history } = await req.json();
  if (!message?.trim()) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  // Persist user message
  await prisma.message.create({
    data: { role: "user", content: message, userId: user.id },
  });

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: "You are a helpful AI assistant." },
    ...(history ?? []),
    { role: "user", content: message },
  ];

  const stream = await getClient().chat.completions.create({
    model: process.env.ALIBABA_MODEL ?? "qwen-plus",
    messages,
    stream: true,
  });

  const encoder = new TextEncoder();
  let fullReply = "";

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          fullReply += delta;
          controller.enqueue(encoder.encode(delta));
        }
      }
      // Persist assistant reply after stream finishes
      if (fullReply) {
        await prisma.message.create({
          data: { role: "assistant", content: fullReply, userId: user.id },
        });
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function GET() {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true, createdAt: true },
  });

  return Response.json({ messages });
}
