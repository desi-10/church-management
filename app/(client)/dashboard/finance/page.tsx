"use client";
import { useState, useEffect } from "react";
import { columns } from "@/columns/finance";
import { DataTable } from "@/components/data-table";
import AddFinance from "@/components/dialogs/finance/add.finance";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";
import { ExportButtons } from "@/components/export-buttons";

interface FinanceResponse {
  success: boolean;
  data: {
    finances: any[];
    pagination: {
      page: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

const FinancePage = () => {
  const [finances, setFinances] = useState<FinanceResponse | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFinances = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/finance?page=${page}&limit=10`);
        const data = response.data;
        setFinances(data);
      } catch (error) {
        console.error("Error fetching finances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinances();
  }, [page]);

  return (
    <div>
      <div className="w-full mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            Finance
          </h1>
          <p className="h-2 w-full bg-amber-400 -mt-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <ExportButtons
            data={finances?.data?.finances || []}
            fileName="finances"
            title="Finances Report"
            columns={[
              { header: "Date", dataKey: "date" },
              { header: "Amount", dataKey: "amount" },
              { header: "Type", dataKey: "type" },
              { header: "Category", dataKey: "category" },
              { header: "Member", dataKey: "member" },
              { header: "Reference", dataKey: "reference" },
              { header: "Status", dataKey: "status" },
              { header: "Payment Type", dataKey: "paymentType" },
              { header: "Currency", dataKey: "currency" },
              { header: "Reconciled", dataKey: "reconciled" },
              { header: "Receipt", dataKey: "receiptUrl" },
              { header: "Fund", dataKey: "fund" },
            ]}
          />
          <AddFinance />
        </div>
      </div>

      <div className="w-full">
        {finances ? (
          <>
            <DataTable data={finances.data.finances || []} columns={columns} />
            {finances.data.pagination && (
              <Pagination
                page={finances.data.pagination.page}
                totalPages={finances.data.pagination.totalPages}
                hasNextPage={finances.data.pagination.hasNextPage}
                hasPrevPage={finances.data.pagination.hasPrevPage}
                onPageChange={(newPage) => setPage(newPage)}
                isLoading={isLoading}
              />
            )}
          </>
        ) : (
          <div className="text-xs">
            <div className="rounded-md">
              <div className="flex justify-between items-center mb-5">
                <Skeleton className="h-10 w-full max-w-sm rounded-md" />
                <div className="flex space-x-3">
                  <Skeleton className="h-10 w-24 rounded-md" />
                </div>
              </div>

              <div className="rounded-md border">
                <div className="border-b bg-gray-50/50">
                  <div className="flex">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex-1 p-4">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                    <div
                      key={row}
                      className="flex border-b last:border-b-0 hover:bg-gray-50/50"
                    >
                      {[1, 2, 3, 4, 5, 6].map((col) => (
                        <div key={col} className="flex-1 p-4">
                          <Skeleton className="h-4 w-full max-w-[150px]" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancePage;
