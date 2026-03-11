import { test, expect } from '@playwright/test'

test.describe('WhatsApp webhook API', () => {
  test('GET verification rejects invalid token', async ({ request }) => {
    const res = await request.get('/api/whatsapp/webhook', {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'wrong-token',
        'hub.challenge': 'test-challenge',
      },
    })
    expect(res.status()).toBe(403)
  })

  test('POST rejects non-whatsapp events', async ({ request }) => {
    const res = await request.post('/api/whatsapp/webhook', {
      data: { object: 'not_whatsapp' },
    })
    expect(res.status()).toBe(404)
  })

  test('POST returns 200 for valid whatsapp event structure', async ({ request }) => {
    const res = await request.post('/api/whatsapp/webhook', {
      data: {
        object: 'whatsapp_business_account',
        entry: [],
      },
    })
    expect(res.status()).toBe(200)
    expect(await res.json()).toEqual({ success: true })
  })
})
