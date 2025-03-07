
-- Add default positions for admin users
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "position" TEXT;

-- Create an enum for admin positions
CREATE TYPE "AdminPosition" AS ENUM ('CEO', 'CTO', 'COO', 'Other');

-- Create an index on role and position for faster queries
CREATE INDEX "users_role_position_idx" ON "users" ("role", "position");

-- Set default CEO for the first admin
UPDATE "users" 
SET "position" = 'CEO'
WHERE "role" = 'ADMIN' 
AND "id" IN (SELECT "id" FROM "users" WHERE "role" = 'ADMIN' ORDER BY "createdAt" LIMIT 1);
