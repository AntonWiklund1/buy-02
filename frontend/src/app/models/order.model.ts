export interface Order {
    id: string;
    userId: string;
    productIds: string[];
    createdAt: string;
    updatedAt: string;
    status: string;
    isInCart: boolean;
    total: number;
  }
  