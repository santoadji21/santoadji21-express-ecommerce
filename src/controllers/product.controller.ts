import { Request, Response } from 'express'
import { createResponse, createErrorResponse } from '@utils/response'
import { Product } from '@model/Product'
import { createProductSchema, updateProductSchema } from '@schema/product'
import { productFilter } from '@utils/product'

export class ProductController {
  // Create a new product
  async create(req: Request, res: Response) {
    const validationResult = createProductSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const productData = validationResult.data
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json(createErrorResponse('Unauthorized access'))
    }
    try {
      // Include the user's ID in the product data
      const newProductData = {
        ...productData,
        user: req.user.id,
      }
      const product = await Product.create(newProductData)
      return res.json(createResponse(product, 'Product created successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get all products
  async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    try {
      const filter = productFilter(req)
      const products = await Product.find(filter).skip(skip).limit(limit)
      const totalProducts = await Product.countDocuments(filter)

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
      }
      return res.json(createResponse({ products, pagination }, 'Products retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get a single product by ID
  async getById(req: Request, res: Response) {
    const { id } = req.params
    try {
      const product = await Product.findById(id)
      if (!product) {
        return res.status(404).json(createErrorResponse('Product not found'))
      }
      return res.json(createResponse(product, 'Product retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Update a product
  async update(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = updateProductSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const updateData = validationResult.data
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true })
      if (!updatedProduct) {
        return res.status(404).json(createErrorResponse('Product not found'))
      }
      return res.json(createResponse(updatedProduct, 'Product updated successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Delete a product
  async delete(req: Request, res: Response) {
    const { id } = req.params
    try {
      const deletedProduct = await Product.findByIdAndDelete(id)
      if (!deletedProduct) {
        return res.status(404).json(createErrorResponse('Product not found'))
      }
      return res.json(createResponse({}, 'Product deleted successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }
}

export default new ProductController()
