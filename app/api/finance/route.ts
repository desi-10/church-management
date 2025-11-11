import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as financeService from "@/features/finance/finance.services";
import { FinanceDataSchema } from "@/validators/finance";
import { validateRequest } from "@/utils/validator-helper";
import { TypeofFinanceData } from "@/validators/finance";

export const GET = asyncHandler(async () => {
  const result = await financeService.getFinances();
  return NextResponse.json(result);
});

export const POST = asyncHandler(async (req: Request) => {
  const data = await validateRequest(req, FinanceDataSchema);
  const result = await financeService.createFinance(data as TypeofFinanceData);
  return NextResponse.json(result);
});
