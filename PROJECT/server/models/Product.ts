import mongoose, { Schema, type Document } from 'mongoose'

export interface IProduct extends Document {
  slug: string
  name: string
  price: number
  description: string
  image: string
  tint: string
  category: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    slug:        { type: String, required: true, unique: true },
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    description: { type: String, required: true },
    image:       { type: String, required: true },
    tint:        { type: String, required: true },
    category:    { type: String, required: true },
  },
  { timestamps: true }
)

export const Product = mongoose.model<IProduct>('Product', ProductSchema)
