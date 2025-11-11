import { prisma } from "@/utils/db";

export const findMemberById = async (id: string) => {
  const existingMember = await prisma.member.findUnique({ where: { id } });

  return existingMember;
};
