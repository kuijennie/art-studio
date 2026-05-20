import mongoose, { Schema, type Document } from 'mongoose'

export interface IOrderItem {
  slug: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface IOrder extends Document {
  orderNumber: string
  email: string
  name: string
  phone?: string
  address: string
  city: string
  postal?: string
  country: string
  items: IOrderItem[]
  subtotal: number
  shippingCost: number
  total: number
  currency: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  stripePaymentMethodId?: string
  stripePaymentIntentId?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    email:       { type: String, required: true, index: true },
    name:        { type: String, required: true },
    phone:       String,
    address:     { type: String, required: true },
    city:        { type: String, required: true },
    postal:      String,
    country:     { type: String, required: true },
    items: [
      {
        slug:     { type: String, required: true },
        name:     { type: String, required: true },
        price:    { type: Number, required: true },
        quantity: { type: Number, required: true },
        image:    String,
      },
    ],
    subtotal:              { type: Number, required: true },
    shippingCost:          { type: Number, default: 0 },
    total:                 { type: Number, required: true },
    currency:              { type: String, default: 'kes' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    stripePaymentMethodId: String,
    stripePaymentIntentId: String,
  },
  { timestamps: true }
)

export const Order = mongoose.model<IOrder>('Order', OrderSchema)
