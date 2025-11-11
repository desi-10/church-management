import { asyncHandler } from "@/utils/async-handler";
import { apiResponse } from "@/utils/api-response";
import { NextResponse } from "next/server";
import StatusCodes from "http-status-codes";
import { createMember, getMembers } from "@/features/members/members.services";
import { MemberDataSchema } from "@/validators/members";
import { validateRequest } from "@/utils/validator-helper";

export const GET = asyncHandler(async () => {
  const result = await getMembers();
  return NextResponse.json(result);
});

export const POST = asyncHandler(async (req: Request) => {
  const data = await validateRequest(req, MemberDataSchema);
  const result = await createMember(data);
  return NextResponse.json(apiResponse("Member created successfully", result), {
    status: StatusCodes.ACCEPTED,
  });
});
