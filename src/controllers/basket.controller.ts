import { Request, Response } from 'express'
import { getConnection, querys, mssql as sql } from '../database'
import { v4 as uuidv4 } from 'uuid'

interface Basket {
  basketId: number | null
  buyerId: string
  items: {
    productId: number
    quantity: number
  }[],
  error,
}

export const getBuyerId = (req) => {
  // return User.Identity?.Name ?? Request.Cookies["buyerId"];
  return req.cookies['buyerId']
}

// call_spGetBasketByBuyerId
const retrieveBasket = async (buyerId) => {
  if (!buyerId) {
    return null
  }
  console.log('retrieveBasket() 🥖 buyerId:', buyerId)
  let basket: Basket = { basketId: null, buyerId: '', items: [], error: null }

  try {
    const pool = await getConnection()

    if (!pool) {
      throw new Error()
    }

    const result = await pool
      ?.request()
      .input('buyerId', buyerId)
      .execute('spGetBasketById')

    const basketId = result?.recordsets[0][0]?.basketId
    // const buyerId = result?.recordsets[0][1]?.buyerId
    const products = result?.recordsets[1]

    if (basketId == null || basketId == undefined || basketId <= -1) {
      return null
    }

    basket = { basketId, buyerId, items: [], error: null }

    // products.forEach( ({productId, basketId}) => {
    for (let i = 0; i < products.length; i++) {
      basket.items.push({
        productId: products[i].productId,
        quantity: products[i].quantity,
      })
    }

    return basket
  } catch (error: any) {
    // res.status(500).send(error.message)
    console.log(`🛒 retrieveBasket(): 🟡 ${error}`)
    // return { catch: { status: 500, title: '🟡 500 Internal Server Error' } }
    basket.error = error
    return basket
  }
}

const createBasket = (res: Response): Basket => {
  // var buyerId = User.Identity?.Name;

  // if (string.IsNullOrEmpty(buyerId)) {
  const buyerId = uuidv4()

  // 💙 http://expressjs.com/en/api.html#res.cookie
  const cookieOptions = { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 } // secure: true // Expires = DateTime.Now.AddDays(30)
  res.cookie('buyerId', buyerId, cookieOptions)
  // }

  // var basket = new basketModel({ buyerId: buyerId });
  let basket: Basket = { basketId: -1, buyerId: buyerId, items: [], error: null }

  return basket
}

export const retrieveProduct = async (productId) => {
  try {
    const pool = await getConnection()
    if (!pool) {
      throw new Error()
    }

    const result = await pool
      ?.request()
      .input('productId', productId)
      .query(querys.getProductById)

    const product = result?.recordset[0]
    // console.log(`product: ${product}`)

    if (!product) {
      return null
    } else {
      return product
    }
  } catch (error: any) {
    // res.status(500).send(error.message)
    console.log(`🥏 retrieveProduct(): 🟡 ${error}`)  // error.message
    // return { catch: { status: 500, title: '🟡 500 Internal Server Error' } }
    return error
  }
}

// GET api/basket
export const getBasket = async (req: Request, res: Response) => {
  console.log('🛸 Entering getBasket')
  try {
    let basket/* : Basket */ = await retrieveBasket(getBuyerId(req))

    // if (basket?.name?.includes( 'Error', 'RequestError') || basket?.stack) {
    if (basket?.error) {
      throw new Error(basket.error)
    }

    if (!basket) {
      res.status(404).send('🔵 404 Basket Not Found')
      return
    }

    res.status(200)
    res.send(basket)

  } catch (error: any) {
    console.log(`🛒 getBasket(): 🟡 ${error}`)
    res.status(500)
    res.send({ status: 500, title: `🟡 ${error}` })
    return
  }
}

// POST api/basket?productId=7&quantity=33
export const addItemToBasket = async (req: Request, res: Response) => {
  console.log('🛸 Entering addItemToBasket')
  try {
    // debugger
    const { productId, quantity } = req.query

    // validating
    if (productId == null || quantity == null) {
      return res.status(400).json({
        msg: 'Bad Request. Please fill all fields',
      })
    }

    // let basket: Basket = await call_spGetBasketByBuyerId(getBuyerId(req))
    let basket/* : Basket */ = await retrieveBasket(getBuyerId(req))
    // if (basket?.name == 'RequestError' || basket?.stack ) {
    if (basket?.error) {
      throw new Error(basket.error)
    }

    if (!basket) {
      basket = createBasket(res)
    }

    const product = await retrieveProduct(productId)

    // if (product?.catch) {
    if (product?.name == 'RequestError') {
      throw new Error()
    }

    if (!product) {
      console.log(`🔴 Product not found`)
      res.status(404)
      res.send({ status: 404, title: '🎃 Product not found' })
      return -1
    }

    const pool = await getConnection()
    const result = await pool
    ?.request()
    .input('basketId', sql.Int, basket.basketId)
    .input('buyerId', sql.Text, basket.buyerId)
    .input('productId', sql.Int, productId)
    .input('quantity', sql.Int, quantity)
    .query(querys.spAddItemToBasket)

    const reply = result?.recordset[0]?.reply

    if(reply?.includes('INSERTED')) {
      basket?.items.push({ productId: +productId, quantity: +quantity })
    } else if(reply?.includes('UPDATED')) {
      basket.items.find(item => item.productId == +productId).quantity = +quantity

      // USE the following alternative IF -> tsconfig.json "strictNullChecks": true
      // basket?.items.forEach((item, index) => {
      //   if(item.productId === +productId) {
      //     basket.items[index].quantity = +quantity
      //   }
      // });

      // basket = await retrieveBasket(basket.buyerId)

      // TODO: why does this do not work?
      // 💙 https://stackoverflow.com/questions/35206125/how-can-i-find-and-update-values-in-an-array-of-objects
      // const index = basket?.items?.find(item => item.productId == +productId)
      // if (index) {
      //   basket.items[index].quantity = +quantity
      // // basket.items[index] = { productId: +productId, quantity: +quantity }
      // }
    }

    res.status(201).json({ basket, result })
    return 1

  } catch (error: any) {
    console.log(`🛒 addItemToBasket(): 🟡 ${error/* .message */}`)
    res.status(500)
    res.send({ status: 500, title: `🟡 ${error/* .message */}` })
    return -1
  }
}
