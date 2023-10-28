import { Document, Schema, Types, model } from 'mongoose'

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
  reviews: {
    _id: Types.ObjectId
    rating: number
    message: string
    user: Types.ObjectId
  }[]
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
    },
    category: {
      type: String,
      ref: 'Category',
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

ProductSchema.virtual('totalReviews').get(function (this: Product) {
  return this.reviews.length
})

ProductSchema.virtual('averageRating').get(function (this: Product) {
  if (this.reviews.length === 0) {
    return 0
  }
  const totalRating = this.reviews.reduce((accumulator, review) => accumulator + review.rating, 0)
  return totalRating / this.reviews.length
})

export const Product = model<Product>('Product', ProductSchema)
