import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
	private readonly logger = new Logger(EmailService.name);
	private readonly resend: Resend | null;
	private readonly fromAddress: string;

	constructor(private readonly configService: ConfigService) {
		const apiKey = this.configService.get<string>('RESEND_API_KEY');
		// Falls back to logging the email instead of sending when no key is
		// configured, so the rest of the reset flow stays testable locally
		// without requiring a Resend account.
		this.resend = apiKey ? new Resend(apiKey) : null;
		this.fromAddress = this.configService.get('EMAIL_FROM', '内核 NèiHé <onboarding@resend.dev>');
	}

	async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
		if (!this.resend) {
			this.logger.warn(
				`RESEND_API_KEY is not set — skipping real send. Reset link for ${to}: ${resetUrl}`,
			);
			return;
		}

		const { error } = await this.resend.emails.send({
			from: this.fromAddress,
			to,
			subject: '重置你的内核密码',
			html: `
				<p>点击下面的链接重置你的密码，链接 1 小时内有效：</p>
				<p><a href="${resetUrl}">${resetUrl}</a></p>
				<p>如果这不是你本人的操作，请忽略这封邮件。</p>
			`,
		});

		if (error) {
			this.logger.error({ err: error, to }, 'Failed to send password reset email');
			throw new Error(`Failed to send password reset email: ${error.message}`);
		}
	}
}
