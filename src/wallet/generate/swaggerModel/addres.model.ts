import { ApiProperty } from '@nestjs/swagger';
 
export class Address {
  
  @ApiProperty({
    description: '币种类型',
  })
  coinType: String;
  @ApiProperty({
    description: '币种类型',
  })
  coinList: Array<any>;
  @ApiProperty({
    description: '根路径',
  })
  path: String;
  @ApiProperty({
    description: '币种地址',
  })
  address: String;

}


export class XCHAddress {
  @ApiProperty({
    description: '币种地址',
  })
  address: String;
}