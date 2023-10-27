import { Schema, model, Document, Types } from 'mongoose'

interface User extends Document {
  name: string
  email: string
  password: string
  orders: Types.ObjectId[]
  wishlist: Types.ObjectId[]
  isAdmin: boolean
  hasShippingAddress: boolean
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    province: string
    country: string
    phoneNumber: string
  }
}

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Convert email to lowercase
      trim: true, // Trim whitespace from the email
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Regex for basic email validation
    },
    password: {
      type: String,
      required: true,
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hasShippingAddress: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      province: {
        type: String,
      },
      country: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
    },
  },
  { timestamps: true },
)

export const User = model<User>('User', UserSchema)
