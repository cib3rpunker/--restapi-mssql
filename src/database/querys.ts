export const querys = {
  spGetBasketByBuyerId: `EXEC [dbo].[spGetBasketByBuyerId] @basketId`,
  spAddItemToBasket: `EXEC [dbo].[spAddItemToBasket] @basketId, @buyerId, @productId, @quantity`,
  spRemoveItemFromBasket: `EXEC [dbo].[spRemoveItemFromBasket] @basketId, @productId`,

  getProducts: 'SELECT * FROM [dev-store].[dbo].[Products]',
  getProductById: 'SELECT * FROM [dbo].[Products] Where productId = @productId',
}
