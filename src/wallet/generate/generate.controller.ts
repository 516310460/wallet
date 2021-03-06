import { HttpStatus, Res, Body, Query, Param, Post, Get, Put, Delete, Controller, Bind, ParseIntPipe } from "@nestjs/common";
import { Response } from 'express';
import { GenerateService } from "./generate.service";
import { UserDto } from './dto/create-generate.dto'
import { ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Address, XCHAddress } from "./swaggerModel/addres.model";
// import { Cat } from './Interfaces/cat.interfaces';

@Controller('generate')
@ApiTags('生成/获取')
export class GenerateController {
  constructor(private readonly generate: GenerateService) {}

  @Get()
  @ApiOperation({ summary: '生成/获取地址（BTC、ERC20、TRC20）' })
  @ApiQuery({
    name: 'id',
    description: '这是跟路径id',
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
    type: Address,
  })
  async getAllAccount(@Query() userDto: UserDto, @Res() res: Response) {
    let AllAccount = await this.generate.getAllAccount(userDto)
    res.status(HttpStatus.OK).json(AllAccount);
  }

  @Get("/getXCHgenerateMnemonic")
  @ApiOperation({ summary: '生成助记词（XCH）' })
  @ApiCreatedResponse({ //编写响应的api注解
    status:200,
    description: '响应数据格式',
    type: Address,
  })
  async getXCHgenerateMnemonic(@Query() userDto: UserDto, @Res() res: Response) {
    let AllAccount = await this.generate.getXCHgenerateMnemonic(userDto)
    res.status(HttpStatus.OK).json(AllAccount);
  }

  @Post("/getXCHAddress")
  @ApiOperation({ summary: '生成/获取地址（XCH）' })
  @ApiQuery({
    name: 'id',
    description: '钱包id（wallet_id）',
  })
  @ApiQuery({
    name: 'isCreateAddress',
    description: '是否创建地址(0.为不新建 1.为新建)',
  })
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
    type: XCHAddress,
  })
  async getXCHAccount(@Query() userDto: UserDto, @Res() res: Response) {
    let AllAccount = await this.generate.getXCHAccount(userDto)
    res.status(HttpStatus.OK).json(AllAccount);
  }

}