import { jest } from "@jest/globals";
import voucherService, { VoucherCreateData } from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";

describe("Voucher Service", () => {
  it("criar vale", async () => {
    const code = "abc123";
    const discount = 70;

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce(() => false);

    jest
      .spyOn(voucherRepository, "createVoucher")
      .mockImplementationOnce((): any => {});

    await voucherService.createVoucher(code, discount);
    expect(voucherRepository.createVoucher).toBeCalled();
  });

  it("voucher já existente", () => {
    const code = "abc123";
    const discount = 70;

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce(() => true);

    const promisse = voucherService.createVoucher(code, discount);
    expect(promisse).rejects.toEqual({
      message: "Voucher already exist.",
      type: "conflict",
    });
  });

  it("Não aplicar para voucher não existente", ()=> {
    const voucher: VoucherCreateData = {
      code: "abc123",
      discount: 50,
      used: false
    }

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(()=> undefined)

    const amount = 150;
    const promisse = voucherService.applyVoucher(voucher.code, amount);
    expect(promisse).rejects.toEqual({
      message: "Voucher does not exist.",
      type: "conflict", 
    })
  })

  it("aplicar voucher", async () => {

    const voucher: VoucherCreateData = {
      code: "abc123",
      discount: 50,
      used: false
    }

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => ({
        id: 1,
        code: voucher.code,
        discount: voucher.discount,
        used: false,
      }));

    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const amount = 100;
    const finalAmount = amount - amount * (voucher.discount / 100);

    const result = await voucherService.applyVoucher(voucher.code, amount);

    expect(result.amount).toBe(amount);
    expect(result.discount).toBe(voucher.discount);
    expect(result.finalAmount).toBe(finalAmount);
    expect(result.applied).toBe(true);
  });

  it("Não aplicar voucher pra compra menor que 100", async () => {

    const voucher: VoucherCreateData = {
      code: "abc123",
      discount: 50,
      used: false
    }

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => ({
        id: 1,
        code: voucher.code,
        discount: voucher.discount,
        used: false,
      }));

    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const amount = 80;
    const finalAmount = amount - amount * (voucher.discount / 100);

    const result = await voucherService.applyVoucher(voucher.code, amount);

    expect(result.amount).toBe(amount);
    expect(result.discount).toBe(voucher.discount);
    expect(result.finalAmount).toBe(amount);
    expect(result.applied).toBe(false);
    
  });

  it("Não aplicar voucher, quando já foi usado", async () => {

    const voucher: VoucherCreateData = {
      code: "abc123",
      discount: 50,
      used: false
    }

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => ({
        id: 1,
        code: voucher.code,
        discount: voucher.discount,
        used: true,
      }));

    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const amount = 100;
    const finalAmount = amount - amount * (voucher.discount / 100);

    const result = await voucherService.applyVoucher(voucher.code, amount);

    expect(result.amount).toBe(amount);
    expect(result.discount).toBe(voucher.discount);
    expect(result.finalAmount).toBe(amount);
    expect(result.applied).toBe(false);
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
