import { prisma } from "@/utils/db";
import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(
  async (_req: Request, { params }: { params: { id: string } }) => {
    const attendance = await prisma.attendance.findUnique({
      where: { id: params.id },
    });

    if (!attendance) {
      return NextResponse.json(
        { success: false, message: "Attendance not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: attendance });
  }
);

export const PUT = asyncHandler(
  async (req: Request, { params }: { params: { id: string } }) => {
    const body = await req.json();
    const { firstname, lastname, status, date } = body;

    const attendance = await prisma.attendance.update({
      where: { id: params.id },
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
      },
    });

    return NextResponse.json({ success: true, data: attendance });
  }
);

export const DELETE = asyncHandler(
  async (_req: Request, { params }: { params: { id: string } }) => {
    await prisma.attendance.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Attendance deleted" });
  }
);
