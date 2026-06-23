import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filepath = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
