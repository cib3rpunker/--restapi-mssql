USE [dev-store]
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[spRemoveItemFromBasket]') AND type in (N'P', N'PC'))
BEGIN
  DROP PROCEDURE dbo.spRemoveItemFromBasket
END
GO

CREATE PROCEDURE dbo.spRemoveItemFromBasket
  @basketId INT,
  @productId INT
AS
BEGIN
  SET NOCOUNT ON

	BEGIN TRY
  BEGIN TRANSACTION

    IF EXISTS( SELECT 1 FROM dbo.BasketItems WHERE productId = @productId AND basketId = @basketId)
    BEGIN
      DELETE dbo.BasketItems
      WHERE productId = @productId
        AND basketId = @basketId

      SELECT 'ProductID ' + CONVERT(varchar(10), @productId) + ' DELETED from the basket' as [reply]
    END
    ELSE
    BEGIN
      SELECT 'Product NOT FOUND' as [reply]
    END

  COMMIT
	END TRY

	BEGIN CATCH
    ROLLBACK TRANSACTION
		EXEC dbo.spRethrowError
	END CATCH
END
GO
