import { querys, dataAccess } from '../database'

export const getProducts = async ( _, res ) => {
	try {
		console.log( '🥚 Entering getProducts()' )
		const result = await dataAccess.query( querys.getProducts )

		res.json( result?.recordset )

	} catch ( error: any ) {
		console.log( '🔴 API ERROR 🔴', error )
		res.status( 500 ).send( { status: 500, title: `🟡 ${error}` } )
	}
}

export const getProductById = async ( req, res ) => {
	try {
		const result = await dataAccess.execute( 'spGetProductById', [
			{ name: 'productId', value: req.params.id },
		] )

		const product = result?.recordset[0]

		if ( !product ) {
			res.status( 404 )
			res.send( { status: 404, title: '🎃 Product not found' } )
			console.log( `🔴 Product not found` )
			return
		} else {
			return res.json( product )
		}

		// return res.json(result.recordset[0])
	} catch ( error: any ) {
		res.status( 500 )
		res.send( error.message )
		console.log( `🟡 500 Internal Server Error` )
	}
}

//       .input('name', sql.VarChar, name)
//       .input('description', sql.Text, description)
//       .input('quantity', sql.Int, quantity)
//       .query(querys.updateProductById)
