import { Injectable, Logger, NestMiddleware, Req } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(@Req() req: any, res: any, next: () => void) {
    Logger.log(`Request ${req.method} ${req.baseUrl}`);
    next();
  }
}
