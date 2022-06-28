export const querys = {
  spGetBasketById: `EXEC [dbo].[spGetBasketById] @basketId`,
  spAddItemToBasket: `EXEC [dbo].[spAddItemToBasket] @basketId, @buyerId, @productId, @quantity`,

  getProducts: 'SELECT * FROM [dev-store].[dbo].[Products]',
  getProductById: 'SELECT * FROM [dbo].[Products] Where productId = @productId',
}
