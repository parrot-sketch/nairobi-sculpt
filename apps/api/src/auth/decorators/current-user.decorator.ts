import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CurrentUser decorator extracts `request.user` set by authentication guard
 * Usage: @CurrentUser() user => full user object
 *        @CurrentUser('email') email => user's email
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!data) return user;
    return user ? user[data] : undefined;
  },
);
