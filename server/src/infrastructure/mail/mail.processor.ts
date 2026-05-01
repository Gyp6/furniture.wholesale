import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { MailService } from '../mail/mail.service';

@Processor('mail_queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private mailService: MailService) {
    super();
  }

  async process(job: Job<{ to: string; subject: string; html: string }>) {
    this.logger.log(`Processing job ${job.id}`);

    const { data } = job;
    await this.mailService._dispatch(data.to, data.subject, data.html);
  }
}
