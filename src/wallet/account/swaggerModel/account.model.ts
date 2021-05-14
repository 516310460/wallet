import { ApiProperty } from '@nestjs/swagger';
 
export class Account {
  
  @ApiProperty({
    description: '余额',
  })
  balance: String;

}

export class verificationAssress {
  
  @ApiProperty({
    description: '地址是否正确',
  })
  isAddress: Boolean;

}
