
-- Set default positions for admin users who don't have one yet
UPDATE "users"
SET "position" = 'Other'
WHERE "role" = 'ADMIN' AND ("position" IS NULL OR "position" = '');

-- Set the first admin to CEO if no CEO exists
UPDATE "users"
SET "position" = 'CEO'
WHERE "id" IN (
  SELECT "id" FROM "users"
  WHERE "role" = 'ADMIN'
  AND "position" != 'CEO'
  ORDER BY "createdAt"
  LIMIT 1
)
AND NOT EXISTS (
  SELECT 1 FROM "users"
  WHERE "role" = 'ADMIN'
  AND "position" = 'CEO'
);

-- Create an index on role and position for faster queries if it doesn't exist
CREATE INDEX IF NOT EXISTS "users_role_position_idx" ON "users" ("role", "position");
