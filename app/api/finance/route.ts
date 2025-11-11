import { prisma } from "@/utils/db";
import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import {
  createFinance,
  getAllFinaces,
} from "@/features/finance/finance.service";
import { validateRequest } from "@/utils/validator-helper";
import { financeSchema } from "@/features/finance/finance.validator";
import { StatusCodes } from "http-status-codes";

export const GET = asyncHandler(async () => {
  const result = await getAllFinaces();
  return NextResponse.json(result);
});

export const POST = asyncHandler(async (req: Request) => {
  const parsed = await validateRequest(req, financeSchema);
  const result = await createFinance(parsed);
  return NextResponse.json(result, { status: StatusCodes.CREATED });
});
