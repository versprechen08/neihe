import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedUser } from '../../modules/auth/jwt.strategy';

// Exported standalone so the extraction logic can be unit-tested without
// going through Nest's param-decorator metadata machinery.
export function extractCurrentUser(ctx: ExecutionContext): AuthenticatedUser {
	const request = ctx.switchToHttp().getRequest();
	return request.user;
}

export const CurrentUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext) => extractCurrentUser(ctx),
);
