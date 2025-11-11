import { prisma } from "@/utils/db";
import { asyncHandler } from "@/utils/async-handler";
import { NextResponse } from "next/server";
import { getFinanceById } from "@/features/finance/finance.service";

export const GET = asyncHandler(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const result = await getFinanceById(id);
    return NextResponse.json(result);
  }
);

export const PUT = asyncHandler(
  async (req: Request, { params }: { params: { id: string } }) => {
    const body = await req.json();
    const {
      type,
      category,
      description,
      amount,
      currency,
      paymentType,
      status,
      date,
      memberId,
      approvedById,
      reference,
      reconciled,
      receiptUrl,
      fund,
      notes,
    } = body;

    const finance = await prisma.finance.update({
      where: { id: params.id },
      data: {
        type: type?.toUpperCase() || "TITHE",
        category: category || "",
        description: description || "",
        amount: parseFloat(amount) || 0,
        currency: currency?.toUpperCase() || "GHS",
        paymentType:
          paymentType === "Cash"
            ? "CASH"
            : paymentType === "Mobile Money"
            ? "MOBILE_MONEY"
            : "BANK",
        status:
          status === "Completed"
            ? "COMPLETED"
            : status === "Pending"
            ? "PENDING"
            : "CANCELLED",
        date: date ? new Date(date) : new Date(),
        memberId: memberId || null,
        approvedById: approvedById || null,
        reference: reference || "",
        reconciled: reconciled === "true" || reconciled === true,
        receiptUrl: receiptUrl || "",
        fund: fund || "",
        notes: notes || "",
      },
    });

    return NextResponse.json({ success: true, data: finance });
  }
);

export const DELETE = asyncHandler(
  async (_req: Request, { params }: { params: { id: string } }) => {
    await prisma.finance.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Finance deleted" });
  }
);
