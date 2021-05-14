import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { WalletUtil } from '../../common/utils/wallet.util'

@Module({
  controllers: [GenerateController],
  providers: [GenerateService, WalletUtil],
})
export class GenerateModule {}