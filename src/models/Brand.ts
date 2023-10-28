import { Schema, model, Document, Types } from 'mongoose'

interface Brand extends Document {
  name: string
  user: Types.ObjectId
  images: string
  products: Types.ObjectId[]
}

const BrandSchema = new Schema<Brand>(
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

export const Brand = model<Brand>('Brand', BrandSchema)
