import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

const sendMock = jest.fn();

jest.mock('resend', () => ({
	Resend: jest.fn().mockImplementation(() => ({
		emails: { send: sendMock },
	})),
}));

describe('EmailService', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	async function buildService(configValues: Record<string, unknown>): Promise<EmailService> {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				EmailService,
				{
					provide: ConfigService,
					useValue: { get: jest.fn((key: string, fallback?: unknown) => configValues[key] ?? fallback) },
				},
			],
		}).compile();

		return module.get(EmailService);
	}

	it('logs the reset link and skips sending when RESEND_API_KEY is not configured', async () => {
		const service = await buildService({});

		await expect(
			service.sendPasswordResetEmail('seeker@neihe.app', 'http://localhost:5173/reset-password?token=abc'),
		).resolves.toBeUndefined();

		expect(sendMock).not.toHaveBeenCalled();
	});

	it('sends via Resend when an API key is configured', async () => {
		sendMock.mockResolvedValue({ data: { id: 'email-1' }, error: null });
		const service = await buildService({ RESEND_API_KEY: 'test-key' });

		await service.sendPasswordResetEmail(
			'seeker@neihe.app',
			'http://localhost:5173/reset-password?token=abc',
		);

		expect(sendMock).toHaveBeenCalledWith(
			expect.objectContaining({
				to: 'seeker@neihe.app',
				subject: '重置你的内核密码',
				html: expect.stringContaining('http://localhost:5173/reset-password?token=abc'),
			}),
		);
	});

	it('throws when Resend returns an error', async () => {
		sendMock.mockResolvedValue({ data: null, error: { message: 'invalid domain' } });
		const service = await buildService({ RESEND_API_KEY: 'test-key' });

		await expect(
			service.sendPasswordResetEmail('seeker@neihe.app', 'http://localhost:5173/reset-password?token=abc'),
		).rejects.toThrow('invalid domain');
	});
});
