import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SharedModule } from './shared/shared.module'
import { ApiConfigService } from './shared/api-config.service'
import { TransactionsModule } from './modules/transactions/transactions.module'

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
      TypeOrmModule.forRootAsync({
         imports: [SharedModule],
         useFactory: (apiConfigService: ApiConfigService) =>
            apiConfigService.createTypeOrmConfig,
         inject: [ApiConfigService],
      }),
      TransactionsModule,
   ],
   controllers: [],
   providers: [],
})
export class AppModule {}
