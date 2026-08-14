import { NextResponse } from "next/server";
import { MOCK_INVOICES } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_INVOICES,
    count: MOCK_INVOICES.length,
  });
}
