import { NextResponse } from "next/server";
import { asyncHandler } from "@/utils/async-handler";
import * as userService from "@/features/users/users.service";

export const GET = asyncHandler(async () => {
  const result = await userService.getUsers();
  return NextResponse.json(result);
});
