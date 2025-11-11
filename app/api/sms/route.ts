import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as smsService from "@/features/sms/sms.services";
import { SMSDataSchema } from "@/validators/sms";
import { validateRequestFormData } from "@/utils/validator-helper";
import { TypeofSMSData } from "@/validators/sms";

export const GET = asyncHandler(async () => {
  const result = await smsService.getScheduledSMS();
  return NextResponse.json(result);
});

export const POST = asyncHandler(async (req: Request) => {
  const data = await validateRequestFormData(req, SMSDataSchema);
  const result = await smsService.sendSMS(data as TypeofSMSData);
  return NextResponse.json(result);
});
