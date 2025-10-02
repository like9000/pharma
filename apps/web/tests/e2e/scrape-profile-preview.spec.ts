import { expect, test } from '@playwright/test';

const DEFAULT_PROFILE_ID = process.env.E2E_SCRAPE_PROFILE_ID ?? 'seeded-profile-id';

test.describe('Scrape profile preview API', () => {
  test('returns mocked extraction for mock:// urls', async ({ request }) => {
    test.skip(DEFAULT_PROFILE_ID === 'seeded-profile-id', 'Set E2E_SCRAPE_PROFILE_ID to run this test against a real DB.');
    const response = await request.post(
      `/api/settings/scrape-profiles/${DEFAULT_PROFILE_ID}/test`,
      {
        data: { url: 'mock://sample' },
      },
    );
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.extracted.images.length).toBeGreaterThan(0);
  });
});
