import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { GenerateModule } from './wallet/generate/generate.module';

import { AccountModule } from './wallet/account/account.module'

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => ({
    //     type: 'mysql',
    //     host: 'localhost',
    //     port: 3306,
    //     username: 'root',
    //     password: 'a2221517',
    //     database: 'wallet',
    //     entities: ['dist/**/*.entity{.ts,.js}'],
    //     synchronize: true,
    //   }),
    //   inject: [ConfigService]
    // }),
    GenerateModule,
    AccountModule
  ],
})
export class AppModule {}