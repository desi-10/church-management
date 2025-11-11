import { prisma } from "@/utils/db";
import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  const attendances = await prisma.attendance.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json({ success: true, data: attendances });
});

export const POST = asyncHandler(async (req: Request) => {
  const body = await req.json();
  const { firstname, lastname, status, date, memberId } = body;

  const attendance = await prisma.attendance.create({
    data: {
      firstname: firstname || "",
      lastname: lastname || "",
      status:
        status === "Present"
          ? "PRESENT"
          : status === "Absent"
          ? "ABSENT"
          : "LATE",
      date: date ? new Date(date) : new Date(),
      memberId: memberId || null,
    },
  });

  return NextResponse.json(
    { success: true, data: attendance },
    { status: 201 }
  );
});
