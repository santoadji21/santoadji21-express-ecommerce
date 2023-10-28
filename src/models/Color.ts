import { Schema, model, Document, Types } from 'mongoose'

interface Color extends Document {
  name: string
  user: Types.ObjectId
  images: string
  products: Types.ObjectId[]
}

const ColorSchema = new Schema<Color>(
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
  },
  {
    timestamps: true,
  },
)

export const Color = model<Color>('Color', ColorSchema)
