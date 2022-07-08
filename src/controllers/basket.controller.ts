import { Request, Response } from 'express'
import { dataAccess } from '../database'
import { v4 as uuidv4 } from 'uuid'

interface Basket {
	basketId: number | null
	buyerId: string
	items: {
		productId: number
		name: string
		price: number
		pictureUrl: string
		brand: string
		type: string
		quantity: number
	}[]
	error: any
}

export const getBuyerId = ( req ) => {
	// return User.Identity?.Name ?? Request.Cookies["buyerId"];
	return req.cookies['buyerId']

	// DEV NOTE: This is a workaround for dev-testing for the lack of a Cookie in the Request object.
	// return 'bdeda9b7-6c35-494a-815b-043c312d2878'
}

// call_spGetBasketByBuyerId
const getBasketByBuyerId = async ( buyerId ) => {
	if ( !buyerId ) {
		return null
	}
	console.log( 'getBasketByBuyerId() 🥖 buyerId:', buyerId )
	let basket: Basket = { basketId: null, buyerId: '', items: [], error: null }

	try {
		const result = await dataAccess.execute( `spGetBasketByBuyerId`, [
			{ name: 'buyerId', value: buyerId },
		] )

		const basketId = result?.recordsets[0][0]?.basketId
		// const buyerId = result?.recordsets[0][1]?.buyerId
		const products = result?.recordsets[1]

		if ( basketId == null || basketId == undefined || basketId <= -1 ) {
			return null
		}

		basket = { basketId, buyerId, items: [], error: null }

		// products.forEach( ({productId, basketId}) => {
		for ( let i = 0; i < products.length; i++ ) {
			basket.items.push( {
				productId: products[i].productId,
				name: products[i].name,
				price: products[i].price,
				pictureUrl: products[i].pictureUrl,
				brand: products[i].brand,
				type: products[i].type,
				quantity: products[i].quantity,
			} )
		}

		return basket
	} catch ( error: any ) {
		// res.status(500).send(error.message)
		console.log( `🛒 getBasketByBuyerId(): 🟡 ${error}` )
		// return { catch: { status: 500, title: '🟡 500 Internal Server Error' } }
		basket.error = error
		return basket
	}
}

const createBasket = ( res: Response ): Basket => {
	// var buyerId = User.Identity?.Name;

	// if (string.IsNullOrEmpty(buyerId)) {
	const buyerId = uuidv4()

	// 💙 http://expressjs.com/en/api.html#res.cookie
	const cookieOptions = { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 } // secure: true // Expires = DateTime.Now.AddDays(30)
	res.cookie( 'buyerId', buyerId, cookieOptions )
	// }

	// var basket = new basketModel({ buyerId: buyerId });
	let basket: Basket = {
		basketId: -1,
		buyerId: buyerId,
		items: [],
		error: null,
	}

	return basket
}

export const getProductById = async ( productId ) => {
	try {
		const result = await dataAccess.execute( `spGetProductById`, [
			{ name: 'productId', value: productId },
		] )

		const product = result?.recordset[0]

		if ( !product ) {
			return null
		} else {
			return product
		}
	} catch ( error: any ) {
		// res.status(500).send(error.message)
		console.log( `🥏 getProductById(): 🟡ERROR.MESSAGE: ${error.message} 🔴ERROR: ${error}` ) // 🟠ERROR.STACK: ${error.stack}
		// return { catch: { status: 500, title: '🟡 500 Internal Server Error' } }
		return error
	}
}

// GET api/basket
export const getBasket = async ( req: Request, res: Response ) => {
	console.log( '🛸 Entering getBasket' )
	try {
		let basket /* : Basket */ = await getBasketByBuyerId( getBuyerId( req ) )

		// if (basket?.name?.includes( 'Error', 'RequestError') || basket?.stack) {
		if ( basket?.error ) {
			throw new Error( basket.error )
		}

		if ( !basket ) {
			res.status( 404 ).send( '🔵 404 Basket Not Found' )
			return
		}

		res.status( 200 )
		res.send( basket )
	} catch ( error: any ) {
		console.log( `🛒 getBasket(): 🟡 ${error}` )
		res.status( 500 )
		res.send( { status: 500, title: `🟡 ${error}` } )
		return
	}
}

