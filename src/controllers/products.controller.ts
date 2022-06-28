import { getConnection, querys, mssql as sql } from '../database'

export const getProducts = async (_, res) => {
  try {
    console.log('🥚 Entering getProducts')
    const pool = await getConnection()
    if (!pool) { throw new Error('🎱 pool is null 🩹 getConnection() failed 🎱') }

    const result = await pool?.request().query(querys.getProducts)
    res.json(result?.recordset)

  } catch (error: any) {
    console.log( '🔴 API ERROR 🔴', error )
    res.status(500).send({ status: 500, title: `🟡 ${error}` })
  }
}

// export const createNewProduct = async (req: any, res: any) => {
//   const { name, description } = req.body
//   let { quantity } = req.body

//   // validating
//   if (description == null || name == null) {
//     return res.status(400).json({
//       msg: 'Bad Request. Please fill all fields',
//     })
//   }

//   if (quantity == null) quantity = 0

//   try {
//     const pool = await getConnection()

//     await pool?.request()
//       .input('name', sql.VarChar, name)
//       .input('description', sql.Text, description)
//       .input('quantity', sql.Int, quantity)
//       .query(querys.addNewProduct)

//     res.json({ name, description, quantity })
//   } catch (error: any) {
//     res.status(500)
//     res.send(error.message)
//   }
// }

export const getProductById = async (req, res) => {
  try {
    const pool = await getConnection()

    const result = await pool?.request()
      .input('id', req.params.id)
      .query(querys.getProductById)

    const product = result?.recordset[0]
    console.log(`product: ${product}`)

    if(!product) {
      res.status(404)
      res.send({status: 404, title: '🎃 Product not found'})
      console.log(`🔴 Product not found`)
      return
    }
    else {
      return res.json(product)
    }

    // return res.json(result.recordset[0])
  } catch (error: any) {
    res.status(500)
    res.send(error.message)
    console.log(`🟡 500 Internal Server Error`)
  }
}

// export const deleteProductById = async (req, res) => {
//   try {
//     const pool = await getConnection()

//     const result = await pool?.request()
//       .input('id', req.params.id)
//       .query(querys.deleteProduct)

//     if (result?.rowsAffected[0] === 0) return res.sendStatus(404)

//     return res.sendStatus(204)
//   } catch (error: any) {
//     res.status(500)
//     res.send(error.message)
//   }
// }

// export const getTotalProducts = async (req, res) => {
//   const pool = await getConnection()

//   const result = await pool?.request().query(querys.getTotalProducts)
//   console.log(result)
//   res.json(result?.recordset[0][''])
// }

// export const updateProductById = async (req, res) => {
//   const { description, name, quantity } = req.body

//   // validating
//   if (description == null || name == null || quantity == null) {
//     return res.status(400).json({
//       msg: 'Bad Request. Please fill all fields',
//     })
//   }

//   try {
//     const pool = await getConnection()
//     await pool?.request()
//       .input('name', sql.VarChar, name)
//       .input('description', sql.Text, description)
//       .input('quantity', sql.Int, quantity)
//       .input('id', req.params.id)
//       .query(querys.updateProductById)
//     res.json({ name, description, quantity })
//   } catch (error: any) {
//     res.status(500)
//     res.send(error.message)
//   }
// }
