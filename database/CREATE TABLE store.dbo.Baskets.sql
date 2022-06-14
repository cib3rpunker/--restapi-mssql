USE store
GO

-- Create a new table called '[Baskets]' in schema '[dbo]'
-- Drop the table if it already exists
IF OBJECT_ID('[dbo].[Baskets]', 'U') IS NOT NULL
DROP TABLE [dbo].[Baskets]
GO
-- Create the table in the specified schema
CREATE TABLE [dbo].[Baskets]
(
    [id] INT NOT NULL PRIMARY KEY,
    [buyerId] NVARCHAR(50) NOT NULL,
);
GO