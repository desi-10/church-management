import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as attendanceService from "@/features/attendance/attendance.services";
import { AttendanceDataSchema } from "@/validators/attendance";
import { validateRequestFormData } from "@/utils/validator-helper";
import { TypeofAttendanceData } from "@/validators/attendance";

export const GET = asyncHandler(async () => {
  const result = await attendanceService.getAttendances();
  return NextResponse.json(result);
});

export const POST = asyncHandler(async (req: Request) => {
  const data = await validateRequestFormData(req, AttendanceDataSchema);
  const result = await attendanceService.createAttendance(
    data as TypeofAttendanceData
  );
  return NextResponse.json(result);
});
