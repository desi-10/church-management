import { apiResponse } from "@/utils/api-response";
import { prisma } from "@/utils/db";
import { TypeofSMSData } from "@/validators/sms";
import StatusCodes from "http-status-codes";
import { ApiError } from "@/utils/api-error";
import { SMSStatus } from "@prisma/client";

export const sendSMS = async (smsData: TypeofSMSData) => {
  const { message, recipients, scheduledFor } = smsData;

  // If scheduled, save to database
  if (scheduledFor) {
    const scheduledSMS = await prisma.scheduledSMS.create({
      data: {
        message,
        recipients: JSON.stringify(recipients),
        scheduledFor: new Date(scheduledFor),
        status: SMSStatus.PENDING,
      },
    });

    return apiResponse("SMS scheduled successfully", scheduledSMS);
  }

  // Otherwise, send immediately (mock implementation)
  // In production, integrate with actual SMS service (Twilio, etc.)
  console.log("Sending SMS to:", recipients);
  console.log("Message:", message);

  return apiResponse("SMS sent successfully", {
    sentCount: recipients.length,
    recipients,
  });
};

export const getScheduledSMS = async () => {
  const scheduledSMS = await prisma.scheduledSMS.findMany({
    orderBy: {
      scheduledFor: "desc",
    },
  });

  const formatted = scheduledSMS.map((sms) => ({
    ...sms,
    recipients: JSON.parse(sms.recipients),
  }));

  return apiResponse("Scheduled SMS fetched successfully", formatted);
};

export const getScheduledSMSById = async (id: string) => {
  const sms = await prisma.scheduledSMS.findUnique({
    where: { id },
  });

  if (!sms) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Scheduled SMS not found");
  }

  return apiResponse("Scheduled SMS fetched successfully", {
    ...sms,
    recipients: JSON.parse(sms.recipients),
  });
};

export const updateScheduledSMS = async (
  id: string,
  smsData: Partial<TypeofSMSData>
) => {
  const { message, recipients, scheduledFor } = smsData;

  const existingSMS = await prisma.scheduledSMS.findUnique({
    where: { id },
  });

  if (!existingSMS) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Scheduled SMS not found");
  }

  if (existingSMS.status !== SMSStatus.PENDING) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Can only update pending SMS");
  }

  const updatedSMS = await prisma.scheduledSMS.update({
    where: { id },
    data: {
      message: message || undefined,
      recipients: recipients ? JSON.stringify(recipients) : undefined,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
    },
  });

  return apiResponse("Scheduled SMS updated successfully", {
    ...updatedSMS,
    recipients: JSON.parse(updatedSMS.recipients),
  });
};

export const deleteScheduledSMS = async (id: string) => {
  const existingSMS = await prisma.scheduledSMS.findUnique({
    where: { id },
  });

  if (!existingSMS) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Scheduled SMS not found");
  }

  if (existingSMS.status !== SMSStatus.PENDING) {
    await prisma.scheduledSMS.update({
      where: { id },
      data: { status: SMSStatus.CANCELLED },
    });
  } else {
    await prisma.scheduledSMS.delete({
      where: { id },
    });
  }

  return apiResponse("Scheduled SMS deleted successfully", null);
};
