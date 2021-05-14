export interface UserDto {

  // 币种类型
  coinType: string;
  // 地址所属协议类型
  contractAddress: string;
  // 币种地址
  address: string;

}

export interface VerifyAddressDto {

  // 币种类型
  coinType: string, 
  // 币种地址
  address: string

}