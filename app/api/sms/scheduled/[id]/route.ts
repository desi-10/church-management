import { prisma } from "@/utils/db";
import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(
  async (_req: Request, { params }: { params: { id: string } }) => {
    const scheduledSMS = await prisma.scheduledSMS.findUnique({
      where: { id: params.id },
    });

    if (!scheduledSMS) {
      return NextResponse.json(
        { success: false, message: "Scheduled SMS not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: scheduledSMS.id,
        message: scheduledSMS.message,
        recipients: JSON.parse(scheduledSMS.recipients) as string[],
        scheduledFor: scheduledSMS.scheduledFor,
        status: scheduledSMS.status,
        sentAt: scheduledSMS.sentAt,
        sentCount: scheduledSMS.sentCount,
        errorMessage: scheduledSMS.errorMessage,
        createdAt: scheduledSMS.createdAt,
      },
    });
  }
);

export const PUT = asyncHandler(
  async (req: Request, { params }: { params: { id: string } }) => {
    const body = await req.json();
    const { message, recipients, scheduledFor } = body;

    const scheduledSMS = await prisma.scheduledSMS.findUnique({
      where: { id: params.id },
    });

    if (!scheduledSMS) {
      return NextResponse.json(
        { success: false, message: "Scheduled SMS not found" },
        { status: 404 }
      );
    }

    // Can only edit PENDING SMS
    if (scheduledSMS.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message: "Can only edit pending scheduled SMS",
        },
        { status: 400 }
      );
    }

    const scheduledDate = scheduledFor ? new Date(scheduledFor) : null;
    if (scheduledDate && scheduledDate <= new Date()) {
      return NextResponse.json(
        { success: false, message: "Scheduled time must be in the future" },
        { status: 400 }
      );
    }

    const updated = await prisma.scheduledSMS.update({
      where: { id: params.id },
      data: {
        message: message ? message.trim() : scheduledSMS.message,
        recipients: recipients
          ? JSON.stringify(recipients)
          : scheduledSMS.recipients,
        scheduledFor: scheduledDate || scheduledSMS.scheduledFor,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        message: updated.message,
        recipients: JSON.parse(updated.recipients) as string[],
        scheduledFor: updated.scheduledFor,
        status: updated.status,
      },
    });
  }
);

export const DELETE = asyncHandler(
  async (_req: Request, { params }: { params: { id: string } }) => {
    const scheduledSMS = await prisma.scheduledSMS.findUnique({
      where: { id: params.id },
    });

    if (!scheduledSMS) {
      return NextResponse.json(
        { success: false, message: "Scheduled SMS not found" },
        { status: 404 }
      );
    }

    // Can only delete PENDING SMS
    if (scheduledSMS.status !== "PENDING") {
      await prisma.scheduledSMS.update({
        where: { id: params.id },
        data: { status: "CANCELLED" },
      });
    } else {
      await prisma.scheduledSMS.delete({
        where: { id: params.id },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Scheduled SMS deleted/cancelled",
    });
  }
);
