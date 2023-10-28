import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { createResponse, createErrorResponse } from '@root/utils/response'
import { Brand } from '@model/Brand'
import { brandIdSchema, createBrandSchema, updateBrandSchema } from '@schema/brand'

export class BrandController {
  // Create a new brand
  async create(req: Request, res: Response) {
    const validationResult = createBrandSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const { name, images } = validationResult.data
    const user = req.user?.id
    try {
      const brand = new Brand({ name, user, images })
      await brand.save()
      return res.json(createResponse(brand, 'Brand created successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get all brands
  async getAll(req: Request, res: Response) {
    try {
      const brands = await Brand.find()
      return res.json(createResponse(brands, 'Brands retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get a single brand by ID
  async getById(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = brandIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const brand = await Brand.findById(id)
      if (!brand) {
        return res.status(404).json(createErrorResponse('Brand not found'))
      }
      return res.json(createResponse(brand, 'Brand retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Update a brand
  async update(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = updateBrandSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const { name, images } = validationResult.data
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid brand ID'))
    }
    try {
      const brand = await Brand.findById(id)
      if (!brand) {
        return res.status(404).json(createErrorResponse('Brand not found'))
      }
      brand.name = name || brand.name
      brand.images = images || brand.images
      await brand.save()

      return res.json(createResponse(brand, 'Brand updated successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Delete a brand
  async delete(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = brandIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const brand = await Brand.findByIdAndDelete(id)
      if (!brand) {
        return res.status(404).json(createErrorResponse('Brand not found'))
      }
      return res.json(createResponse({}, 'Brand deleted successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }
}

export default new BrandController()
