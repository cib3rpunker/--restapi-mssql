USE [dev-store]
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[spGetProductById]') AND type in (N'P', N'PC'))
BEGIN
  DROP PROCEDURE dbo.spGetProductById
END
GO

CREATE PROCEDURE [dbo].[spGetProductById]
  @productId INT
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
  SET NOCOUNT ON

  BEGIN TRY
    BEGIN TRANSACTION

    SELECT [productId],
    [name],
    [description],
    [price],
    [pictureUrl],
    [type],
    [brand],
    [quantityInStock]
    FROM dbo.Products
    WHERE productId = @productId;

    COMMIT
  END TRY

  BEGIN CATCH
    ROLLBACK TRANSACTION
		EXEC dbo.spRethrowError
	END CATCH

END
GO
