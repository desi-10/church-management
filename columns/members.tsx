"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type MemberTable = {
  id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
};

export const columns: ColumnDef<MemberTable>[] = [
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
    id: "username",
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.username}</div>
    ),
  },

  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.email}</div>
    ),
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.phone}</div>
    ),
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="truncate w-44">{row.original.address}</div>
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
              const event = new CustomEvent("openMemberDialog", {
                detail: { mode: "view", member: data },
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
              const event = new CustomEvent("openMemberDialog", {
                detail: { mode: "edit", member: data },
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
              const event = new CustomEvent("openMemberDialog", {
                detail: { mode: "delete", member: data },
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
