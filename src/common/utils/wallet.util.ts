import BigNumber from "bignumber.js";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import * as util from "ethereumjs-util";
import * as hdkey from "ethereumjs-wallet/hdkey";
import * as bitcoin from "bitcoinjs-lib";
import { UserDto } from "src/wallet/generate/dto/create-generate.dto";
import { Address } from "src/wallet/generate/swaggerModel/addres.model";
import { ERC20 } from "./abi/ERC20"
import { ERC20Address } from  './contractAddress/ERC20Address'
// import WalletConnectProvider from "@walletconnect/web3-provider";
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const bs58 = require(`bs58`);
const coininfo = require('coininfo') 
const coinkey = require('coinkey')
const fetch = require('node-fetch');
// const url = 'https://api.shasta.trongrid.io/wallet/generateaddress';
// 官方公共节点
const url = 'http://3.225.171.164:8090';

export class WalletUtil {

  private readonly web3HttpProviderURL: string = "http://47.242.155.204:8545"

  /**
   * 补齐64位，不够前面用0补齐
   * @param num 需要处理的数字
   */
  addPreZero(num: Number): String{
    var t = (num+'').length,
    s = '';
    for(var i=0; i<64-t; i++){
      s += '0';
    }
    return s+num;
  }

  
  /**
   * 小数处理
   * @param bigNumber 需要处理的数字
   * @param decimals 精度位数
   */
  convertBigNumberToNormal(bigNumber: BigNumber.Value, decimals = 18): String {
    let result = new BigNumber(bigNumber).dividedBy(new BigNumber(Math.pow(10, decimals)));
    return result.toFixed();
  }

  /**
   * 算法：加
   * @param number1 第一位数字
   * @param number2 第二位数字
   */
   add(number1: BigNumber.Value, number2: BigNumber.Value): String {
    return new BigNumber(number1).plus(new BigNumber(number2)).toFixed(10);
  }

  /**
   * 算法：减
   * @param number1 第一位数字
   * @param number2 第二位数字
   */
   sub(number1: BigNumber.Value, number2: BigNumber.Value): String {//减
    return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(10);
  }

  /**
   * 算法：乘
   * @param number1 第一位数字
   * @param number2 第二位数字
   */
   mul(number1: BigNumber.Value, number2: BigNumber.Value): String {
    return new BigNumber(number1).times(new BigNumber(number2)).toFixed(10);
  }

  /**
   * 算法：除
   * @param number1 第一位数字
   * @param number2 第二位数字
   */
   div(number1: BigNumber.Value, number2: BigNumber.Value): String {
    return new BigNumber(number1).div(new BigNumber(number2)).toFixed(10);
  }

  async init(){
    const web3 = new Web3(new Web3.providers.HttpProvider(this.web3HttpProviderURL));
    return web3;
  }

  /**
   * 获取余额（以太坊的主币）
   * @param address 以太坊的地址
   */
  async getBalance(address: String): Promise<String>{
    const web3 = await this.init()
    const num_str = await web3.eth.getBalance(address);
    const balance = this.convertBigNumberToNormal(num_str)
    return balance
  }

  /**
   * 获取余额（以太坊的代币）
   * @param address 以太坊的地址
   * @param contractAssress 代币的合约地址
   */
  async getContractBalance(address: String, contractAssress: String): Promise<String>{
    const web3 = await this.init()
    const MyContract = await new web3.eth.Contract(ERC20, contractAssress);
    const balance = await MyContract.methods.balanceOf(address).call();
    const num = await MyContract.methods.decimals().call()
    return this.convertBigNumberToNormal(balance, num)
  }

  /**
   * 获取对应以太坊代币的合约地址
   * @param contractName 代币名称
   */
  async getContractAssress(contractName: String): Promise<String>{
    // @ts-ignore：无法被执行的代码的错误
    return ERC20Address[contractName]
  }

  /**
   * 生成地址第二步
   * 将助记词转成seed
   * @param mnemonic 助记词
   */
  async getSeed(mnemonic: string): Promise<Buffer>{
    let seed = await bip39.mnemonicToSeed(mnemonic)
    return seed
  }

  /**
  * BIP44提出了5层的路径建议m / purpose' / coin_type' / account' / change / address_index
  * purporse'固定是44'，代表使用BIP44。
  * coin_type'用来表示不同币种，例如Bitcoin就是0'，Ethereum是60'
  * account'顾名思义，是帐户的意思。从0’开始。可以理解为Bitcoin-QT中的钱包
  * change：找零。一般使用0对外收款，1接受每次交易的找零
  * address_index:位址索引
  * `m/44'/${coinTypeCode}'/${account}'/${change}/${address_index}`
  */

