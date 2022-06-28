export const querys = {
  spGetBasketByBuyerId: `EXEC [dbo].[spGetBasketByBuyerId] @basketId`,
  spAddItemToBasket: `EXEC [dbo].[spAddItemToBasket] @basketId, @buyerId, @productId, @quantity`,

  getProducts: 'SELECT * FROM [dev-store].[dbo].[Products]',
  getProductById: 'SELECT * FROM [dbo].[Products] Where productId = @productId',
}
