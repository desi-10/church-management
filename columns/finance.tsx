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
  memberId: string;
  approvedById: string;
  reference: string;
  reconciled: string;
  receiptUrl: string;
  fund: string;
  notes: string;
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

  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.category}</div>
    ),
  },
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
      <div className="truncate w-44">{row.original.memberId}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-500 hover:bg-blue-500 hover:text-white"
            onClick={() => {
              const event = new CustomEvent("openFinanceDialog", {
                detail: { mode: "view", finance: data },
              });
              window.dispatchEvent(event);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-emerald-500 hover:bg-emerald-500 hover:text-white"
            onClick={() => {
              const event = new CustomEvent("openFinanceDialog", {
                detail: { mode: "edit", finance: data },
              });
              window.dispatchEvent(event);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-rose-500 hover:bg-rose-500 hover:text-white"
            onClick={() => {
              const event = new CustomEvent("openFinanceDialog", {
                detail: { mode: "delete", finance: data },
              });
              window.dispatchEvent(event);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    enableHiding: false,
  },
];
