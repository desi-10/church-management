import { z } from "zod";

export const SMSDataSchema = z.object({
  message: z.string().min(1, "Message is required"),
  recipients: z.array(z.string()).min(1, "At least one recipient is required"),
  scheduledFor: z.string().optional(),
});

export type TypeofSMSData = z.infer<typeof SMSDataSchema>;
