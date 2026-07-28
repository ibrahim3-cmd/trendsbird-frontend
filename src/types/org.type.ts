export interface Org {
  _id: string
  orgName: string
  orgEmail: string
  plan: Plan
  billingInfo: BillingInfo
  status: string
  orgPhone: string
  orgAddress?: {
    searchLocation?: string
    address?: string
    street?: string
    city?: string
    state?: string
    zip?: string
    lng?: number
    lat?: number
  }
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Plan {
  _id: string
  name: string
  slug: string
  durationUnit: string
  durationValue: number
  price: number
}

export interface BillingInfo {
  paymentMethodId: string
}
