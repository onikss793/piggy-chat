import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const request: Request = context.switchToHttp().getRequest();

      const authorization = request.headers['authorization'];
      if (!authorization) throw new Error('No Authorization in the headers');

      const token = authorization?.replace('Bearer ', '');
      if (!token) throw new Error('No Bearer token');

      const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret');
      if (!payload['userId']) throw new Error('No userId in payload');

      request['userId'] = payload['userId'];
      return true;
    } catch (e) {
      const error = e as Error;
      throw new UnauthorizedException(error.message);
    }
  }
}
