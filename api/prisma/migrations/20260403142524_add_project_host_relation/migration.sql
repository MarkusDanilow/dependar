-- CreateTable
CREATE TABLE "project_host" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "host_id" UUID NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'api',

    CONSTRAINT "project_host_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_host_project_id_host_id_key" ON "project_host"("project_id", "host_id");

-- AddForeignKey
ALTER TABLE "project_host" ADD CONSTRAINT "project_host_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_host" ADD CONSTRAINT "project_host_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "host"("id") ON DELETE CASCADE ON UPDATE CASCADE;