// POST api/basket?productId=7&quantity=33
export const addItemToBasket = async ( req: Request, res: Response ) => {
	console.log( '🛸 Entering addItemToBasket' )
	try {
		// debugger
		const { productId, quantity } = req.query

		let errorMsg: string= ''
		let invalidProductId = !productId || productId == 'undefined'
		let invalidQuantity = !quantity || quantity == 'undefined'
		errorMsg = invalidProductId ? '🔴 productId is required' : ''
		errorMsg += invalidQuantity ? '🔴 quantity is required' : ''

		if ( invalidProductId || invalidQuantity) {
			return res.status( 400 ).json( {
				msg: '🔥 Bad Request. ' + errorMsg,
			} )
		}

		// let basket: Basket = await call_spGetBasketByBuyerId(getBuyerId(req))
		let basket /* : Basket */ = await getBasketByBuyerId( getBuyerId( req ) )
		// if (basket?.name == 'RequestError' || basket?.stack ) {
		if ( basket?.error ) {
			throw new Error( basket.error )
		}

		if ( !basket ) {
			basket = createBasket( res )
		}

		const product = await getProductById( productId )

		if ( product?.name == 'RequestError' ) {
			throw new Error(product)
		}

		if ( !product ) {
			console.log( `🔴 Product not found` )
			res.status( 404 )
			res.send( { status: 404, title: '🎃 Product not found' } )
			return -1
		}

		const result = await dataAccess.execute( `spAddItemToBasket`, [
			{ name: 'basketId', value: basket.basketId },
			{ name: 'buyerId', value: basket.buyerId },
			{ name: 'productId', value: productId },
			{ name: 'quantity', value: quantity },
		] )

		const reply = result?.recordset[0]?.reply

		if ( reply?.includes( 'INSERTED' ) ) {
			basket?.items.push( {
				productId: +productId,
				name: product.name,
				price: product.price,
				pictureUrl: product.pictureUrl,
				brand: product.brand,
				type: product.type,
				quantity: +quantity,
			} )
		} else if ( reply?.includes( 'UPDATED' ) ) {
			basket.items.find( ( item ) => item.productId == +productId ).quantity = +quantity

			// USE the following alternative IF -> tsconfig.json "strictNullChecks": true
			// basket?.items.forEach((item, index) => {
			//   if(item.productId === +productId) {
			//     basket.items[index].quantity = +quantity
			//   }
			// });

			// basket = await getBasketByBuyerId(basket.buyerId)

			// TODO: why does this do not work?
			// 💙 https://stackoverflow.com/questions/35206125/how-can-i-find-and-update-values-in-an-array-of-objects
			// const index = basket?.items?.find(item => item.productId == +productId)
			// if (index) {
			//   basket.items[index].quantity = +quantity
			// // basket.items[index] = { productId: +productId, quantity: +quantity }
			// }
		}

		//💙https://stackoverflow.com/questions/14943607/how-to-set-the-location-response-http-header-in-express-framework
		res.location( req.protocol + '://' + req.get( 'host' ) + '/api/basket' )
		// res.setHeader('Location', req.protocol + '://' + req.get( 'host' ) + '/api/basket' )
		res.status( 201 ).json( { basket, result } )
		return 1
	} catch ( error: any ) {
		console.log( `🛒 addItemToBasket(): 🟡 ${error /* .message */}` )
		res.status( 500 )
		res.send( { status: 500, title: `🟡 ${error /* .message */}` } )
		return -1
	}
}

// DELETE api/basket?productId=1
export const removeItemFromBasket = async ( req: Request, res: Response ) => {
	console.log( '🛸 Entering removeItemFromBasket' )
	try {
		const { productId } = req.query

		if ( productId == null ) {
			return res.status( 400 ).json( {
				msg: 'Bad Request. Please fill all fields',
			} )
		}

		let basket /* : Basket */ = await getBasketByBuyerId( getBuyerId( req ) )
		if ( basket?.error ) {
			throw new Error( basket.error )
		}

		const result = await dataAccess.execute(`spRemoveItemFromBasket`, [
			{ name: 'basketId', value: basket.basketId },
			{ name: 'productId', value: productId },
		])

		const reply: string = result?.recordset[0]?.reply

		if ( reply?.includes( 'DELETED' ) ) {
			basket.items = basket.items.filter(
				( item ) => item.productId !== +productId,
			)
		} else {
			res.status( 404 ).send( { title: '🔴 Product not found', result } )
			return -1
		}

		res.status( 201 ).json( { basket, result } )
		return 1

	} catch ( error: any ) {
		console.log( `🛒 removeItemFromBasket(): 🟡 ${error /* .message */}` )
		res.status( 500 )
		res.send( { status: 500, title: `🟡 ${error /* .message */}` } )
		return -1
	}
}
