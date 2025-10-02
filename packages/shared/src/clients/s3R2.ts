import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AppError } from '../utils/errors.js';

export interface R2Config {
  accessKeyId: string;
  secretAccessKey: string;
  accountId?: string;
  bucket: string;
  publicBaseUrl: string;
  endpoint?: string;
  region?: string;
}

export class R2Client {
  private client: S3Client;

  constructor(private readonly config: R2Config) {
    if (!config.accessKeyId || !config.secretAccessKey || !config.bucket || !config.publicBaseUrl) {
      throw new AppError('R2 configuration incomplete', 'R2_CONFIG_INCOMPLETE');
    }
    this.client = new S3Client({
      region: config.region ?? 'auto',
      endpoint: config.endpoint ?? `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async mirrorImage(key: string, body: Buffer | Uint8Array | string, contentType: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: 'public-read',
      }),
    );
    return `${this.config.publicBaseUrl.replace(/\/$/, '')}/${key}`;
  }
}
