import { NextResponse } from "next/server";

import { getAllChats } from "@/lib/content";
import { answerSearch, buildSearchCorpus, retrieveRelevantSources } from "@/lib/search";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string };
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { answer: "请输入要搜索的问题。", sources: [] },
        { status: 400 },
      );
    }

    const chats = await getAllChats();
    const corpus = buildSearchCorpus(chats);
    const sources = retrieveRelevantSources(query, corpus);
    const result = await answerSearch(query, sources);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Search request failed", error);
    return NextResponse.json(
      { answer: "AI Search 暂时不可用，请稍后重试。", sources: [] },
      { status: 500 },
    );
  }
}
