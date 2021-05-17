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
@ApiTags('账户')
export class AccountController {
  constructor(private readonly account: AccountService) {}

  @Post("/getXCHBalance")
  @ApiOperation({ summary: '获取余额（XCH）' })
  @ApiQuery({
    name: 'id',
    description: '钱包id（wallet_id）',
  })
  // @ApiCreatedResponse({ //编写响应的api注解
  //   status:200,
  //   description: '响应数据格式',
  //   type: Account,
  // })
  async getXCHBalance(@Query() userDto: UserDto, @Res() res: Response) {
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


  @Post("/send_XCH_transaction")
  @ApiOperation({ summary: '转账（XCH）' })
  @ApiQuery({
    name: 'id',
    description: '钱包id（wallet_id）',
  })
  @ApiQuery({
    name: 'amount',
    description: '数量',
  })
  @ApiQuery({
    name: 'address',
    description: '地址',
  })
  @ApiQuery({
    name: 'fee',
    description: '手续费',
  })
  // @ApiCreatedResponse({ //编写响应的api注解
  //   status:200,
  //   description: '响应数据格式',
  //   type: Account,
  // })
  async send_XCH_transaction(@Query() userDto: UserDto, @Res() res: Response) {
    let AllAccount = await this.account.send_XCH_transaction(userDto)
    res.status(HttpStatus.OK).json(AllAccount);
  }

  @Get("/get_XCH_Wallets")
  @ApiOperation({ summary: '获取所有钱包列表及信息（XCH）' })
  async get_XCH_Wallets(@Query() userDto: UserDto, @Res() res: Response) {
    let AllAccount = await this.account.get_XCH_Wallets(userDto)
    res.status(HttpStatus.OK).json(AllAccount);
  }
  
  @Get("/get_XCH_Transactions")
  @ApiOperation({ summary: '获取交易记录（XCH）' })
  @ApiQuery({
    name: 'id',
    description: '钱包id（wallet_id）',
  })
  async get_XCH_Transactions(@Query() userDto: UserDto, @Res() res: Response) {
    let AllAccount = await this.account.get_XCH_Transactions(userDto)
    res.status(HttpStatus.OK).json(AllAccount);
  }

}