
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not configured" },
        { status: 500 }
      );
    }

    if (typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    const input = Buffer.from(password);
    const expected = Buffer.from(adminPassword);

    const valid =
      input.length === expected.length &&
      timingSafeEqual(input, expected);

    if (!valid) {
      return NextResponse.json(
        { error: "Wrong password" },
        { status: 401 }
      );
    }

    await createSession();

    return NextResponse.json({
      ok: true,
      message: "Login successful"
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { error: "Login server error" },
      { status: 500 }
    );
  }
}
