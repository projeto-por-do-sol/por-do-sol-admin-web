export type CouponType = 'PERCENTUAL' | 'FIXO'

export interface CouponRequest {
  tipoCupom: CouponType;
  valorDesconto: number;
  valorMinimo: number;
  descontoMaximo: number | null;
  dataExpiracao: string;
}

export interface CouponResponse extends CouponRequest {
  id: number;
  ativo: boolean;
}

export interface Coupon extends CouponResponse {
  kioskId: string;
  kioskName: string;
}
