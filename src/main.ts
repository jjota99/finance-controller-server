import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express'
import { Logger } from '@nestjs/common'

async function bootstrap(): Promise<NestExpressApplication> {
   const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
      {
         cors: true,
      },
   )
   const port = 8080
   const logger = new Logger('RunApplication')

   app.setGlobalPrefix('api')
   await app.listen(port)
   logger.log(`Server is running in port: ${port}`)

   return app
}
bootstrap()
