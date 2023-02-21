import { UseInterceptors, SetMetadata } from '@nestjs/common';
import { RedirectInterceptor } from './redirect.interceptor';

export interface RedirectOptions {
  url: string | URL;
  statusCode: number;
}

export const Redirect = (options?: RedirectOptions) => {
  return (target: any, propertyKey: any, descriptor: any) => {
    if (options) {
      SetMetadata('fastifyRedirectOptions', options)(target, propertyKey, descriptor);
    }
    UseInterceptors(RedirectInterceptor)(target, propertyKey, descriptor);
  };
};
