/*
  Warnings:

  - You are about to drop the column `container_tech_id` on the `vuln_state` table. All the data in the column will be lost.
  - You are about to drop the column `cve_id` on the `vuln_state` table. All the data in the column will be lost.
  - The primary key for the `vulnerability` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cve_id` on the `vulnerability` table. All the data in the column will be lost.
  - Added the required column `vulnerability_id` to the `vuln_state` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `vulnerability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'IN_PROGRESS';

-- DropForeignKey
ALTER TABLE "vuln_state" DROP CONSTRAINT "vuln_state_container_tech_id_fkey";

-- DropForeignKey
ALTER TABLE "vuln_state" DROP CONSTRAINT "vuln_state_cve_id_fkey";

-- AlterTable
ALTER TABLE "technology" ADD COLUMN     "ecosystem" TEXT;

-- AlterTable
ALTER TABLE "vuln_state" DROP COLUMN "container_tech_id",
DROP COLUMN "cve_id",
ADD COLUMN     "project_id" UUID,
ADD COLUMN     "technology_id" UUID,
ADD COLUMN     "vulnerability_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vulnerability" DROP CONSTRAINT "vulnerability_pkey",
DROP COLUMN "cve_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "vulnerability_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "api_key" (
    "id" UUID NOT NULL,
    "key_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "user_id" UUID NOT NULL,

    CONSTRAINT "api_key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tech" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "technology_id" UUID NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'api',

    CONSTRAINT "project_tech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "host_tech" (
    "id" UUID NOT NULL,
    "host_id" UUID NOT NULL,
    "technology_id" UUID NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'api',

    CONSTRAINT "host_tech_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_key_key_hash_key" ON "api_key"("key_hash");

-- CreateIndex
CREATE UNIQUE INDEX "project_tech_project_id_technology_id_key" ON "project_tech"("project_id", "technology_id");

-- CreateIndex
CREATE UNIQUE INDEX "host_tech_host_id_technology_id_key" ON "host_tech"("host_id", "technology_id");

-- AddForeignKey
ALTER TABLE "vuln_state" ADD CONSTRAINT "vuln_state_technology_id_fkey" FOREIGN KEY ("technology_id") REFERENCES "technology"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vuln_state" ADD CONSTRAINT "vuln_state_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vuln_state" ADD CONSTRAINT "vuln_state_vulnerability_id_fkey" FOREIGN KEY ("vulnerability_id") REFERENCES "vulnerability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tech" ADD CONSTRAINT "project_tech_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tech" ADD CONSTRAINT "project_tech_technology_id_fkey" FOREIGN KEY ("technology_id") REFERENCES "technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "host_tech" ADD CONSTRAINT "host_tech_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "host"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "host_tech" ADD CONSTRAINT "host_tech_technology_id_fkey" FOREIGN KEY ("technology_id") REFERENCES "technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
