/*
  Warnings:

  - You are about to drop the column `recurrenceType` on the `ScheduledSMS` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ScheduledSMS" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "recipients" TEXT NOT NULL,
    "scheduledFor" DATETIME NOT NULL,
    "dayOfWeek" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ScheduledSMS" ("createdAt", "id", "isRecurring", "message", "recipients", "scheduledFor", "status", "updatedAt") SELECT "createdAt", "id", "isRecurring", "message", "recipients", "scheduledFor", "status", "updatedAt" FROM "ScheduledSMS";
DROP TABLE "ScheduledSMS";
ALTER TABLE "new_ScheduledSMS" RENAME TO "ScheduledSMS";
CREATE INDEX "ScheduledSMS_scheduledFor_idx" ON "ScheduledSMS"("scheduledFor");
CREATE INDEX "ScheduledSMS_status_idx" ON "ScheduledSMS"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
