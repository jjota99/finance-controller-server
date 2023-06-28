import { ApiConfigService } from './api-config.service'
import { Global, Module } from '@nestjs/common'

const providers = [ApiConfigService]

@Global()
@Module({ providers, exports: [...providers] })
export class SharedModule {}
