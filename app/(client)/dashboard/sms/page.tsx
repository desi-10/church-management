"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Users,
  Clock,
  Edit2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { memberApi } from "@/lib/api-client";
import { transformMemberToFrontend } from "@/lib/data-transform";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Member = {
  id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
};

export default function BulkSMSPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );
  const [message, setMessage] = useState("");
  const [sendMode, setSendMode] = useState<"now" | "schedule">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledSMS, setScheduledSMS] = useState<
    Array<{
      id: string;
      message: string;
      recipients: string[];
      scheduledFor: string;
      status: string;
      sentAt?: string | null;
      sentCount: number;
    }>
  >([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSMS, setSelectedSMS] = useState<{
    id: string;
    message: string;
    recipients: string[];
    scheduledFor: string;
  } | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [editScheduledDate, setEditScheduledDate] = useState("");
  const [editScheduledTime, setEditScheduledTime] = useState("");
  const [editRecipients, setEditRecipients] = useState<string[]>([]);
  const [loadingScheduled, setLoadingScheduled] = useState(false);

  const fetchScheduledSMS = useCallback(async () => {
    try {
      setLoadingScheduled(true);
      const response = await fetch("/api/sms/scheduled");
      const data = await response.json();
      if (data.success && data.data) {
        setScheduledSMS(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch scheduled SMS:", error);
    } finally {
      setLoadingScheduled(false);
    }
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
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
          setMembers(transformed.filter((m) => m.phone)); // Only members with phone numbers
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchMembers();
    fetchScheduledSMS();
  }, [fetchScheduledSMS]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(new Set(members.map((m) => m.id)));
    } else {
      setSelectedMembers(new Set());
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    const newSelected = new Set(selectedMembers);
    if (checked) {
      newSelected.add(memberId);
    } else {
      newSelected.delete(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleSendSMS = async () => {
    if (!message.trim() || selectedMembers.size === 0) {
      alert("Please select members and enter a message");
      return;
    }

    if (sendMode === "schedule") {
      if (!scheduledDate || !scheduledTime) {
        alert("Please select both date and time for scheduling");
        return;
      }

      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (scheduledDateTime <= new Date()) {
        alert("Please select a future date and time");
        return;
      }
    }

    setSending(true);
    setSendDialogOpen(true);

    try {
      const selectedPhones = members
        .filter((m) => selectedMembers.has(m.id))
        .map((m) => m.phone)
        .filter(Boolean);

      const requestBody: {
        recipients: string[];
        message: string;
        scheduledFor?: string;
      } = {
        recipients: selectedPhones,
        message: message.trim(),
      };

      if (sendMode === "schedule") {
        requestBody.scheduledFor = new Date(
          `${scheduledDate}T${scheduledTime}`
        ).toISOString();
      }

      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.success) {
        if (sendMode === "schedule") {
          setIsScheduled(true);
        } else {
          setSentCount(data.data.sentCount || selectedPhones.length);
        }
        setMessage("");
        setSelectedMembers(new Set());
        setScheduledDate("");
        setScheduledTime("");
        setSendMode("now");
        if (sendMode === "schedule") {
          await fetchScheduledSMS();
        }
      } else {
        throw new Error(data.message || "Failed to send SMS");
      }
    } catch (error) {
      console.error("Failed to send SMS:", error);
      alert("Failed to send SMS. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleEditSMS = (sms: {
    id: string;
    message: string;
    recipients: string[];
    scheduledFor: string;
    status: string;
  }) => {
    if (sms.status !== "PENDING") {
      alert("Can only edit pending scheduled SMS");
      return;
    }

    setSelectedSMS({
      id: sms.id,
      message: sms.message,
      recipients: sms.recipients,
      scheduledFor: sms.scheduledFor,
    });

    const scheduledDate = new Date(sms.scheduledFor);
    setEditMessage(sms.message);
    setEditScheduledDate(scheduledDate.toISOString().split("T")[0]);
    setEditScheduledTime(scheduledDate.toTimeString().slice(0, 5));
    setEditRecipients(sms.recipients);
    setEditDialogOpen(true);
  };

  const handleUpdateSMS = async () => {
    if (!selectedSMS) return;

    if (!editMessage.trim()) {
      alert("Message cannot be empty");
      return;
    }

    if (!editScheduledDate || !editScheduledTime) {
      alert("Please select both date and time");
      return;
    }

    const scheduledDateTime = new Date(
      `${editScheduledDate}T${editScheduledTime}`
    );
    if (scheduledDateTime <= new Date()) {
      alert("Please select a future date and time");
      return;
    }

    try {
      const response = await fetch(`/api/sms/scheduled/${selectedSMS.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: editMessage.trim(),
          recipients: editRecipients,
          scheduledFor: scheduledDateTime.toISOString(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchScheduledSMS();
        setEditDialogOpen(false);
        setSelectedSMS(null);
      } else {
        throw new Error(data.message || "Failed to update SMS");
      }
    } catch (error) {
      console.error("Failed to update SMS:", error);
      alert("Failed to update SMS. Please try again.");
    }
  };

  const handleDeleteSMS = async () => {
    if (!selectedSMS) return;

    try {
      const response = await fetch(`/api/sms/scheduled/${selectedSMS.id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        await fetchScheduledSMS();
        setDeleteDialogOpen(false);
        setSelectedSMS(null);
      } else {
        throw new Error(data.message || "Failed to delete SMS");
      }
    } catch (error) {
      console.error("Failed to delete SMS:", error);
      alert("Failed to delete SMS. Please try again.");
    }
  };

  const selectedMembersList = members.filter((m) => selectedMembers.has(m.id));
  const allSelected =
    members.length > 0 && selectedMembers.size === members.length;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-foreground">Bulk SMS</h2>
          <p className="text-sm text-muted-foreground">
            Send messages to multiple members at once
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 shadow-md"
          onClick={() => setPreviewDialogOpen(true)}
          disabled={selectedMembers.size === 0 || !message.trim()}
        >
          <MessageSquare className="h-4 w-4" />
          Preview & Send
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Message Composer */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                {message.length} characters
              </p>
            </div>

            {/* Send Mode Selection */}
            <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/30">
              <Label className="text-base font-semibold">Send Options</Label>
              <RadioGroup
                value={sendMode}
                onValueChange={(value: string) =>
                  setSendMode(value as "now" | "schedule")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="send-now" />
                  <Label htmlFor="send-now" className="cursor-pointer">
                    Send Now
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="schedule" id="schedule" />
                  <Label htmlFor="schedule" className="cursor-pointer">
                    Schedule
                  </Label>
                </div>
              </RadioGroup>

              {sendMode === "schedule" && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="scheduled-date">Date</Label>
                    <Input
                      id="scheduled-date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="scheduled-time">Time</Label>
                    <Input
                      id="scheduled-time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Member Selection */}
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label>Select Members</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
                <Label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer"
                >
                  Select All ({selectedMembers.size}/{members.length})
                </Label>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Checkbox
                    id={member.id}
                    checked={selectedMembers.has(member.id)}
                    onCheckedChange={(checked) =>
                      handleSelectMember(member.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={member.id}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    <div className="font-medium">{member.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {member.phone || "No phone"}
                    </div>
                  </Label>
                </div>
              ))}
              {members.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No members with phone numbers found
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {sendMode === "schedule" ? "Schedule Message" : "Preview Message"}
            </DialogTitle>
            <DialogDescription>
              {sendMode === "schedule" ? (
                <>
                  Schedule message to send to {selectedMembers.size} member
                  {selectedMembers.size !== 1 ? "s" : ""} on{" "}
                  {scheduledDate && scheduledTime
                    ? new Date(
                        `${scheduledDate}T${scheduledTime}`
                      ).toLocaleString()
                    : "selected date/time"}
                </>
              ) : (
                <>
                  Review your message before sending to {selectedMembers.size}{" "}
                  member{selectedMembers.size !== 1 ? "s" : ""}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <p className="text-sm whitespace-pre-wrap">{message}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Recipients:</p>
              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {selectedMembersList.map((member) => (
                  <div
                    key={member.id}
                    className="text-xs text-muted-foreground flex items-center gap-2"
                  >
                    <Users className="h-3 w-3" />
                    {member.username} - {member.phone}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPreviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSendSMS} disabled={sending}>
              {sendMode === "schedule" ? (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  {sending ? "Scheduling..." : "Schedule SMS"}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? "Sending..." : "Send SMS"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scheduled SMS Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Scheduled SMS</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your scheduled messages
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchScheduledSMS}
            disabled={loadingScheduled}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                loadingScheduled ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>

        {loadingScheduled ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading scheduled SMS...
          </div>
        ) : scheduledSMS.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No scheduled SMS found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledSMS.map((sms) => (
                  <TableRow key={sms.id}>
                    <TableCell className="max-w-xs">
                      <p className="truncate text-sm">{sms.message}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{sms.recipients.length}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(sms.scheduledFor).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sms.status === "SENT"
                            ? "default"
                            : sms.status === "FAILED"
                            ? "destructive"
                            : sms.status === "CANCELLED"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {sms.status}
                      </Badge>
                      {sms.status === "SENT" && sms.sentAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Sent: {new Date(sms.sentAt).toLocaleString()}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {sms.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSMS(sms)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSMS({
                                  id: sms.id,
                                  message: sms.message,
                                  recipients: sms.recipients,
                                  scheduledFor: sms.scheduledFor,
                                });
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Scheduled SMS</DialogTitle>
            <DialogDescription>
              Update your scheduled message details
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-message">Message</Label>
              <textarea
                id="edit-message"
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-scheduled-date">Date</Label>
                <Input
                  id="edit-scheduled-date"
                  type="date"
                  value={editScheduledDate}
                  onChange={(e) => setEditScheduledDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-scheduled-time">Time</Label>
                <Input
                  id="edit-scheduled-time"
                  type="time"
                  value={editScheduledTime}
                  onChange={(e) => setEditScheduledTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Recipients ({editRecipients.length})</Label>
              <div className="max-h-[150px] overflow-y-auto border rounded-md p-2">
                {editRecipients.map((phone) => (
                  <div key={phone} className="text-sm py-1">
                    {phone}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSMS}>Update SMS</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Scheduled SMS</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scheduled SMS? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedSMS && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                <strong>Message:</strong>{" "}
                {selectedSMS.message.substring(0, 100)}
                {selectedSMS.message.length > 100 ? "..." : ""}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Scheduled for:</strong>{" "}
                {new Date(selectedSMS.scheduledFor).toLocaleString()}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedSMS(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSMS}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={sendDialogOpen && !sending}
        onOpenChange={(open) => {
          setSendDialogOpen(open);
          if (!open) {
            setIsScheduled(false);
            setSentCount(0);
          }
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              {isScheduled ? "Message Scheduled!" : "Messages Sent!"}
            </DialogTitle>
            <DialogDescription>
              {isScheduled ? (
                <>
                  Your message has been scheduled to send to{" "}
                  {selectedMembersList.length} member
                  {selectedMembersList.length !== 1 ? "s" : ""} on{" "}
                  {scheduledDate && scheduledTime
                    ? new Date(
                        `${scheduledDate}T${scheduledTime}`
                      ).toLocaleString()
                    : "the scheduled date"}
                </>
              ) : (
                <>
                  Successfully sent {sentCount} message
                  {sentCount !== 1 ? "s" : ""}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setSendDialogOpen(false);
                setIsScheduled(false);
                setSentCount(0);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
