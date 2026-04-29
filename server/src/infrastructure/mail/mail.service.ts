import { Inject, Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

import type { IMailOptions } from '@/shared/types';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(@Inject('MAIL_OPTIONS') private options: IMailOptions) {
    this.resend = new Resend(options.apiKey);
  }

  async send(to: string, subject: string, html: string) {
    const from = this.options.from || 'onboarding@resend.dev';

    try {
      const { data, error } = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Resend error: ${JSON.stringify(error)}`);
        throw new Error(error.message);
      }

      this.logger.log(
        `Email sent successfully to ${to} with data: ${JSON.stringify(data)}`,
      );
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to send email: ${message}`);
      throw err;
    }
  }

  // async send(to: string, subject: string, html: string) {
  //   // const from = this.options.from || 'Gyp6.sale <noreply@gyp6.sale>';
  //   const from = 'onboarding@resend.dev';
  //   return await this.resend.emails.send({ from, to, subject, html });
  // }
}
