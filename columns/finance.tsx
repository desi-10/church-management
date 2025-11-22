"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type FinanceTable = {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: string;
  currency: string;
  paymentType: string;
  status: string;
  date: string;
  reference: string;
  reconciled: string;
  receiptUrl: string;
  fund: string;
  notes: string;
  firstname: string;
  lastname: string;
  approvedBy: {
    firstName: string;
    lastName: string;
  };
  member: {
    firstName: string;
    lastName: string;
  } | null;
};

export const columns: ColumnDef<FinanceTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div className="truncate w-44">{row.original.type}</div>,
  },

  // {
  //   id: "category",
  //   accessorKey: "category",
  //   header: "Category",
  //   cell: ({ row }) => (
  //     <div className="truncate w-44">{row.original.category}</div>
  //   ),
  // },
  {
    id: "currency",
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.currency}</div>
    ),
  },
  {
    id: "paymentType",
    accessorKey: "paymentType",
    header: "Payment Type",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.paymentType}</div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.status}</div>
    ),
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div className="truncate w-44">{row.original.date}</div>,
  },
  {
    id: "memberId",
    accessorKey: "memberId",
    header: "Member ID",
    cell: ({ row }) => (
      <div className="truncate w-44">
        {row.original.member?.firstName || "----"}{" "}
        {row.original.member?.lastName || "----"}
      </div>
    ),
  },
  {
    id: "approvedBy",
    accessorKey: "approvedBy",
    header: "Approved By",
    cell: ({ row }) => (
      <div className="truncate w-44">
        {row.original.approvedBy?.firstName || "----"}{" "}
        {row.original.approvedBy?.lastName || "----"}
      </div>
    ),
  },
  {
    id: "reference",
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.reference || "----"}</div>
    ),
  },
  {
    id: "member",
    accessorKey: "member",
    header: "Not a member",
    cell: ({ row }) => (
      <div className="truncate w-44">
        {row.original.firstname || "----"} {row.original.lastname || "----"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      return (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            className="text-emerald-500 hover:bg-emerald-600 hover:text-white"
            onClick={() => meta?.onEdit?.(row.original)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-rose-500 hover:bg-rose-500 hover:text-white"
            onClick={() => meta?.onDelete?.(row.original)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
