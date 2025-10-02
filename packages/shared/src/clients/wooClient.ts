import { AppError } from '../utils/errors.js';

export interface WooCredentials {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

export interface WooProductPayload {
  sku: string;
  name: string;
  description: string;
  short_description: string;
  regular_price?: string;
  sale_price?: string | null;
  status?: 'publish' | 'draft';
  stock_status?: 'instock' | 'outofstock';
  reviews_allowed?: boolean;
  categories?: { name: string }[];
  images?: { src: string }[];
  [key: string]: unknown;
}

export class WooClient {
  constructor(private readonly creds: WooCredentials) {}

  private get authQuery() {
    return `consumer_key=${encodeURIComponent(this.creds.consumerKey)}&consumer_secret=${encodeURIComponent(this.creds.consumerSecret)}`;
  }

  async upsertProduct(payload: WooProductPayload) {
    const existing = await this.findBySku(payload.sku);
    if (existing) {
      return this.updateProduct(existing.id, payload);
    }
    return this.createProduct(payload);
  }

  async findBySku(sku: string): Promise<{ id: number } | null> {
    const url = `${this.creds.baseUrl}/wp-json/wc/v3/products?sku=${encodeURIComponent(sku)}&${this.authQuery}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new AppError('WooCommerce lookup failed', 'WOO_LOOKUP_FAILED');
    }
    const json = (await res.json()) as Array<{ id: number }>;
    return json.at(0) ?? null;
  }

  async createProduct(payload: WooProductPayload) {
    const url = `${this.creds.baseUrl}/wp-json/wc/v3/products?${this.authQuery}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new AppError('WooCommerce create failed', 'WOO_CREATE_FAILED');
    }
    return res.json();
  }

  async updateProduct(id: number, payload: WooProductPayload) {
    const url = `${this.creds.baseUrl}/wp-json/wc/v3/products/${id}?${this.authQuery}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new AppError('WooCommerce update failed', 'WOO_UPDATE_FAILED');
    }
    return res.json();
  }
}
