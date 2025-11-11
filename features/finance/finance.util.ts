import { prisma } from "@/utils/db";

export const findFinanceById = async (id: string) => {
  const finance = await prisma.finance.findFirst({
    where: { id },
  });

  return finance;
};
