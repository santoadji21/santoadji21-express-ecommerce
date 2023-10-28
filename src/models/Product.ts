import { Schema, model, Document, Types } from 'mongoose'

interface Product extends Document {
  name: string
  description: string
  brand: string
  category: string
  price: number
  size: string[]
  colors: string[]
  user: Types.ObjectId
  images: string[]
  reviews: Types.ObjectId[]
  totalQuantity: number
  soldQuantity: number
}

const ProductSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      ref: 'Category',
      default: '',
    },
    size: {
      type: [String],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
        default: 'https://placehold.co/400',
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    price: {
      type: Number,
      default: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0,
      required: true,
    },
    soldQuantity: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)

export const Product = model<Product>('Product', ProductSchema)
