import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-account.dto'
import { Account, verificationAssress } from './swaggerModel/account.model';
import { WalletUtil } from '../../common/utils/wallet.util'
import { Wallet } from '../../common/utils/coin/xch/Wallet';
import { WalletBalance } from 'src/common/utils/coin/xch/types/Wallet/WalletBalance';
const TronWeb = require('tronweb')

@Injectable()
export class AccountService {
  constructor(private readonly walletUtil: WalletUtil) {}
  // private readonly generates: GenerateAddress[] = [];

  /**
   * 获取币种余额（XCH）
   */
  async getXCHBalance(userDto: UserDto): Promise<WalletBalance>{
    const wallet = new Wallet({
      certPath: "/home/xch/private_wallet.crt",
      keyPath: "/home/xch/private_wallet.key",
    });
    const Balance = await wallet.getWalletBalance(userDto.id)
    return Balance
  }

  /**
   * 获取币种余额
   */
  async getBalance(userDto: UserDto): Promise<Account>{
    let balance: String
    // TronWeb
    // const tronWeb = new TronWeb(fullNode, solidityNode);
    const tronWeb = await new TronWeb({
      fullHost: 'https://api.trongrid.io',
      privateKey: "3d84c921a7df6b5be0d67a9a330bc66993474c01e00852fc2c7537961c457af0"
    })
    const TRXaddress = tronWeb.address.fromPrivateKey("3d84c921a7df6b5be0d67a9a330bc66993474c01e00852fc2c7537961c457af0")
    console.log(TRXaddress)
    const userBalance = await tronWeb.trx.getBalance(TRXaddress);
    console.log(`余额: ${ userBalance }`);
    // console.log(await this.walletUtil.isETHAddress(userDto.address))
    if(userDto.coinType == 'ETH'){
      balance = await this.walletUtil.getBalance(userDto.address)
    }else if(userDto.contractAddress == 'ERC20'){
      // ETH 代币
      balance = await this.walletUtil.getContractBalance(userDto.address, await this.walletUtil.getContractAssress('USDT'))
    }else if(userDto.contractAddress == 'BTC'){
      // BTC
      // balance = await this.walletUtil.getBTCBalance(userDto.address)
    }
    return {
      balance: balance
    }
  }

  // 获得代币名称myContract.methods.name().call({from: currentAccount}, function(error, result){if(!error) {console.log(result);} else {console.log(error);}});
  // 获取代币符号myContract.methods.symbol().call({from: currentAccount}, function(error, result){if(!error) {console.log(result);} else {console.log(error);}});
  // 获取代币总量myContract.methods.totalSupply().call({from: currentAccount}, function(error, result){if(!error) {console.log(result);} else {console.log(error);}});
  // 查看某个账号允许另一个账号可使用的代币数量myContract.methods.allowance(sender, spender).call({from: currentAccount}, function(error, result){if(!error) {console.log(result);} else {console.log(error);}});

  // 在私链上转账
  // 以太币转账web3.eth.sendTransaction({from: currentAccount,to: receiverAccount,value: '1000000000000000'}).then(function(receipt){console.log(receipt);});// 代币转账myContract.methods.transfer(to, amount).send({from: currentAccount}), function(error, transactionHash){if(!error) {console.log('transactionHash is ' + transactionHash);} else {console.log(error);}});

  // 在公链上转账
  // ETH 转账

  // ETH（代币） 转账
  // 补齐64位，不够前面用0补齐function addPreZero(num){var t = (num+'').length,s = '';for(var i=0; i<64-t; i++){s += '0';}return s+num;}web3.eth.getTransactionCount(currentAccount, web3.eth.defaultBlock.pending).then(function(nonce){// 获取交易数据var txData = {nonce: web3.utils.toHex(nonce++),gasLimit: web3.utils.toHex(99000),gasPrice: web3.utils.toHex(10e9),// 注意这里是代币合约地址    to: contractAddress,from: currentAccount,// 调用合约转账value这里留空value: '0x00',// data的组成，由：0x + 要调用的合约方法的function signature + 要传递的方法参数，每个参数都为64位(对transfer来说，第一个是接收人的地址去掉0x，第二个是代币数量的16进制表示，去掉前面0x，然后补齐为64位)data: '0x' + 'a9059cbb' + addPreZero('3b11f5CAB8362807273e1680890A802c5F1B15a8') + addPreZero(web3.utils.toHex(1000000000000000000).substr(2))}var tx = new Tx(txData);const privateKey = new Buffer('your account privateKey', 'hex');tx.sign(privateKey);var serializedTx = tx.serialize().toString('hex');web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {if (!err) {console.log(hash);} else {console.error(err);}});});

  /**
   * ETH ERC20 币种签名
   * @param privateKey 私钥
   * @param nonce 记录发起交易的账户已执行交易总数
   * @param currentAccount 助记词
   * @param contractAddress 该交易被送往的地址（调用的合约地址或转账对方的账户地址）
   * @param gasPrice 该交易每单位gas的价格，Gas价格目前以Gwei为单位（即10^9wei），其范围是大于0.1Gwei，可进行灵活设置
   * @param gasLimit 该交易支付的最高gas上限。该上限能确保在出现交易执行问题（比如陷入无限循环）之时，交易账户不会耗尽所有资金。一旦交易执行完毕，剩余所有gas会返还至交易账户。
   * @param privateKey 
   */
//   async ethereumErc20CoinSign(
//     privateKey, 
//     nonce, 
//     currentAccount,  
//     contractAddress, 
//     toAddress,  
//     gasPrice,  
//     gasLimit, 
//     totalAmount, 
//     decimal
//   ) {
//     if(!privateKey && !nonce && !currentAccount && !contractAddress && !toAddress  && !gasPrice && !gasLimit && !totalAmount && !decimal) {
//         console.log("one of param is null, please give a valid param");
//         return constant.paramsErr;
//     }
//     var transactionNonce = parseInt(nonce).toString(16);
//     var gasLimits = parseInt(gasLimit).toString(16);
//     var gasPrices = parseFloat(gasPrice).toString(16);
//     var txboPrice = parseFloat(totalAmount*(10**decimal)).toString(16)
//     var txData = {
//         nonce: '0x'+ transactionNonce,
//         // 该交易支付的最高gas上限。该上限能确保在出现交易执行问题（比如陷入无限循环）之时，交易账户不会耗尽所有资金。一旦交易执行完毕，剩余所有gas会返还至交易账户。
//         gasLimit: '0x' + gasLimits,
//         gasPrice: '0x' +gasPrices,
//         to: contractAddress,
//         from: currentAccount,
//         value: '0x00',
//         // 若该交易是以太币交易，则data为空；若是部署合约，则data为合约的bytecode；若是合约调用，则需要从合约ABI中获取函数签名，并取函数签名hash值前4字节与所有参数的编码方式值进行拼接而成，具体参见文章https://github.com/linjie-1/guigulive-operation/wiki/Ethereum%E7%9A%84%E5%90%88%E7%BA%A6ABI%E6%8B%93%E5%B1%95
//         data: '0x' + 'a9059cbb' + addPreZero(toAddress.substr(2)) + addPreZero(txboPrice)
//     }
//     // 用私钥签名交易信息
//     var tx = new transaction(txData);
//     const privateKey1 = new Buffer(privateKey, 'hex');
//     tx.sign(privateKey1);
//     var serializedTx = tx.serialize().toString('hex');
//     return '0x'+serializedTx;
// } ;

}
