/*
  Warnings:

  - A unique constraint covering the columns `[run]` on the table `participants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "participants_run_key" ON "participants"("run");
