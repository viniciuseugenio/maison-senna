export interface CartItem {
  variationSku: string;
  quantity: number;
}

export interface ServerCartItem {
  imageUrl: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  variationSku: string;
  productName: string;
  options: string[];
}

export interface ServerCart {
  subtotal: number;
  items: ServerCartItem[];
}
