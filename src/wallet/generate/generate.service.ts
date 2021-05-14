import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-generate.dto'
import { Address } from './swaggerModel/addres.model';
import { WalletUtil } from '../../common/utils/wallet.util'

// XCH
import { FullNode } from '../../common/utils/coin/xch/FullNode';
import { Wallet } from '../../common/utils/coin/xch/Wallet';

@Injectable()
export class GenerateService {

  constructor(private readonly walletUtil: WalletUtil) {}
  
  private readonly mnemonic: string = 'hold scale hybrid tank dilemma bullet ship language attitude rug tennis host';

  async getAllAccount(userDto: UserDto): Promise<Address[]>{
    // // const seed = await this.walletUtil.getSeed(this.mnemonic)
    // // 以太币转账
    // // 先获取当前账号交易的nonce
    // const privateKey = await this.walletUtil.getERC20PrivateKey(userDto, this.mnemonic)
    // // @param currentAccount 从哪个账号转币
    // // @param toAccount 转到那个账号
    // this.walletUtil.transferAccounts("0x753e971531e2ac3BaC571E48212704b2aB013c52", "0x01177c640bf0b0db7b120d27fbb271ee016045aa", privateKey)
    // /**
    //  * 代币转账
    //  * @param currentAccount 从哪个账号转币
    //  * @param contractAddress 注意这里是代币合约地址
    //  */
    // this.walletUtil.erc20TransferAccounts('0x753e971531e2ac3BaC571E48212704b2aB013c52', await this.walletUtil.getContractAssress('USDT'), privateKey)
    return [
      await this.walletUtil.getERC20Account(userDto, this.mnemonic),
      await this.walletUtil.getBTCAccount(userDto, this.mnemonic),
      await this.walletUtil.getTRC20Account(userDto, this.mnemonic),
      await this.walletUtil.getLTCAccount(userDto, this.mnemonic),
    ]
  }

  async getXCHAccount(userDto: UserDto): Promise<string>{
    const wallet = new Wallet({
      protocol: 'http',
      hostname: 'localhost',
      port: 9256
    });
  
    let address = await wallet.getNextAddress(userDto.id);

    return address
  }


}
