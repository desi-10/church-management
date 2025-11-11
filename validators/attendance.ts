import { z } from "zod";

export const AttendanceDataSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["PRESENT", "ABSENT", "LATE"]).default("PRESENT"),
  date: z.string().optional(),
  memberId: z.string().optional(),
});

export type TypeofAttendanceData = z.infer<typeof AttendanceDataSchema>;