  /**
   * 生成地址第三步
   * 提取私钥，公钥，账户 (ERC20)
   * @param mnemonic 助记词
   */
  async getERC20Account(userDto: UserDto, mnemonic: string): Promise<Address>{
    let seed = await this.getSeed(mnemonic)
    let hdWallet = await hdkey.fromMasterSeed(seed)
    let key = await hdWallet.derivePath(`m/44'/60'/0'/0/${userDto.id}`)
    let address = await util.pubToAddress(key._hdkey._publicKey, true)
    return {
      'coinType': 'ETH',
      'coinList': [Object.keys(ERC20Address)],
      // 'privateKey': util.bufferToHex(key._hdkey._privateKey),
      // 'publicKey': util.bufferToHex(key._hdkey._publicKey),
      'path': `m/44'/60'/0'/0/${userDto.id}`,
      'address': '0x'+address.toString('hex')
    }
  }

  /**
   * 生成地址第三步
   * 提取私钥，公钥，账户 (BTC)
   * @param mnemonic 助记词
   */
  async getBTCAccount(userDto: UserDto, mnemonic: string): Promise<Address>{
    const network = bitcoin.networks.bitcoin
    const seed = await this.getSeed(mnemonic)
    const root = bip32.fromSeed(seed,network)
    const path = `m/44'/0'/0'/0/${userDto.id}`;
    const keyPair = root.derivePath(path)
    const privateKey = keyPair.toWIF()
    const publicKey = keyPair.publicKey.toString("hex")
    let address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey , network:network})
    return {
      'coinType': 'BTC',
      'coinList': ['BTC', 'BCH', 'BSV'],
      // 'privateKey': privateKey,
      // 'publicKey': publicKey,
      'path': `m/44'/0'/0'/0/${userDto.id}`,
      'address': address.address
    }
  }

  /**
   * 生成地址第三步
   * 提取私钥，公钥，账户 (LTC)
   * @param mnemonic 助记词
   */
   async getLTCAccount(userDto: UserDto, mnemonic: string): Promise<Address>{
    const seed = await this.getSeed(mnemonic)
    const coin_type = 2
    const path = `m/44'/${coin_type}'/0'/0/${userDto.id}`;
    const {
      pub,
      pri,
      address
    } = await this.getAddressByPath(coin_type, userDto.id, 'LTC', mnemonic)
    return {
      'coinType': 'LTC',
      'coinList': ['LTC'],
      // 'privateKey': privateKey,
      // 'publicKey': publicKey,
      'path': path,
      'address': address
    }
  }

  async getAddressByPath(coin_type: Number, id: string, coin: String, mnemonic: string) {
    // let network = this.networkType
    // const path = `m/44'/2'/0'/0/${userDto.id}`;
    // m/44'/${coinTypeCode}'/0'/0/${index}
    let {pri, pub, path} = await this.getKeyPair(coin_type, id, '0', '0', mnemonic);
    let {address} = this.privateKeyToAddress(pri, coin)
    return {
      path: path,
      pub: pub.toString("hex"),
      pri: pri.toString("hex"),
      address: address
    }
  }

  /**
   * 通过私钥转地址（LTC）
   * @param publicKey 私钥
   */
  privateKeyToAddress(pri, coin) {
    // network = network || coin
    // let _network = network.toLowerCase() == "test" ? coin + "-" + network : coin
    // let version = coininfo(_network).versions
    let version = coininfo(coin).versions
    let ck = new coinkey(pri, version)
    let pub = ck.publicKey
    let address = ck.publicAddress
    return {
      address: address,
      pub: pub
    };
  }
  
  async getKeyPair(coinTypeCode, index, account = '0', change = '0', mnemonic: string) {
    // const path = `m/44'/2'/0'/0/1`
    const path = `m/44'/${coinTypeCode}'/0'/0/${index}`
    let seed = await bip39.mnemonicToSeedSync(mnemonic)
    let hdWallet = await bip32.fromSeed(seed)
    const child = hdWallet.derivePath(path)
    let pri = child.privateKey //buffer
    let pub = child.publicKey //buffer
    return {path, pri, pub}
  }

  /**
   * 生成地址第三步
   * 提取私钥，公钥，账户 (TRX、TRC20)
   * @param mnemonic 助记词
   */
   async getTRC20Account(userDto: UserDto, mnemonic: string): Promise<Address>{
    const options = {method: 'GET'};
    
    fetch(url + '/wallet/generateaddress', options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error('error:' + err));
      
    let seed = await bip39.mnemonicToSeedSync(mnemonic)
    let hdWallet = await bip32.fromSeed(seed)
    let key = await hdWallet.derivePath(`m/44'/195'/0'/0/${userDto.id}`)
    let { address } = this.getAddressByPublicKey(key.publicKey)
    // console.log(key.privateKey, key.publicKey, address)
    return {
      'coinType': 'TRX',
      'coinList': ['TRX', 'TRC20', 'USDT'],
      'path': `m/44'/195'/0'/0/${userDto.id}`,
      'address': address
    }
  }
  
  /**
   * 通过公钥，获得地址(TRX、TRC20)
   * @param publicKey 公钥
   */
  getAddressByPublicKey(publicKey) {
    let pub = Buffer.from(publicKey, 'hex')
    let address = this.publicKeyToAddress(pub)
    return {address, pub};
  }

  /**
   * 通过公钥转地址(TRX、TRC20)
   * @param publicKey 公钥
   */
  publicKeyToAddress(pubBuff) {
    let addrBuff = util.publicToAddress(pubBuff, true)
    let newBuff = Buffer.from([0x41]);
    let AddressBuff = Buffer.concat([newBuff, addrBuff], 21)
    let h1 = util.sha256(AddressBuff)
    let h2 = util.sha256(h1)

    let checksum = Buffer.alloc(4);
    h2.copy(checksum, 0, 0, checksum.length);

    let trxAddress = Buffer.alloc(AddressBuff.length + checksum.length)
    trxAddress = Buffer.concat([AddressBuff, checksum], trxAddress.length);
    return bs58.encode(trxAddress);
  }

  /**
   * 提取私钥
   * @param mnemonic 助记词
   */
   async getERC20PrivateKey(userDto: UserDto, mnemonic: string): Promise<string>{
    let seed = await this.getSeed(mnemonic)
    //3.通过hdkey将seed生成HD Wallet
    let hdWallet = await hdkey.fromMasterSeed(seed)
    //4.生成钱包中在m/44'/60'/0'/0/i路径的keypair
    let key = await hdWallet.derivePath(`m/44'/60'/0'/0/${userDto.id}`)
    return util.bufferToHex(key._hdkey._privateKey)
  }

  /**
   * 以太币转账
   * 先获取当前账号交易的nonce
   * @param currentAccount 从哪个账号转币
   * @param toAccount 转到那个账号
   * @param PrivateKey 私钥
   */
  async transferAccounts(currentAccount: String, toAccount: String, PrivateKey: string){
    const web3 = await this.init()
    web3.eth.getTransactionCount(currentAccount, web3.eth.defaultBlock.pending).then(function(nonce){
      // 获取交易数据
      var txData = {
          // nonce每次++，以免覆盖之前pending中的交易
          nonce: web3.utils.toHex(nonce++),
          // 设置gasLimit和gasPrice
          gasLimit: web3.utils.toHex(99000),   
          gasPrice: web3.utils.toHex(10e9),  
          // 要转账的哪个账号  
          to: toAccount,
          // 从哪个账号转
          from: currentAccount,
          // 0.001 以太币
          value: web3.utils.toHex(10e14),         
          data: ''
      }
  
      var tx = new Tx(txData);
  
      // 引入私钥，并转换为16进制
      const privateKey = Buffer.from(PrivateKey, 'hex'); 
  
      // 用私钥签署交易
      tx.sign(privateKey);
  
      // 序列化
      var serializedTx = tx.serialize().toString('hex');
  
      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
          if (!err) {
              console.log(hash);
          } else {
              console.error(err);
          }
      });
    });
  }

  /**
   * 代币转账
   * 先获取当前账号交易的nonce
   * @param currentAccount 从哪个账号转币
   * @param contractAddress 注意这里是代币合约地址
   * @param PrivateKey 私钥
   */
  async erc20TransferAccounts(currentAccount: String, contractAddress: String, PrivateKey: string){
    const web3 = await this.init()
    web3.eth.getTransactionCount(currentAccount, web3.eth.defaultBlock.pending).then(function(nonce){
      // 获取交易数据
      var txData = {
          nonce: web3.utils.toHex(nonce++),
          gasLimit: web3.utils.toHex(99000),   
          gasPrice: web3.utils.toHex(10e9),
          // 注意这里是代币合约地址    
          to: contractAddress,
          from: currentAccount,
          // 调用合约转账value这里留空
          value: '0x00',         
          // data的组成，由：0x + 要调用的合约方法的function signature + 要传递的方法参数，每个参数都为64位(对transfer来说，第一个是接收人的地址去掉0x，第二个是代币数量的16进制表示，去掉前面0x，然后补齐为64位)
          data: '0x' + 'a9059cbb' + this.addPreZero('3b11f5CAB8362807273e1680890A802c5F1B15a8') + this.addPreZero(web3.utils.toHex(1000000000000000000).substr(2))
      }
   
      var tx = new Tx(txData);
   
      const privateKey = Buffer.from(PrivateKey, 'hex'); 
   
      tx.sign(privateKey);
   
      var serializedTx = tx.serialize().toString('hex');
   
      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
          if (!err) {
              console.log(hash);
          } else {
              console.error(err);
          }
      });
    });
  }
}