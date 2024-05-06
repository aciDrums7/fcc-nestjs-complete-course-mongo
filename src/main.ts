import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from './common/constants/constants';
import { generateOpenAPI } from './common/generators/openapi.generator';

function loadConfig(configService: ConfigService) {
  return {
    env: configService.get<string>('env'),
    port: configService.get<number>('port'),
    apiVersion: configService.get<string>('apiVersion'),
    openapiPath: configService.get<string>('openapiPath'),
    appUrl: configService.get<string>('appUrl'),
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const { port, apiVersion, openapiPath, env, appUrl } =
    loadConfig(configService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.setGlobalPrefix(`api/${apiVersion}`, {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  if (env === ENV.DEV) {
    await generateOpenAPI(app, apiVersion, port, openapiPath);
  }

  await app.listen(port);
  Logger.log(`Application is running on: ${appUrl}`);
}

bootstrap();
