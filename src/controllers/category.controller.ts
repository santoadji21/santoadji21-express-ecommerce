import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { createResponse, createErrorResponse } from '@root/utils/response'
import { Category } from '@model/Category'
import { categoryIdSchema, createCategorySchema, updateCategorySchema } from '@schema/category'

export class CategoryController {
  // Create a new category
  async create(req: Request, res: Response) {
    const validationResult = createCategorySchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const { name, images } = validationResult.data
    const user = req.user?.id
    try {
      const category = new Category({ name, user, images })
      await category.save()
      return res.json(createResponse(category, 'Category created successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get all categories
  async getAll(req: Request, res: Response) {
    try {
      const categories = await Category.find()
      return res.json(createResponse(categories, 'Categories retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get a single category by ID
  async getById(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = categoryIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const category = await Category.findById(id)
      if (!category) {
        return res.status(404).json(createErrorResponse('Category not found'))
      }
      return res.json(createResponse(category, 'Category retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Update a category
  async update(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = updateCategorySchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const { name, images } = validationResult.data
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid category ID'))
    }
    try {
      const category = await Category.findById(id)
      if (!category) {
        return res.status(404).json(createErrorResponse('Category not found'))
      }
      category.name = name || category.name
      category.images = images || category.images
      await category.save()

      return res.json(createResponse(category, 'Category updated successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Delete a category
  async delete(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = categoryIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const category = await Category.findByIdAndDelete(id)
      if (!category) {
        return res.status(404).json(createErrorResponse('Category not found'))
      }
      return res.json(createResponse({}, 'Category deleted successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }
}

export default new CategoryController()
