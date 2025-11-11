-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Finance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "paymentType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT,
    "approvedById" TEXT,
    "reference" TEXT,
    "reconciled" BOOLEAN NOT NULL DEFAULT false,
    "receiptUrl" TEXT,
    "fund" TEXT,
    "notes" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Finance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Finance_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Finance" ("amount", "approvedById", "category", "createdAt", "currency", "date", "description", "firstname", "fund", "id", "lastname", "memberId", "notes", "paymentType", "receiptUrl", "reconciled", "reference", "status", "type") SELECT "amount", "approvedById", "category", "createdAt", "currency", "date", "description", "firstname", "fund", "id", "lastname", "memberId", "notes", "paymentType", "receiptUrl", "reconciled", "reference", "status", "type" FROM "Finance";
DROP TABLE "Finance";
ALTER TABLE "new_Finance" RENAME TO "Finance";
CREATE UNIQUE INDEX "Finance_receiptUrl_key" ON "Finance"("receiptUrl");
CREATE INDEX "Finance_date_idx" ON "Finance"("date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
