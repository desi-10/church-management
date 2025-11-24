"use client";
import { DataTable } from "@/components/data-table";
import AddMember from "@/components/dialogs/members/add.member";
import { useEffect, useState } from "react";
import { columns } from "@/columns/members";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { ExportButtons } from "@/components/export-buttons";
import { Pagination } from "@/components/pagination";

const MembersPage = () => {
  const [members, setMembers] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMembers = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/member?page=${currentPage}&limit=10`
      );
      const data = response.data;
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(page);
  }, [page]);

  return (
    <div>
      <div className="w-full mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">Members</h1>
          <p className="h-2 w-full bg bg-amber-500 -mt-3" />
        </div>

        <div className="flex items-center gap-3">
          <ExportButtons
            data={members?.data?.members || []}
            fileName="members"
            title="Members Report"
            columns={[
              { header: "First Name", dataKey: "firstName" },
              { header: "Last Name", dataKey: "lastName" },
              { header: "Email", dataKey: "email" },
              { header: "Phone", dataKey: "phone" },
              { header: "Address", dataKey: "address" },
            ]}
          />
          <AddMember />
        </div>
      </div>

      <div className="w-full">
        {members ? (
          <>
            <DataTable data={members.data.members || []} columns={columns} />
            {members.data.pagination && (
              <Pagination
                page={members.data.pagination.page}
                totalPages={members.data.pagination.totalPages}
                hasNextPage={members.data.pagination.hasNextPage}
                hasPrevPage={members.data.pagination.hasPrevPage}
                onPageChange={(newPage) => setPage(newPage)}
                isLoading={isLoading}
              />
            )}
          </>
        ) : (
          <div className="text-xs">
            <div className="rounded-md">
              {/* Table Controls Skeleton */}
              <div className="flex justify-between items-center mb-5">
                <Skeleton className="h-10 w-full max-w-sm rounded-md" />
                <div className="flex space-x-3">
                  <Skeleton className="h-10 w-24 rounded-md" />
                </div>
              </div>

              {/* Table Skeleton */}
              <div className="rounded-md border">
                {/* Table Header */}
                <div className="border-b bg-gray-50/50">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-1 p-4">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table Rows */}
                <div>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                    <div
                      key={row}
                      className="flex border-b last:border-b-0 hover:bg-gray-50/50"
                    >
                      {[1, 2, 3, 4, 5].map((col) => (
                        <div key={col} className="flex-1 p-4">
                          <Skeleton className="h-4 w-full max-w-[150px]" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Skeleton */}
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
export default MembersPage;
