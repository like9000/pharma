import { AppError } from '../utils/errors.js';

export type CloudflareDnsRecord = {
  type: 'A' | 'CNAME';
  name: string;
  content: string;
  proxied?: boolean;
};

export interface CloudflareCredentials {
  apiToken: string;
  accountId: string;
}

export class CloudflareClient {
  constructor(private readonly creds: CloudflareCredentials) {}

  private get headers() {
    return {
      Authorization: `Bearer ${this.creds.apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  async ensureDnsRecords(domain: string, records: CloudflareDnsRecord[]) {
    if (!this.creds.apiToken) {
      throw new AppError('Cloudflare API token missing', 'CLOUDFLARE_TOKEN_MISSING');
    }
    const baseUrl = `https://api.cloudflare.com/client/v4/zones`;
    const zone = await this.findZone(domain);
    if (!zone) {
      throw new AppError(`Zone ${domain} introuvable`, 'CLOUDFLARE_ZONE_NOT_FOUND');
    }
    for (const record of records) {
      await this.upsertRecord(zone.id, record);
    }
  }

  private async findZone(domain: string): Promise<{ id: string; name: string } | null> {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(domain)}`,
      {
        headers: this.headers,
      },
    );
    if (!res.ok) {
      throw new AppError('Cloudflare zones fetch failed', 'CLOUDFLARE_FETCH_FAILED');
    }
    const json = (await res.json()) as { result: { id: string; name: string }[] };
    return json.result.at(0) ?? null;
  }

  private async upsertRecord(zoneId: string, record: CloudflareDnsRecord) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(record),
      },
    );
    if (!res.ok) {
      throw new AppError('Cloudflare DNS upsert failed', 'CLOUDFLARE_DNS_FAILED');
    }
  }
}
