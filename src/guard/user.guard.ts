import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { IUser } from '../model';
import { models } from '../mongo';

@Injectable()
export class UserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: Request & { userId: ObjectId } = context.switchToHttp().getRequest();

      if (process.env.STAGE === 'local' || undefined) {
        req.userId = (await this.getUserIfLocal()).id;
        return true;
      }

      const authorization = req.get('authorization');
      if (!authorization) throw new Error('No Authorization in the headers');

      const token = authorization?.replace('Bearer ', '');
      if (!token) throw new Error('No Bearer token');

      const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret') as { userId: ObjectId };
      if (!payload?.userId) throw new Error('No userId in payload');

      req.userId = payload.userId;

      return true;
    } catch (e) {
      const error = e as Error;
      throw new UnauthorizedException(error.message);
    }
  }

  private getUserIfLocal = async (): Promise<IUser> => (await models.User.find())[0];
}
