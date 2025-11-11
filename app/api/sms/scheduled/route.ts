import { prisma } from "@/utils/db";
import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  const scheduledSMS = await prisma.scheduledSMS.findMany({
    orderBy: {
      scheduledFor: "asc",
    },
  });

  const formatted = scheduledSMS.map((sms) => ({
    id: sms.id,
    message: sms.message,
    recipients: JSON.parse(sms.recipients) as string[],
    scheduledFor: sms.scheduledFor,
    status: sms.status,
    sentAt: sms.sentAt,
    sentCount: sms.sentCount,
    errorMessage: sms.errorMessage,
    createdAt: sms.createdAt,
  }));

  return NextResponse.json({
    success: true,
    data: formatted,
  });
});
