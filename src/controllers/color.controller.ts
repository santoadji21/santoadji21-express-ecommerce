import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { createResponse, createErrorResponse } from '@root/utils/response'

import { colorIdSchema, createColorSchema, updateColorSchema } from '@schema/color'
import { Color } from '@model/Color'

export class ColorController {
  // Create a new color
  async create(req: Request, res: Response) {
    const validationResult = createColorSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const { name, images } = validationResult.data
    const user = req.user?.id
    try {
      const color = new Color({ name, user, images })
      await color.save()
      return res.json(createResponse(color, 'Color created successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get all colors
  async getAll(req: Request, res: Response) {
    try {
      const colors = await Color.find()
      return res.json(createResponse(colors, 'Colors retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get a single color by ID
  async getById(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = colorIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const color = await Color.findById(id)
      if (!color) {
        return res.status(404).json(createErrorResponse('Color not found'))
      }
      return res.json(createResponse(color, 'Color retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Update a color
  async update(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = updateColorSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const { name, images } = validationResult.data
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid color ID'))
    }
    try {
      const color = await Color.findById(id)
      if (!color) {
        return res.status(404).json(createErrorResponse('Color not found'))
      }
      color.name = name || color.name
      color.images = images || color.images
      await color.save()

      return res.json(createResponse(color, 'Color updated successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Delete a color
  async delete(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = colorIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const color = await Color.findByIdAndDelete(id)
      if (!color) {
        return res.status(404).json(createErrorResponse('Color not found'))
      }
      return res.json(createResponse({}, 'Color deleted successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }
}

export default new ColorController()
