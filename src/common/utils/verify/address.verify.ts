import { VerifyAddressDto } from "src/wallet/account/dto/create-account.dto";
import { verificationAssress } from "src/wallet/account/swaggerModel/account.model";
const WAValidator = require('wallet-address-validator');
const Web3 = require('web3');
const TronWeb = require('tronweb');

export class VerifyAddress{

  // 可以校验的币种
  private readonly WAValidatorCoinList: Array<String> = ['BTC', 'LTC', 'PPC', 'DOGE', 'BVC', 'FRC', 'PTS', 'MEC', 'XPM', 'AUR', 'NMC', 'BIO']

  /**
   * 地址校验
   */
  async isCoinTypeAddress(verifyAddressDto: VerifyAddressDto): Promise<verificationAssress> {
    let isAddress: Boolean = false
    let coin = verifyAddressDto.coinType && verifyAddressDto.coinType.toUpperCase()
    if(this.WAValidatorCoinList.includes(coin)){
      isAddress = await this.isBtcSeriesAddress(verifyAddressDto.address, coin)
    }else if(coin === 'ETH'){
      isAddress = await this.isETHAddress(verifyAddressDto.address)
    }else if(coin === 'TRX'){
      isAddress = await this.isTronAddress(verifyAddressDto.address)
    }
    return {
      isAddress: isAddress
    }
  }

  // validate (address [, currency = 'bitcoin'[, networkType = 'prod']])
  //地址-要验证的钱包地址。
  //货币-可选。货币名称或符号，例如“bitcoin”（默认）、“litecoin”或“LTC”
  //networkType—可选。使用“prod”（默认值）强制执行标准地址，“testnet”强制执行testnet地址，“both”不强制执行任何内容。
  isBtcSeriesAddress(address: String, coin = "BTC", network = "prod"): Boolean {
    coin = coin && coin.toUpperCase()
    network = network.toLowerCase() == "test" ? "testnet" : "prod"
    return WAValidator.validate(address, coin, network);
  }

  isETHAddress(address: String): Boolean{
    const web3 = new Web3()
    return web3.utils.isAddress(address)
  }

  isTronAddress(address: String): Boolean{
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider("h");
    const tronWeb = new TronWeb(fullNode, fullNode);
    return tronWeb.isAddress(address)
  }

}