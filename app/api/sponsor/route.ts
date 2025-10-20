import { GasStationClient } from "@shinami/clients/sui";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { txKind, sender } = await request.json();

    if (!txKind || !sender) {
      return NextResponse.json(
        { error: "Missing txKind or sender" },
        { status: 400 }
      );
    }

    const ACCESS_KEY = process.env.NEXT_PUBLIC_SHINAMI_ACCESS_KEY;

    if (!ACCESS_KEY) {
      return NextResponse.json(
        { error: "Missing Shinami access key" },
        { status: 500 }
      );
    }

    const gas = new GasStationClient(ACCESS_KEY);

    // Get sponsorship from Shinami Gas Station
    const sponsorship = await gas.sponsorTransaction({
      txKind,
      sender,
    });

    return NextResponse.json(sponsorship);
  } catch (error: any) {
    console.error("Error sponsoring transaction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sponsor transaction" },
      { status: 500 }
    );
  }
}
