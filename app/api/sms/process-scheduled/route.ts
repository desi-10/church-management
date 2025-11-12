import { sendArkeselSMS } from "@/utils/arkesel";
import { prisma } from "@/utils/db";
import { SMSStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();

  // Find pending SMS whose scheduled time has passed
  const dueSMS = await prisma.scheduledSMS.findMany({
    where: {
      status: SMSStatus.PENDING,
      scheduledFor: { lte: now },
    },
  });

  for (const sms of dueSMS) {
    const recipients = JSON.parse(sms.recipients);
    try {
      await sendArkeselSMS(recipients, sms.message);
      await prisma.scheduledSMS.update({
        where: { id: sms.id },
        data: { status: SMSStatus.SENT },
      });
    } catch (err) {
      console.error(`Failed to send scheduled SMS ${sms.id}`, err);
      await prisma.scheduledSMS.update({
        where: { id: sms.id },
        data: { status: SMSStatus.FAILED },
      });
    }
  }

  return NextResponse.json({ processed: dueSMS.length });
}
