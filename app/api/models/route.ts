import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

export async function GET() {
  try {
    const models = await ai.models.list();

    return NextResponse.json(models);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}