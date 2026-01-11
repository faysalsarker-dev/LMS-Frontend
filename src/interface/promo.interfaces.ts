import type { IUser } from "./user.types";

export interface IPromoUsage {
  user: IUser ;
  usedAt: Date;
}


export type IPromo = {
  _id: string
  code: string
  description: string
  discountValue: number
  discountType: string
  createdBy: {
    _id: string
    name: string
    email: string
  }
  isActive: boolean
  isDeleted: boolean
  validFrom: string
  expirationDate: string
  maxUsageCount: number | null 
  currentUsageCount: number
  maxUsagePerUser: number
  minOrderAmount: number
  usedBy: IPromoUsage[]
  createdAt: string
  updatedAt: string
  __v: number
}
