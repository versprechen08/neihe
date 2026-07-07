import { ExecutionContext } from '@nestjs/common';
import { extractCurrentUser } from './current-user.decorator';

describe('extractCurrentUser', () => {
	it('returns request.user attached by the JWT guard', () => {
		const user = { id: 'user-1', email: 'seeker@neihe.app' };
		const ctx = {
			switchToHttp: () => ({
				getRequest: () => ({ user }),
			}),
		} as unknown as ExecutionContext;

		expect(extractCurrentUser(ctx)).toBe(user);
	});
});
