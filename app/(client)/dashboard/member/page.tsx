"use client";
import { useState, useEffect, useCallback } from "react";
import { columns } from "@/columns/members";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { MemberDialog } from "@/components/dialogs/member-dialog";
import { memberApi } from "@/lib/api-client";
import {
  transformMemberToFrontend,
  transformMemberToBackend,
} from "@/lib/data-transform";
import { ExportButtons } from "@/components/export-buttons";

type Member = {
  id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
};

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<
    "create" | "edit" | "view" | "delete"
  >("create");
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();

  const fetchMembers = useCallback(async () => {
    try {
      const response = await memberApi.getAll();
      if (response.success && response.data) {
        const transformed = (
          response.data as Array<{
            id: string;
            firstName: string;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            address?: string | null;
          }>
        ).map(transformMemberToFrontend);
        setMembers(transformed);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  }, []);

  // Fetch members on mount
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Listen for dialog events from table actions
  useEffect(() => {
    const handleOpenDialog = (event: CustomEvent) => {
      setSelectedMember(event.detail.member);
      setDialogMode(event.detail.mode);
      setDialogOpen(true);
    };

    window.addEventListener(
      "openMemberDialog",
      handleOpenDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "openMemberDialog",
        handleOpenDialog as EventListener
      );
    };
  }, []);

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedMember(undefined);
    setDialogOpen(true);
  };

  const handleSave = async (memberData: Omit<Member, "id">) => {
    try {
      const backendData = transformMemberToBackend(memberData);

      if (dialogMode === "create") {
        await memberApi.create(backendData);
      } else if (dialogMode === "edit" && selectedMember) {
        await memberApi.update(selectedMember.id, backendData);
      }

      await fetchMembers();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save member:", error);
      alert("Failed to save member. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    try {
      await memberApi.delete(selectedMember.id);
      await fetchMembers();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete member:", error);
      alert("Failed to delete member. Please try again.");
    }
  };

  const tableColumns = columns;

  const data = {
    data: members,
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
          <h1 className="text-4xl font-bold text-primary-color">Members</h1>
          <p className="h-2 w-full bg bg-amber-500 -mt-3" />
        </div>

        <div className="flex items-center gap-3">
          <ExportButtons
            data={members}
            fileName="members"
            title="Members Report"
            columns={[
              { header: "Name", dataKey: "username" },
              { header: "Email", dataKey: "email" },
              { header: "Phone", dataKey: "phone" },
              { header: "Address", dataKey: "address" },
            ]}
          />
          <Button className="bg-primary-color" onClick={handleCreate}>
            <UserPlus className="h-4 w-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>

      <div className="w-full">
        <DataTable data={data} columns={tableColumns} />
      </div>

      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        member={selectedMember}
        onSave={handleSave}
        onDelete={dialogMode === "delete" ? handleDelete : undefined}
      />
    </div>
  );
};

export default MembersPage;
