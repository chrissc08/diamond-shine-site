import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Diamond Touch Detailers'
const SITE_URL = 'https://diamondtouch-detailing.com'

interface BookingCancelledProps {
  customerName?: string
  packageName?: string
  date?: string
  time?: string
  reason?: string
  vacationMessage?: string
}

const BookingCancelledEmail = ({
  customerName,
  packageName,
  date,
  time,
  reason,
  vacationMessage,
}: BookingCancelledProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your {SITE_NAME} appointment has been cancelled</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Appointment Cancelled</Heading>
        <Text style={text}>
          {customerName ? `Hi ${customerName},` : 'Hi,'}
        </Text>
        <Text style={text}>
          We're sorry to let you know that your upcoming appointment with {SITE_NAME} has been cancelled.
        </Text>

        <Section style={card}>
          <Text style={rowText}><span style={rowLabel}>Service: </span>{packageName || '—'}</Text>
          <Text style={rowText}><span style={rowLabel}>Date: </span>{date || '—'}</Text>
          <Text style={rowText}><span style={rowLabel}>Time: </span>{time || '—'}</Text>
        </Section>

        {vacationMessage ? (
          <Section style={noticeCard}>
            <Text style={text}>{vacationMessage}</Text>
          </Section>
        ) : null}

        {reason ? (
          <Section style={card}>
            <Text style={rowText}><span style={rowLabel}>Reason: </span>{reason}</Text>
          </Section>
        ) : null}

        <Text style={text}>
          We sincerely apologize for any inconvenience. We'd love to reschedule you at your convenience —
          just click below to book a new time.
        </Text>

        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Button href={`${SITE_URL}/#booking`} style={button}>
            Rebook Your Detail
          </Button>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Questions? Reply to this email or reach us at diamondtouchdetailers@gmail.com.
          <br />— The {SITE_NAME} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BookingCancelledEmail,
  subject: 'Your appointment has been cancelled',
  displayName: 'Booking cancellation',
  previewData: {
    customerName: 'Jane',
    packageName: 'Signature Reset Detail',
    date: 'Saturday, May 10, 2026',
    time: '12:30 PM',
    reason: 'Equipment maintenance scheduled.',
    vacationMessage: '',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', padding: '20px 0' }
const container = { padding: '20px 25px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0a0a0a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#0a0a0a', lineHeight: '1.6', margin: '0 0 14px' }
const card = { backgroundColor: '#f7f8fa', borderRadius: '8px', padding: '16px 20px', margin: '0 0 16px' }
const noticeCard = { backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '16px 20px', margin: '0 0 16px' }
const rowText = { fontSize: '14px', color: '#0a0a0a', margin: '0 0 6px', lineHeight: '1.5' }
const rowLabel = { color: '#6b7280', fontWeight: 600 }
const button = { backgroundColor: '#0a0a0a', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'inline-block' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0 16px' }
const footer = { fontSize: '12px', color: '#999999', margin: 0, lineHeight: '1.6' }