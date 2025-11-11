import { prisma } from "@/utils/db";
import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import * as memberService from "@/features/members/members.services";
import { MemberDataSchema } from "@/validators/members";

import { validateRequest } from "@/utils/validator-helper";
import { StatusCodes } from "http-status-codes";

export const GET = asyncHandler(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const result = await memberService.getMemberById(id);
    return NextResponse.json(result);
  }
);

export const PUT = asyncHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const data = await validateRequest(req, MemberDataSchema);
    const result = await memberService.updateMember(id, data);
    return NextResponse.json(result);
  }
);

export const DELETE = asyncHandler(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const result = await memberService.deleteMember(id);
    return NextResponse.json(result, { status: StatusCodes.NO_CONTENT });
  }
);
