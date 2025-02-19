/*
  Warnings:

  - You are about to drop the column `firstname` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Owner` table. All the data in the column will be lost.
  - Added the required column `ownerlong` to the `Owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownername` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Owner] DROP COLUMN [firstname],
[lastname];
ALTER TABLE [dbo].[Owner] ADD [ownerlong] VARCHAR(50) NOT NULL,
[ownername] VARCHAR(25) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
