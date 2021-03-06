export interface UserDto {
  // 用户id
  id: string;
  // 币种类型
  coinType: string;
  // 地址所属协议类型
  contractAddress: string;
  // 币种地址
  address: string;


  // XCH
  amount: number;
  fee: number;

}

export interface VerifyAddressDto {

  // 币种类型
  coinType: string, 
  // 币种地址
  address: string

}