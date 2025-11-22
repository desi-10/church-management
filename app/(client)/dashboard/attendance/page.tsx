"use client";
import { useState, useEffect } from "react";
import { columns } from "@/columns/attendance";
import { DataTable } from "@/components/data-table";
import AddAttendance from "@/components/dialogs/attendance/add.attendance";
import EditAttendance from "@/components/dialogs/attendance/edit.attendance";
import DeleteAttendance from "@/components/dialogs/attendance/delete.attendance";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";

type Attendance = {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  status: string;
  date: string;
};

const AttendancePage = () => {
  const [attendances, setAttendances] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);

  const fetchAttendances = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/attendance?page=${page}&limit=10`);
      const data = response.data;
      setAttendances(data);
    } catch (error) {
      console.error("Error fetching attendances:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, [page]);

  const handleEdit = (attendance: any) => {
    setSelectedAttendance(attendance);
    setEditDialogOpen(true);
  };

  const handleDelete = (attendance: any) => {
    setSelectedAttendance(attendance);
    setDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchAttendances();
  };

  return (
    <div>
      <div className="w-full mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">Attendance</h1>
          <p className="h-2 w-full bg-amber-400 -mt-3" />
        </div>

        <div className="flex items-center gap-3">
          <AddAttendance />
        </div>
      </div>

      <div className="w-full">
        {attendances ? (
          <>
            <DataTable
              data={attendances.data.attendances || []}
              columns={columns}
              meta={{
                onEdit: handleEdit,
                onDelete: handleDelete,
              }}
            />
            {attendances.data.pagination && (
              <Pagination
                page={attendances.data.pagination.page}
                totalPages={attendances.data.pagination.totalPages}
                hasNextPage={attendances.data.pagination.hasNextPage}
                hasPrevPage={attendances.data.pagination.hasPrevPage}
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
                    {[1, 2, 3, 4, 5].map((i) => (
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
                      {[1, 2, 3, 4, 5].map((col) => (
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

      {selectedAttendance && (
        <>
          <EditAttendance
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            attendance={selectedAttendance}
            onSuccess={handleSuccess}
          />
          <DeleteAttendance
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            attendance={selectedAttendance}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </div>
  );
};

export default AttendancePage;
