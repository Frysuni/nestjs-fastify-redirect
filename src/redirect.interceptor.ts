import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotImplementedException,
} from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import { FastifyReply } from 'fastify';

@Injectable()
export class RedirectInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const handler = context.getHandler();
    const options = Reflect.getMetadata('fastifyRedirectOptions', handler);
    const result = await firstValueFrom(next.handle());
    if (result && this.isRedirect(result)) {
      response.redirect(result.statusCode, result.url instanceof URL ? result.url.href : result.url);
    } else if (this.isRedirect(options)) {
      response.redirect(options.statusCode, options.url instanceof URL ? options.url.href : options.url);
    } else {
      throw new NotImplementedException();
    }
    return undefined;
  }

  isRedirect(obj: any): boolean {
    if (obj && obj.hasOwnProperty('statusCode') && obj.hasOwnProperty('url')) {
      return true;
    }
    return false;
  }
}
