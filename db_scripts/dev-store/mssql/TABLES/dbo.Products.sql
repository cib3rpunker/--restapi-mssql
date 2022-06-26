USE [dev-store]
GO

-- Create a new table called '[Products]' in schema '[dbo]'
-- Drop the table if it already exists
IF OBJECT_ID('[dbo].[Products]', 'U') IS NOT NULL
DROP TABLE [dbo].[Products]
GO
-- Create the table in the specified schema
CREATE TABLE [dbo].[Products]
(
    [productId] int IDENTITY(1,1) PRIMARY KEY CLUSTERED NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(500) NOT NULL,
    [price] NUMERIC(18, 2) NOT NULL,
    [pictureUrl] NVARCHAR(200) NULL,
    [type] NVARCHAR(50) NULL,
    [brand] NVARCHAR(50) NULL,
    [quantityInStock] int NULL,    
);
GO
