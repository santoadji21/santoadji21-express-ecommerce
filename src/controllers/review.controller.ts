import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { createResponse, createErrorResponse } from '@root/utils/response'
import { Review } from '@model/Review'
import { createReviewSchema, updateReviewSchema, reviewIdSchema } from '@schema/review'
import { Product } from '@model/Product'

export class ReviewController {
  // Create a new review
  async create(req: Request, res: Response) {
    const validationResult = createReviewSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const { rating, message } = validationResult.data
    const productId = req.params.productId // Get product ID from URL params
    const user = req.user?.id

    try {
      // Check if the product exists
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json(createErrorResponse('Product not found'))
      }
      // Check if the user has already submitted a review for this product
      const existingReview = await Review.findOne({ user, products: { $in: [productId] } })
      if (existingReview) {
        return res.status(400).json(createErrorResponse('User has already submitted a review for this product'))
      }
      // Create and save the review
      const review = new Review({ rating, message, user, products: [productId] })
      await review.save()
      // Optionally, update the product to include this review
      product.reviews.push(review._id)
      await product.save()
      return res.json(createResponse(review, 'Review created successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get all reviews
  async getAll(_req: Request, res: Response) {
    try {
      const reviews = await Review.find().populate('user', 'name email')
      return res.json(createResponse(reviews, 'Reviews retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get a single review by ID
  async getById(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = reviewIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const review = await Review.findById(id).populate('user', 'name email')
      if (!review) {
        return res.status(404).json(createErrorResponse('Review not found'))
      }
      return res.json(createResponse(review, 'Review retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Update a review
  async update(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = updateReviewSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid review ID'))
    }
    try {
      const review = await Review.findById(id)
      if (!review) {
        return res.status(404).json(createErrorResponse('Review not found'))
      }

      review.rating = validationResult.data.rating ?? review.rating
      review.message = validationResult.data.message ?? review.message
      await review.save()

      return res.json(createResponse(review, 'Review updated successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Delete a review
  async delete(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = reviewIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const review = await Review.findByIdAndDelete(id)
      if (!review) {
        return res.status(404).json(createErrorResponse('Review not found'))
      }
      return res.json(createResponse({}, 'Review deleted successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }
}

export default new ReviewController()
