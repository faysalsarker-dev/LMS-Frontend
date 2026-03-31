import type { IUser } from "./user.types";

export interface IPromoUsage {
  user: IUser;
  course: string; // Course ObjectId
  usedAt: Date;
}

export type IPromo = {
  _id: string;
  code: string;
  discountValue: number;
  discountType: "percentage" | "fixed_amount";
  currency: string;
  owner: IUser;
  commission: number;
  totalEarn: number;
  isActive: boolean;
  validFrom: string;
  expirationDate: string;
  maxUsageCount: number | null;
  currentUsageCount: number;
  maxUsagePerUser: number;
  usedBy: IPromoUsage[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
