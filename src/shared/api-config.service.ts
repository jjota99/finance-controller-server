import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ApiConfigService {
   constructor(private configService: ConfigService) {}

   private getNumber(key: string, defaultValue?: number): number {
      const value = this.configService.get(key, defaultValue)
      if (value === undefined) {
         throw new Error(key + 'env var not set')
      }
      return Number(value)
   }

   private getString(key: string, defaultValue?: string): string {
      const value = this.configService.get(key, defaultValue)
      if (value === undefined) {
         throw new Error(key + 'env var not set')
      }
      return value.toString().replace(/\\n/g, '\n')
   }

   get createTypeOrmConfig(): TypeOrmModuleOptions {
      const entities = [__dirname + '/../modules/**/*.entity{.ts,.js}']
      const migrations = [__dirname + '/../db/migrations/*{.ts,.js}']

      return {
         entities: entities,
         migrations: migrations,
         type: 'postgres',
         host: this.getString('DB_HOST', 'localhost'),
         port: this.getNumber('DB_PORT', 5432),
         username: this.getString('DB_USERNAME', 'financial_admin'),
         password: this.getString('DB_PASSWORD', 'financial_admin'),
         database: this.getString('DB_NAME', 'financial_controller'),
         synchronize: true,
      }
   }
}
