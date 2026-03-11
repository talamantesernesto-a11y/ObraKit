import { describe, it, expect } from 'vitest'
import { generateWaiverEmailHtml } from '@/lib/email/waiver-email-template'

describe('generateWaiverEmailHtml', () => {
  const validParams = {
    claimantName: 'Carlos Martinez',
    gcName: 'ABC Construction',
    projectName: 'Casa Moderna',
    waiverTypeName: 'Conditional Progress Payment',
    amount: '$12,500.00',
    throughDate: '2026-03-15',
  }

  it('generates valid HTML with provided params', () => {
    const html = generateWaiverEmailHtml(validParams)
    expect(html).toContain('Carlos Martinez')
    expect(html).toContain('ABC Construction')
    expect(html).toContain('Casa Moderna')
    expect(html).toContain('$12,500.00')
    expect(html).toContain('2026-03-15')
    expect(html).toContain('<!DOCTYPE html>')
  })

  it('escapes HTML special characters in claimant name', () => {
    const html = generateWaiverEmailHtml({
      ...validParams,
      claimantName: '<script>alert("xss")</script>',
    })
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('escapes HTML special characters in GC name', () => {
    const html = generateWaiverEmailHtml({
      ...validParams,
      gcName: '<img src=x onerror=alert(1)>',
    })
    expect(html).not.toContain('<img src=x')
    expect(html).toContain('&lt;img')
  })

  it('escapes HTML in project name', () => {
    const html = generateWaiverEmailHtml({
      ...validParams,
      projectName: 'Project "A" & <B>',
    })
    expect(html).toContain('&amp;')
    expect(html).toContain('&lt;B&gt;')
    expect(html).toContain('&quot;A&quot;')
  })

  it('escapes ampersands in amount', () => {
    const html = generateWaiverEmailHtml({
      ...validParams,
      amount: '$1,000 & change',
    })
    expect(html).toContain('$1,000 &amp; change')
  })

  it('escapes single quotes', () => {
    const html = generateWaiverEmailHtml({
      ...validParams,
      claimantName: "O'Brien Construction",
    })
    expect(html).toContain('O&#39;Brien')
  })
})
