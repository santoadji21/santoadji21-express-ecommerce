import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { createResponse, createErrorResponse } from '@root/utils/response'
import { Order } from '@model/Order'
import { createOrderSchema, orderIdSchema, updateOrderSchema } from '@schema/order'

export class OrderController {
  // Create a new order
  async create(req: Request, res: Response) {
    const validationResult = createOrderSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }

    const { user, orderItems, shippingAddress, paymentMethod, currency } = validationResult.data
    try {
      const order = new Order({ user, orderItems, shippingAddress, paymentMethod, currency })
      await order.save()
      return res.json(createResponse(order, 'Order created successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get all orders
  async getAll(req: Request, res: Response) {
    try {
      const orders = await Order.find()
      return res.json(createResponse(orders, 'Orders retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get a single order by ID
  async getById(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = orderIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const order = await Order.findById(id)
      if (!order) {
        return res.status(404).json(createErrorResponse('Order not found'))
      }
      return res.json(createResponse(order, 'Order retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Update an order
  async update(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = updateOrderSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid order ID'))
    }
    try {
      const order = await Order.findById(id)
      if (!order) {
        return res.status(404).json(createErrorResponse('Order not found'))
      }
      Object.assign(order, validationResult.data)
      await order.save()

      return res.json(createResponse(order, 'Order updated successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Delete an order
  async delete(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = orderIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const order = await Order.findByIdAndDelete(id)
      if (!order) {
        return res.status(404).json(createErrorResponse('Order not found'))
      }
      return res.json(createResponse({}, 'Order deleted successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }
}

export default new OrderController()
