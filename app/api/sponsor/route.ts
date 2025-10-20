import { GasStationClient } from "@shinami/clients/sui";
import { NextRequest, NextResponse } from "next/server";

// Force Node.js runtime
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { txKind, sender } = await request.json();

    console.log("Received request:", { txKind: txKind.slice(0, 50), sender });

    if (!txKind || !sender) {
      return NextResponse.json(
        { error: "Missing txKind or sender" },
        { status: 400 }
      );
    }

    const ACCESS_KEY = process.env.NEXT_PUBLIC_SHINAMI_ACCESS_KEY;

    if (!ACCESS_KEY) {
      console.error("Missing ACCESS_KEY");
      return NextResponse.json(
        { error: "Missing Shinami access key" },
        { status: 500 }
      );
    }

    console.log("Creating GasStationClient...");
    const gas = new GasStationClient(ACCESS_KEY);

    console.log("Sponsoring transaction...");
    const sponsorship = await gas.sponsorTransaction({
      txKind,
      sender,
    });

    console.log("Sponsorship successful:", sponsorship);
    return NextResponse.json(sponsorship);
  } catch (error: any) {
    console.error("Error sponsoring transaction:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: error.message || "Failed to sponsor transaction",
        details: error.stack,
      },
      { status: 500 }
    );
  }
}
