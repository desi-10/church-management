"use client";
import { useState, useEffect } from "react";
import { columns } from "@/columns/finance";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { FinanceDialog } from "@/components/dialogs/finance-dialog";
import { ExportButtons } from "@/components/export-buttons";

type Finance = {
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

const FinancePage = () => {
  const [finances, setFinances] = useState<Finance[]>([
    {
      id: "1",
      type: "Tithe",
      category: "Finance",
      description: "Finance",
      amount: "100",
      currency: "GHS",
      paymentType: "Cash",
      status: "Completed",
      date: "2025-01-01",
      memberId: "1",
      approvedById: "1",
      reference: "1234567890",
      reconciled: "false",
      receiptUrl: "https://example.com",
      fund: "Finance",
      notes: "Finance",
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<
    "create" | "edit" | "view" | "delete"
  >("create");
  const [selectedFinance, setSelectedFinance] = useState<Finance | undefined>();

  useEffect(() => {
    const handleOpenDialog = (event: CustomEvent) => {
      setSelectedFinance(event.detail.finance);
      setDialogMode(event.detail.mode);
      setDialogOpen(true);
    };

    window.addEventListener(
      "openFinanceDialog",
      handleOpenDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "openFinanceDialog",
        handleOpenDialog as EventListener
      );
    };
  }, []);

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedFinance(undefined);
    setDialogOpen(true);
  };

  const handleSave = (financeData: Omit<Finance, "id">) => {
    if (dialogMode === "create") {
      const newFinance: Finance = {
        id: Date.now().toString(),
        ...financeData,
      };
      setFinances([...finances, newFinance]);
    } else if (dialogMode === "edit" && selectedFinance) {
      setFinances(
        finances.map((f) =>
          f.id === selectedFinance.id
            ? { ...selectedFinance, ...financeData }
            : f
        )
      );
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (selectedFinance) {
      setFinances(finances.filter((f) => f.id !== selectedFinance.id));
    }
    setDialogOpen(false);
  };

  const tableColumns = columns;

  const data = {
    data: finances,
    pagination: {
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };

  return (
    <div>
      <div className="w-full mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary-color">Finance</h1>
          <p className="h-2 w-full bg bg-amber-500 -mt-3" />
        </div>

        <div className="flex items-center gap-3">
          <ExportButtons
            data={finances}
            fileName="finance"
            title="Finance Report"
            columns={[
              { header: "Type", dataKey: "type" },
              { header: "Category", dataKey: "category" },
              { header: "Description", dataKey: "description" },
              { header: "Amount", dataKey: "amount" },
              { header: "Currency", dataKey: "currency" },
              { header: "Payment Type", dataKey: "paymentType" },
              { header: "Status", dataKey: "status" },
              { header: "Date", dataKey: "date" },
              { header: "Reference", dataKey: "reference" },
              { header: "Reconciled", dataKey: "reconciled" },
              { header: "Receipt URL", dataKey: "receiptUrl" },
              { header: "Fund", dataKey: "fund" },
              { header: "Notes", dataKey: "notes" },
            ]}
          />

          <Button className="bg-primary-color" onClick={handleCreate}>
            <Wallet className="h-4 w-4 mr-2" /> Add Transaction
          </Button>
        </div>
      </div>

      <div className="w-full">
        <DataTable data={data} columns={tableColumns} />
      </div>

      <FinanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        finance={selectedFinance}
        onSave={handleSave}
        onDelete={dialogMode === "delete" ? handleDelete : undefined}
      />
    </div>
  );
};

export default FinancePage;
