-- DropForeignKey
ALTER TABLE "container" DROP CONSTRAINT "container_host_id_fkey";

-- AlterTable
ALTER TABLE "container" ADD COLUMN     "project_id" UUID,
ALTER COLUMN "host_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT;

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_name_key" ON "project"("name");

-- AddForeignKey
ALTER TABLE "container" ADD CONSTRAINT "container_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "container" ADD CONSTRAINT "container_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "host"("id") ON DELETE SET NULL ON UPDATE CASCADE;
