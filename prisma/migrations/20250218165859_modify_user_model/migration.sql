/*
  Warnings:

  - Added the required column `accessType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `site` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userContact` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ADD [accessType] VARCHAR(50) NOT NULL,
[email] VARCHAR(50) NOT NULL,
[organization] VARCHAR(100) NOT NULL,
[site] VARCHAR(50) NOT NULL,
[userContact] VARCHAR(50) NOT NULL,
[userName] VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Preference] (
    [id] INT NOT NULL IDENTITY(1,1),
    [itemValue] INT NOT NULL,
    [itemDefault] INT NOT NULL,
    [itemType] VARCHAR(20) NOT NULL,
    [authLevel] VARCHAR(20) NOT NULL,
    CONSTRAINT [Preference_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
