import { HttpStatus, Res, Body, Query, Param, Post, Get, Put, Delete, Controller, Bind, ParseIntPipe } from "@nestjs/common";
import { Response } from 'express';
import { AccountService } from "./account.service";
import { UserDto, VerifyAddressDto } from './dto/create-account.dto'
import { ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Account, verificationAssress } from "./swaggerModel/account.model";
import { ERC20Address } from "src/common/utils/contractAddress/ERC20Address";
import { VerifyAddress } from "src/common/utils/verify/address.verify";
// import { Cat } from './Interfaces/cat.interfaces';

@Controller('account')
@ApiTags('地址关联信息')
export class AccountController {
  constructor(private readonly account: AccountService) {}

  @Post("/getXCHBalance")
  @ApiOperation({ summary: '获取余额（XCH）' })
  // @ApiQuery({
  //   name: 'id',
  //   description: '钱包id',
  // })
  // @ApiQuery({
  //   name: 'crt',
  //   description: '全节点 private_full_node.crt',
  // })
  // @ApiQuery({
  //   name: 'key',
  //   description: '全节点 private_full_node.key',
  // })
  @ApiCreatedResponse({ //编写响应的api注解
    status:200,
    description: '响应数据格式',
    type: Account,
  })
  async getXCHBalance(@Body() userDto: UserDto, @Res() res: Response) {
    let AllAccount = await this.account.getXCHBalance(userDto)
    res.status(HttpStatus.OK).json(AllAccount);
  }

  @Get()
  @ApiOperation({ summary: '获取余额' })
  @ApiQuery({
    name: 'coinType',
    description: `币种类型（大写：${Object.keys(ERC20Address)}）`,
  })
  @ApiQuery({
    name: 'contractAddress',
    required: false,
    description: '地址所属协议类型: 例如：ETH、ERC20 注意：代币或主币类型',
  })
  @ApiQuery({
    name: 'address',
    description: '币种地址',
  })
  // @ApiQuery({
  //   name: 'role',
  //   description: '这是需要传递的参数',
  // })
  // @ApiHeader({
  //   name: 'authoriation',
  //   required: true,
  //   description: '本次请求请带上token',
  // })
  @ApiCreatedResponse({ //编写响应的api注解
    status:200,
    description: '响应数据格式',
    type: Account,
  })
  async getBalance(@Query() userDto: UserDto, @Res() res: Response) {
    let AllAccount = await this.account.getBalance(userDto)
    res.status(HttpStatus.OK).json(AllAccount);
  }

  @Post('/verificationAssress')
  @ApiOperation({ summary: '校验地址（BTC[BCH、BSV], LTC, DOGE, ETH, TRX）' })
  @ApiQuery({
    name: 'address',
    description: '币种地址',
  })
  @ApiQuery({
    name: 'coinType',
    description: '币种类型',
  })
  @ApiCreatedResponse({ //编写响应的api注解
    status:200,
    description: '响应数据格式',
    type: verificationAssress,
  })
  async verificationAssress(@Query() verifyAddressDto: VerifyAddressDto, @Res() res: Response) {
    let isAddress = await new VerifyAddress().isCoinTypeAddress(verifyAddressDto)
    res.status(HttpStatus.OK).json(isAddress);
  }

}