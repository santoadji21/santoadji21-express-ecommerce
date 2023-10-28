import { Brand } from '@model/Brand'
import { Category } from '@model/Category'
import { Product } from '@model/Product'
import { Review } from '@model/Review'
import { createProductSchema, productIdSchema, updateProductSchema } from '@schema/product'
import { logError, logInfo } from '@utils/logger'
import { productFilter } from '@utils/product'
import { createErrorResponse, createResponse } from '@utils/response'
import { Request, Response } from 'express'
import { Types } from 'mongoose'

export class ProductController {
  // Create a new product
  async create(req: Request, res: Response) {
    const validationResult = createProductSchema.safeParse(req.body)
    if (!validationResult.success) {
      logError('Validation error', req, validationResult.error.issues)
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const productData = validationResult.data
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      logError('Unauthorized access', req, null)
      return res.status(401).json(createErrorResponse('Unauthorized access'))
    }
    try {
      const categoryProduct = await Category.findOne({ name: productData.category })
      const brandProduct = await Brand.findOne({ name: productData.brand })
      const existingProduct = await Product.findOne({ name: productData.name })
      if (!categoryProduct) {
        logError('Category not found', req, null)
        return res.status(404).json(createErrorResponse('Category not found'))
      }
      if (!brandProduct) {
        logError('Brand not found', req, null)
        return res.status(404).json(createErrorResponse('Brand not found'))
      }
      if (existingProduct) {
        logError('Product already exists', req, null)
        return res.status(400).json(createErrorResponse('Product already exists'))
      }
      const newProductData = {
        ...productData,
        user: req.user.id,
      }

      const product = await Product.create(newProductData)
      categoryProduct.products.push(product._id)
      await categoryProduct.save()
      brandProduct.products.push(product._id)
      await brandProduct.save()
      logInfo('Products create successfully', req)
      return res.json(createResponse(product, 'Product created successfully'))
    } catch (error) {
      logError('Server error', req, error)
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  async getAverageRating(productId: Types.ObjectId): Promise<number> {
    const aggregationResult = await Review.aggregate([
      { $match: { products: { $in: [productId] } } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ])

    const result = aggregationResult[0]
    return result ? result.averageRating : 0
  }

  // Get all products
  async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    try {
      const filter = productFilter(req)
      const products = await Product.find(filter).skip(skip).limit(limit).populate('reviews')
      const totalProducts = await Product.countDocuments(filter)
      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
      }
      logInfo('Products retrieved successfully', req)
      return res.json(createResponse({ products, pagination }, 'Products retrieved successfully'))
    } catch (error) {
      logError('Error retrieving products', req, error)
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get a single product by ID
  async getById(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = productIdSchema.safeParse(id)
    if (!validationResult.success) {
      logError('Validation error', req, validationResult.error.issues)
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const product = await Product.findById(id)
      if (!product) {
        logError('Product not found', req, null)
        return res.status(404).json(createErrorResponse('Product not found'))
      }
      logInfo('Product retrieved successfully', req)
      return res.json(createResponse(product, 'Product retrieved successfully'))
    } catch (error) {
      logError('Error retrieving product', req, error)
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Update a product
  async update(req: Request, res: Response) {
    const { id } = req.params
    const validationIdResult = productIdSchema.safeParse(id)
    if (!validationIdResult.success) {
      logError('Validation error', req, validationIdResult.error.issues)
      return res.status(400).json(createErrorResponse('Validation error', validationIdResult.error.issues))
    }
    const validationResult = updateProductSchema.safeParse(req.body)
    if (!validationResult.success) {
      logError('Validation error', req, validationResult.error.issues)
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const updateData = validationResult.data
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true })
      if (!updatedProduct) {
        logError('Product not found', req, null)
        return res.status(404).json(createErrorResponse('Product not found'))
      }
      logInfo('Product updated successfully', req)
      return res.json(createResponse(updatedProduct, 'Product updated successfully'))
    } catch (error) {
      logError('Error updating product', req, error)
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Delete a product
  async delete(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = productIdSchema.safeParse(id)
    if (!validationResult.success) {
      logError('Validation error', req, validationResult.error.issues)
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const deletedProduct = await Product.findByIdAndDelete(id)
      if (!deletedProduct) {
        logError('Product not found', req, null)
        return res.status(404).json(createErrorResponse('Product not found'))
      }
      logInfo('Product deleted successfully', req)
      return res.json(createResponse({}, 'Product deleted successfully'))
    } catch (error) {
      logError('Error deleting product', req, error)
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }
}

export default new ProductController()
