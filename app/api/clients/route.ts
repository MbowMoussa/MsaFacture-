import { NextResponse } from "next/server";
import { MOCK_CLIENTS } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_CLIENTS,
    count: MOCK_CLIENTS.length,
  });
}
