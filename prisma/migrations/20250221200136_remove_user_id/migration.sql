/*
  Warnings:

  - You are about to drop the column `userId` on the `Record` table. All the data in the column will be lost.
  - Made the column `retention` on table `Record` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Record] ALTER COLUMN [retention] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Record] DROP COLUMN [userId];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
