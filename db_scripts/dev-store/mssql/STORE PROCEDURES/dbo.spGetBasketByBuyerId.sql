USE [dev-store]
GO

IF EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[spGetBasketByBuyerId]') AND type in (N'P', N'PC'))
BEGIN
  DROP PROCEDURE dbo.spGetBasketByBuyerId
END
GO

CREATE PROCEDURE [dbo].[spGetBasketByBuyerId]
  @buyerId NVARCHAR(36)
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
  SET NOCOUNT ON

  BEGIN TRY
    BEGIN TRANSACTION

    SELECT basketId, buyerId
    FROM Baskets
    WHERE buyerId = @buyerId;

    SELECT BI.productId, BI.quantity
    FROM Baskets B
      INNER JOIN BasketItems BI
      ON B.basketId = BI.basketId
    WHERE B.buyerId = @buyerId;

    COMMIT
  END TRY

  BEGIN CATCH
    ROLLBACK TRANSACTION
		EXEC dbo.spRethrowError
	END CATCH

END
GO
