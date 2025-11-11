import { prisma } from "@/utils/db";
import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";

// This endpoint should be called by a cron job or scheduler
// Example: Set up a cron job to call this endpoint every minute
// curl -X POST http://your-domain/api/sms/process-scheduled

export const POST = asyncHandler(async () => {
  const now = new Date();

  // Find all pending SMS scheduled for now or earlier
  const pendingSMS = await prisma.scheduledSMS.findMany({
    where: {
      status: "PENDING",
      scheduledFor: {
        lte: now,
      },
    },
  });

  const results = [];

  for (const sms of pendingSMS) {
    try {
      const recipients = JSON.parse(sms.recipients) as string[];

      // TODO: Integrate with your SMS service provider
      // const smsService = new SMSService();
      // const results = await Promise.allSettled(
      //   recipients.map((phone: string) =>
      //     smsService.send({
      //       to: phone,
      //       message: sms.message,
      //     })
      //   )
      // );
      // const sentCount = results.filter(
      //   (result) => result.status === "fulfilled"
      // ).length;

      // Mock: Assume all messages sent successfully
      const sentCount = recipients.length;

      // Update SMS record
      await prisma.scheduledSMS.update({
        where: { id: sms.id },
        data: {
          status: "SENT",
          sentAt: new Date(),
          sentCount,
        },
      });

      results.push({
        id: sms.id,
        status: "SENT",
        sentCount,
      });
    } catch (error) {
      // Update SMS record with error
      await prisma.scheduledSMS.update({
        where: { id: sms.id },
        data: {
          status: "FAILED",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        },
      });

      results.push({
        id: sms.id,
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      processed: results.length,
      results,
    },
  });
});
