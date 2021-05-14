import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// api文档插件
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

import { logger } from './common/middleware/logger.middleware';

// const port = 8080
const host = '0.0.0.0'
const port = 9911

async function bootstrap() {
  // Logger.log('--------- 服务启动 -------------')
  // 设置 cors 允许跨域访问
  const app = await NestFactory.create(AppModule, { cors: true });

  // app.use(logger)
  // web 漏洞, 中间件日志
  app.use(helmet())
  
  // 设置角色验证器
  // 访问频率限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000 // 限制15分钟内最多只能访问1000次
    }),
  )

  // 设置所有 api 访问前缀
  app.setGlobalPrefix('/api')

  // 接口文档 swagger 参数
  const options = new DocumentBuilder().setTitle('钱包管理').setDescription(`http://localhost:${port}/api-json`).setVersion('1.0.0').addBearerAuth().build()
  const document = SwaggerModule.createDocument(app, options)
  // 设置 swagger 网址
  SwaggerModule.setup('/api', app, document)

  // 自动验证（以后等系统完善后可自定义）
  // 注册并配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      forbidUnknownValues: true
    }),
  )

  await app.listen(port, host);

  Logger.log(`http://localhost:${port}`, '服务启动成功')
}
bootstrap();
