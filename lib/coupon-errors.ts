export type CouponErrorCode =
  | "USER_NOT_FOUND"
  | "COUPON_INVALID"
  | "COUPON_ALREADY_USED"
  | "INVALID_INPUT"
  | "SERVER_ERROR";

export class CouponError extends Error {
  code: CouponErrorCode;

  constructor(code: CouponErrorCode, message: string) {
    super(message);
    this.name = "CouponError";
    this.code = code;
  }
}
