import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { WalletUtil } from '../../common/utils/wallet.util'

@Module({
  controllers: [AccountController],
  providers: [AccountService, WalletUtil],
})
export class AccountModule {}