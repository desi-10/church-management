"use client";
import { useState, useEffect, useCallback } from "react";
import { columns } from "@/columns/attendance";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { AttendanceDialog } from "@/components/dialogs/attendance-dialog";
import { attendanceApi } from "@/lib/api-client";
import { transformAttendanceToFrontend } from "@/lib/data-transform";
import { ExportButtons } from "@/components/export-buttons";

type Attendance = {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  status: string;
  date: string;
};

const AttendancePage = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<
    "create" | "edit" | "view" | "delete"
  >("create");
  const [selectedAttendance, setSelectedAttendance] = useState<
    Attendance | undefined
  >();

  const fetchAttendances = useCallback(async () => {
    try {
      const response = await attendanceApi.getAll();
      if (response.success && response.data) {
        const transformed = (
          response.data as Array<{
            id: string;
            firstname?: string | null;
            lastname?: string | null;
            status: string;
            date: Date | string;
          }>
        ).map(transformAttendanceToFrontend);
        setAttendances(transformed);
      }
    } catch (error) {
      console.error("Failed to fetch attendances:", error);
    }
  }, []);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  useEffect(() => {
    const handleOpenDialog = (event: CustomEvent) => {
      setSelectedAttendance(event.detail.attendance);
      setDialogMode(event.detail.mode);
      setDialogOpen(true);
    };

    window.addEventListener(
      "openAttendanceDialog",
      handleOpenDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "openAttendanceDialog",
        handleOpenDialog as EventListener
      );
    };
  }, []);

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedAttendance(undefined);
    setDialogOpen(true);
  };

  const handleSave = async (attendanceData: Omit<Attendance, "id">) => {
    try {
      if (dialogMode === "create") {
        await attendanceApi.create(attendanceData);
      } else if (dialogMode === "edit" && selectedAttendance) {
        await attendanceApi.update(selectedAttendance.id, attendanceData);
      }

      await fetchAttendances();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("Failed to save attendance. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!selectedAttendance) return;

    try {
      await attendanceApi.delete(selectedAttendance.id);
      await fetchAttendances();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete attendance:", error);
      alert("Failed to delete attendance. Please try again.");
    }
  };

  const tableColumns = columns;

  const data = {
    data: attendances,
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
          <h1 className="text-4xl font-bold text-primary-color">Attendance</h1>
          <p className="h-2 w-full bg bg-amber-500 -mt-3" />
        </div>

        <div className="flex items-center gap-3">
          <ExportButtons
            data={attendances}
            fileName="attendance"
            title="Attendance Report"
            columns={[
              { header: "First Name", dataKey: "firstname" },
              { header: "Last Name", dataKey: "lastname" },
              { header: "Phone", dataKey: "phone" },
              { header: "Status", dataKey: "status" },
              { header: "Date", dataKey: "date" },
            ]}
          />
          <Button className="bg-primary-color" onClick={handleCreate}>
            <CalendarPlus className="h-4 w-4 mr-2" /> Add Attendance
          </Button>
        </div>
      </div>

      <div className="w-full">
        <DataTable data={data} columns={tableColumns} />
      </div>

      <AttendanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        attendance={selectedAttendance}
        onSave={handleSave}
        onDelete={dialogMode === "delete" ? handleDelete : undefined}
      />
    </div>
  );
};

export default AttendancePage;
