USE [dev-store]
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[spAddItemToBasket]') AND type in (N'P', N'PC'))
BEGIN
  DROP PROCEDURE dbo.spAddItemToBasket
END
GO

CREATE PROCEDURE dbo.spAddItemToBasket
  @basketId INT,
  @buyerId NVARCHAR(36),
  @productId INT,
  @quantity INT
AS
BEGIN
  SET NOCOUNT ON

	BEGIN TRY
  BEGIN TRANSACTION

    IF( @basketId <= -1 )
    BEGIN
      SELECT @basketId = MAX(B.basketId) + 1
        FROM dbo.Baskets B

      IF( @basketId IS NULL )
        SET @basketId = 0

      INSERT INTO dbo.Baskets
        (basketId, buyerId)
      VALUES
        (@basketId, @buyerId)
    END

    IF NOT EXISTS( SELECT 1 FROM dbo.BasketItems WHERE productId = @productId )
    BEGIN
      INSERT INTO dbo.BasketItems
        (basketId, productId, quantity)
      VALUES
        (@basketId, @productId, @quantity)

      SELECT 'Product INSERTED in the basket' as [reply]
    END
    ELSE
    BEGIN
      UPDATE dbo.BasketItems
      SET quantity = @quantity
      WHERE productId = @productId

      SELECT 'Product UPDATED in the basket' as [reply]
    END

    COMMIT
	END TRY

	BEGIN CATCH
    ROLLBACK TRANSACTION
		EXEC dbo.spRethrowError
	END CATCH
END
GO
