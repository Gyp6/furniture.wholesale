import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

import { S3_CLIENT } from './s3.constants';

@Injectable()
export class S3Service {
  private readonly endpoint: string;
  private readonly bucket: string;

  constructor(
    @Inject(S3_CLIENT)
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.endpoint = this.configService.getOrThrow('S3_ENDPOINT');
    this.bucket = this.configService.getOrThrow('S3_BUCKET_NAME');
  }

  async getPresignedUploadUrl(
    folder: string,
    mimeType: string,
  ): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
    const key = `${folder}/${nanoid()}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });

    const publicUrl = `${this.endpoint}/${this.bucket}/${key}`;

    return { uploadUrl, publicUrl, key };
  }

  async getPresignedUploadUrlWithKey(
    key: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });

    const publicUrl = `${this.endpoint}/${this.bucket}/${key}`;

    return { uploadUrl, publicUrl, key };
  }
}
