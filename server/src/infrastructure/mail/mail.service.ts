import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Resend } from 'resend';

import type { IMailOptions } from '@/shared/types';

import { resetPasswordTemplate, verifyEmailTemplate } from './templates';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject('MAIL_OPTIONS') private readonly options: IMailOptions,
    @InjectQueue('mail_queue') private readonly mailQueue: Queue,
  ) {
    this.resend = new Resend(options.apiKey);
  }

  async sendVerifyEmail(to: string, code: string) {
    const { subject, html } = verifyEmailTemplate(code);
    return this.enqueue(to, subject, html);
  }

  async sendResetPassword(to: string, url: string) {
    const { subject, html } = resetPasswordTemplate(url);
    return this.enqueue(to, subject, html);
  }

  async _dispatch(to: string, subject: string, html: string) {
    const from =
      process.env.NODE_ENV === 'development'
        ? 'onboarding@resend.dev'
        : this.options.from || '';
    const recipient =
      process.env.NODE_ENV === 'development' ? 'yanbellq@gmail.com' : to;

    const { data, error } = await this.resend.emails.send({
      from,
      to: recipient,
      subject,
      html,
    });

    if (error) {
      this.logger.error(`Resend error: ${JSON.stringify(error)}`);
      throw new Error(error.message);
    }

    this.logger.log(`Email sent to ${to}`);
    return data;
  }

  private async enqueue(to: string, subject: string, html: string) {
    await this.mailQueue.add('send_mail', { to, subject, html });
  }
}
