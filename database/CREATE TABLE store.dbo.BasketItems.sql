USE store
GO

-- Create a new table called '[BasketItems]' in schema '[dbo]'
-- Drop the table if it already exists
IF OBJECT_ID('[dbo].[BasketItems]', 'U') IS NOT NULL
DROP TABLE [dbo].[BasketItems]
GO
-- Create the table in the specified schema
CREATE TABLE [dbo].[BasketItems]
(
    [id] INT NOT NULL PRIMARY KEY IDENTITY,
    [quantity] INT NOT NULL,
    [productId] INT NOT NULL,
    [basketId] INT NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES Products(id),
    FOREIGN KEY (BasketID) REFERENCES Baskets(id)
);
GO