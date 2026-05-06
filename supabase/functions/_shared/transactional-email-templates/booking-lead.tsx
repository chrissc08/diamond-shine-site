import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Diamond Touch Detailers'

interface AddOnItem {
  name: string
  price?: string
}

interface BookingLeadProps {
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  address?: string
  vehicleType?: string
  packageName?: string
  packagePrice?: string
  packageDuration?: string
  date?: string
  time?: string
  addOns?: AddOnItem[]
  notes?: string
  referral?: string
  submittedAt?: string
}

const BookingLeadEmail = ({
  customerName,
  customerPhone,
  customerEmail,
  address,
  vehicleType,
  packageName,
  packagePrice,
  packageDuration,
  date,
  time,
  addOns,
  notes,
  referral,
  submittedAt,
}: BookingLeadProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New booking request from {customerName || 'a customer'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Booking Request</Heading>
        <Text style={subtitle}>
          A new lead came in through {SITE_NAME}.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>Customer</Heading>
          <Row label="Name" value={customerName} />
          <Row label="Phone" value={customerPhone} />
          <Row label="Email" value={customerEmail} />
          <Row label="Address" value={address} />
          <Row label="Vehicle" value={vehicleType} />
          {referral ? <Row label="Referred by" value={referral} /> : null}
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>Service</Heading>
          <Row label="Package" value={packageName} />
          <Row label="Price" value={packagePrice} />
          <Row label="Duration" value={packageDuration} />
          <Row label="Date" value={date} />
          <Row label="Time" value={time} />
        </Section>

        {addOns && addOns.length > 0 ? (
          <Section style={card}>
            <Heading as="h2" style={h2}>Add-Ons</Heading>
            {addOns.map((a, i) => (
              <Row key={i} label={a.name} value={a.price || ''} />
            ))}
          </Section>
        ) : null}

        {notes ? (
          <Section style={card}>
            <Heading as="h2" style={h2}>Customer Notes</Heading>
            <Text style={text}>{notes}</Text>
          </Section>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          Submitted {submittedAt || 'just now'} • Final quote depends on vehicle condition.
          Reach out to the customer to confirm.
        </Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value }: { label: string; value?: string }) => (
  <Text style={rowText}>
    <span style={rowLabel}>{label}: </span>
    <span style={rowValue}>{value || '—'}</span>
  </Text>
)

export const template = {
  component: BookingLeadEmail,
  subject: (data: Record<string, any>) =>
    `New Booking: ${data.customerName || 'Customer'} — ${data.packageName || 'Detail'}`,
  displayName: 'Booking lead',
  previewData: {
    customerName: 'Jane Smith',
    customerPhone: '(845) 555-0123',
    customerEmail: 'jane@example.com',
    address: '123 Main St, Middletown, NY',
    vehicleType: 'SUV',
    packageName: 'Signature Reset Detail',
    packagePrice: '$180–230',
    packageDuration: '3–4 hours',
    date: 'Saturday, May 10, 2026',
    time: '9:00 AM',
    addOns: [{ name: 'Pet Hair Removal', price: '$25–75' }],
    notes: 'Heavy pet hair in the back seat.',
    referral: '',
    submittedAt: 'May 6, 2026 at 2:14 PM',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', padding: '20px 0' }
const container = { padding: '20px 25px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0a0a0a', margin: '0 0 8px' }
const h2 = { fontSize: '14px', fontWeight: 'bold', color: '#0a0a0a', margin: '0 0 12px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const subtitle = { fontSize: '14px', color: '#55575d', margin: '0 0 24px' }
const card = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '18px 20px', margin: '0 0 16px' }
const rowText = { fontSize: '14px', color: '#0a0a0a', margin: '0 0 6px', lineHeight: '1.5' }
const rowLabel = { color: '#6b7280', fontWeight: 600 }
const rowValue = { color: '#0a0a0a' }
const text = { fontSize: '14px', color: '#0a0a0a', lineHeight: '1.5', margin: 0 }
const hr = { borderColor: '#e5e7eb', margin: '24px 0 16px' }
const footer = { fontSize: '12px', color: '#999999', margin: 0 }