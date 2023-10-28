import { Schema, model, Document, Types } from 'mongoose'

interface Category extends Document {
  name: string
  user: Types.ObjectId
  images: string
  products: Types.ObjectId[]
}

const CategorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: {
      type: String,
      required: true,
      default: 'https://placehold.co/400',
    },

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  },
)

export const Category = model<Category>('Category', CategorySchema)
