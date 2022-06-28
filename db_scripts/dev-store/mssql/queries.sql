USE [dev-store]

-- TESTING
---------------------------------------------------------------------------
-- SELECT * FROM store.dbo.Baskets
--   WHERE buyerId = '4c8f5cd4-1df9-40ac-a99c-84b8b84c2370'


-- DECLARE @buyerId VARCHAR(36)
-- SET @buyerId = '4c8f5cd4-1df9-40ac-a99c-84b8b84c2370'

-- EXEC spGetBasketByBuyerId @buyerId


EXEC dbo.spGetBasketByBuyerId 'dbe0a1e8-4fe0-4b4f-81bc-5ff501bade87'
-- EXEC spGetBasketByBuyerId 'bdeda9b7-6c35-494a-815b-043c312d2878'


-- INSERT INTO BasketItems
--   (quantity, productId, basketId )
-- VALUES
--   (1, 2, 6);

-- INSERT INTO BasketItems
--   (quantity, productId, basketId )
-- VALUES
--   (50, 3, 6);

-- sp_who spGetBasketByBuyerId





-- TESTING
---------------------------------------------------------------------------
-- DELETE dbo.BasketItems
-- DELETE dbo.Baskets

-- SELECT * FROM store.dbo.Baskets
--   WHERE buyerId = '4c8f5cd4-1df9-40ac-a99c-84b8b84c2370'


-- DECLARE @buyerId VARCHAR(36)
-- SET @buyerId = '4c8f5cd4-1df9-40ac-a99c-84b8b84c2370'

-- EXEC spGetBasketByBuyerId @buyerId


-- EXEC spGetBasketByBuyerId '4c8f5cd4-1df9-40ac-a99c-84b8b84c2370'
-- EXEC spGetBasketByBuyerId 'bdeda9b7-6c35-494a-815b-043c312d2878'


-- INSERT INTO BasketItems
--   (quantity, productId, basketId )
-- VALUES
--   (1, 2, 6);

-- INSERT INTO BasketItems
--   (quantity, productId, basketId )
-- VALUES
--   (50, 3, 6);

-- sp_who spGetBasketByBuyerId

-------------------------------------------------------------------------------------------

SELECT * FROM store.dbo.Baskets
SELECT * FROM store.dbo.BasketItems


DECLARE @buyerId TEXT
DECLARE @basketId INT
DECLARE @productId INT
DECLARE @quantity INT

SET @basketId = -1;

IF( @basketId <= -1 )
BEGIN
    SELECT @basketId = MAX(id) + 1 FROM store.dbo.Baskets
    IF( @basketId IS NULL )
        SET @basketId = 0

    INSERT INTO store.dbo.Baskets
    (id, buyerId)
    VALUES
    (@basketId, @buyerId)

    INSERT INTO store.dbo.BasketItems
      (basketId, productId, quantity)
    VALUES
      (@basketId, @productId, @quantity)
END




---------------------------------------------------------------------
SELECT * FROM store.dbo.BasketItems
SELECT * FROM store.dbo.Baskets

    DECLARE @basketId INT
    SELECT @basketId = MAX(id) + 1 FROM store.dbo.Baskets
    IF( @basketId IS NULL )
        SET @basketId = 0

    SELECT @basketId


SELECT TOP(500) * FROM [calendar].[dbo].[Products]

USE [dev-store]

USE [master]
GO

DROP DATABASE [dev-store];
GO

DROP PROCEDURE dbo.spGetBasketByBuyerId
DROP PROCEDURE dbo.spRethrowError
DROP PROCEDURE dbo.spAddItemToBasket

DELETE dbo.BasketItems
DELETE dbo.Baskets

DROP TABLE dbo.Products
DROP TABLE dbo.BasketItems
DROP TABLE dbo.Baskets


-- GET THE LAST INSERT ID
SELECT SCOPE_IDENTITY() as 


SELECT USER_NAME();


---------------------------------------------------
SELECT * FROM dbo.BasketItems

 EXECUTE dbo.spRemoveItemFromBasket @productId = 2, @basketId = 0

 INSERT INTO dbo.Baskets (basketId, buyerId)
 VALUES (1, 'bdeda9b7-6c35-494a-815b-043c312d2878')

    SELECT 
    SCOPE_IDENTITY() AS [SCOPE_IDENTITY()], 
    IDENT_CURRENT('dbo.BasketItems') AS [IDENT_CURRENT('dbo.BasketItems')],
    @@IDENTITY AS [@@IDENTITY]
