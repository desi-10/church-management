import { prisma } from "@/utils/db";
import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req: Request) => {
  const body = await req.json();
  const { recipients, message, scheduledFor } = body;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return NextResponse.json(
      { success: false, message: "No recipients provided" },
      { status: 400 }
    );
  }

  if (!message || !message.trim()) {
    return NextResponse.json(
      { success: false, message: "Message is required" },
      { status: 400 }
    );
  }

  // If scheduled, save to database
  if (scheduledFor) {
    const scheduledDate = new Date(scheduledFor);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { success: false, message: "Scheduled time must be in the future" },
        { status: 400 }
      );
    }

    const scheduledSMS = await prisma.scheduledSMS.create({
      data: {
        message: message.trim(),
        recipients: JSON.stringify(recipients),
        scheduledFor: scheduledDate,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: scheduledSMS.id,
          scheduledFor: scheduledSMS.scheduledFor,
          message: "SMS scheduled successfully",
        },
      },
      { status: 201 }
    );
  }

  // Send immediately
  // TODO: Integrate with your SMS service provider (e.g., Twilio, AWS SNS, etc.)
  // This is a mock implementation - replace with actual SMS service integration

  // Example integration structure:
  /*
  const smsService = new SMSService();
  const results = await Promise.allSettled(
    recipients.map((phone: string) =>
      smsService.send({
        to: phone,
        message: message.trim(),
      })
    )
  );
  
  const sentCount = results.filter(
    (result) => result.status === "fulfilled"
  ).length;
  */

  // Mock response for now
  const sentCount = recipients.length;

  // Log the SMS (you might want to save this to database)
  console.log(`SMS sent to ${sentCount} recipients:`, {
    recipients,
    message: message.trim(),
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        sentCount,
        totalRecipients: recipients.length,
        message: "SMS sent successfully",
      },
    },
    { status: 200 }
  );
});
