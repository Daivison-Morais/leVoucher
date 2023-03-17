import { jest } from "@jest/globals";
import voucherService from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";

describe("Voucher Service", () => {
  

  it("deve retornar Voucher already exist.", async () => {
    const amount = "105";
    const discount = 10;

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(()=>{
      return true;
    });

    const result =  voucherService.createVoucher(amount, discount);
    expect(result).rejects.toEqual({
      message: "Voucher already exist.",
      type: "conflict"
    });
  });

  /* it("deve retornar Voucher already exist.", async () => {
    const amount = "105";
    const discount = 10;
    const code = "d5s1d51d5s6s2d"

    const expectedResult = {
      id: 1,
      code: "d5s1d51d5s6s2d",
      discount:15,
      used: true
    }

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(()=>{
      return true;
    });

    jest.spyOn(voucherService, "isAmountValidForDiscount").mockReturnValue(true);

    const result =  voucherService.createVoucher(amount, discount);
    expect(result).rejects.toEqual({
      message: "Voucher already exist.",
      type: "conflict"
    });
  }); */
  });