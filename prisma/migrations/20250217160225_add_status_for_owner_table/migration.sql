/*
  Warnings:

  - Added the required column `status` to the `Owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Owner] ADD [status] VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Record] ADD [profileId] NVARCHAR(1000) NOT NULL,
[userId] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Profile] (
    [id] NVARCHAR(1000) NOT NULL,
    [clerkId] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [profileImage] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Profile_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Profile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Profile_clerkId_key] UNIQUE NONCLUSTERED ([clerkId])
);

-- CreateTable
CREATE TABLE [dbo].[Site] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(50) NOT NULL,
    CONSTRAINT [Site_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Record] ADD CONSTRAINT [Record_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Record] ADD CONSTRAINT [Record_profileId_fkey] FOREIGN KEY ([profileId]) REFERENCES [dbo].[Profile]([clerkId]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
