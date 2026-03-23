-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VIEWER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'RESOLVED', 'IGNORED');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "host" (
    "id" UUID NOT NULL,
    "hostname" TEXT NOT NULL,

    CONSTRAINT "host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "container" (
    "id" UUID NOT NULL,
    "host_id" UUID NOT NULL,
    "container_name" TEXT NOT NULL,

    CONSTRAINT "container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technology" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,

    CONSTRAINT "technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_dependency" (
    "id" UUID NOT NULL,
    "tech_id" UUID NOT NULL,
    "requires_tech_id" UUID NOT NULL,

    CONSTRAINT "tech_dependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "container_tech" (
    "id" UUID NOT NULL,
    "container_id" UUID NOT NULL,
    "technology_id" UUID NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "container_tech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vulnerability" (
    "cve_id" TEXT NOT NULL,
    "vulnerable_range" TEXT NOT NULL,
    "base_severity" TEXT NOT NULL,

    CONSTRAINT "vulnerability_pkey" PRIMARY KEY ("cve_id")
);

-- CreateTable
CREATE TABLE "vuln_state" (
    "id" UUID NOT NULL,
    "container_tech_id" UUID NOT NULL,
    "cve_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "vuln_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_insight" (
    "id" UUID NOT NULL,
    "vuln_state_id" UUID NOT NULL,
    "adjusted_severity" TEXT NOT NULL,

    CONSTRAINT "ai_insight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tech_dependency_tech_id_requires_tech_id_key" ON "tech_dependency"("tech_id", "requires_tech_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_insight_vuln_state_id_key" ON "ai_insight"("vuln_state_id");

-- AddForeignKey
ALTER TABLE "container" ADD CONSTRAINT "container_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_dependency" ADD CONSTRAINT "tech_dependency_tech_id_fkey" FOREIGN KEY ("tech_id") REFERENCES "technology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tech_dependency" ADD CONSTRAINT "tech_dependency_requires_tech_id_fkey" FOREIGN KEY ("requires_tech_id") REFERENCES "technology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "container_tech" ADD CONSTRAINT "container_tech_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "container"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "container_tech" ADD CONSTRAINT "container_tech_technology_id_fkey" FOREIGN KEY ("technology_id") REFERENCES "technology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vuln_state" ADD CONSTRAINT "vuln_state_container_tech_id_fkey" FOREIGN KEY ("container_tech_id") REFERENCES "container_tech"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vuln_state" ADD CONSTRAINT "vuln_state_cve_id_fkey" FOREIGN KEY ("cve_id") REFERENCES "vulnerability"("cve_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insight" ADD CONSTRAINT "ai_insight_vuln_state_id_fkey" FOREIGN KEY ("vuln_state_id") REFERENCES "vuln_state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
