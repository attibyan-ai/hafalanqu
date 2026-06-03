import { NextResponse } from "next/server";

function disabledAdminCreation() {
  return NextResponse.json(
    { error: "Pembuatan admin lewat API dinonaktifkan. Gunakan script create-admin di server." },
    { status: 410 }
  );
}

export async function GET() {
  return disabledAdminCreation();
}

export async function POST() {
  return disabledAdminCreation();
}
