BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstname] VARCHAR(50) NOT NULL,
    [lastname] VARCHAR(50) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Location] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(50) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Location_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Location_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Owner] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstname] VARCHAR(50) NOT NULL,
    [lastname] VARCHAR(50) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Owner_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Owner_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Box] (
    [id] INT NOT NULL IDENTITY(1,1),
    [boxNumber] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Box_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Box_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Record] (
    [id] INT NOT NULL IDENTITY(1,1),
    [site] NVARCHAR(1000) NOT NULL CONSTRAINT [Record_site_df] DEFAULT 'CITY HALL',
    [locationId] INT NOT NULL,
    [ownerId] INT NOT NULL,
    [boxId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Record_status_df] DEFAULT 'ACTIVE',
    [disposition] NVARCHAR(1000) NOT NULL CONSTRAINT [Record_disposition_df] DEFAULT 'ACTIVE',
    [retention] SMALLINT,
    [content] TEXT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Record_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [reviewDate] DATETIME NOT NULL,
    [deleteDate] DATETIME,
    CONSTRAINT [Record_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Record] ADD CONSTRAINT [Record_locationId_fkey] FOREIGN KEY ([locationId]) REFERENCES [dbo].[Location]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Record] ADD CONSTRAINT [Record_ownerId_fkey] FOREIGN KEY ([ownerId]) REFERENCES [dbo].[Owner]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Record] ADD CONSTRAINT [Record_boxId_fkey] FOREIGN KEY ([boxId]) REFERENCES [dbo].[Box]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
