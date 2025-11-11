import { apiResponse } from "@/utils/api-response";
import { prisma } from "@/utils/db";
import { MemberStatus } from "@prisma/client";
import { TypeofMemberData } from "@/validators/members";
import StatusCodes from "http-status-codes";
import { ApiError } from "@/utils/api-error";
import { findMemberById } from "./member.utils";

export const getMembers = async () => {
  const members = await prisma.member.findMany();
  return apiResponse("Members fetched successfully", members);
};

export const createMember = async (memberData: TypeofMemberData) => {
  const { firstName, lastName, email, phone, address } = memberData;

  const existingMember = await prisma.member.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  if (existingMember) {
    throw new ApiError(StatusCodes.CONFLICT, "Member already exists");
  }

  const member = await prisma.member.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      address,
      status: MemberStatus.ACTIVE,
    },
  });
  return apiResponse("Member created successfully", member);
};

export const getMemberById = async (id: string) => {
  const existingMember = await findMemberById(id);
  if (!existingMember) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Member not found");
  }

  return apiResponse("Member fetched successfully", existingMember);
};

export const updateMember = async (
  id: string,
  memberData: Partial<TypeofMemberData>
) => {
  const { firstName, lastName, email, phone, address } = memberData;

  const existingMember = await findMemberById(id);
  if (!existingMember) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Member not found");
  }

  const updatedMember = await prisma.member.update({
    where: { id },
    data: { firstName, lastName, email, phone, address },
  });

  return apiResponse("Member updated successfully", updatedMember);
};

export const deleteMember = async (id: string) => {
  const existingMember = await findMemberById(id);

  if (!existingMember) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Member not found");
  }

  await prisma.member.delete({
    where: { id: existingMember.id },
  });

  return apiResponse("Member deleted successfully", null);
};
