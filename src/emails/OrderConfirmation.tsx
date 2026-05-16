import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export const OrderConfirmationEmail = ({
  customerName = "Customer",
  orderId = "WU-XXXXXXXX",
  totalAmount = 0,
  items = [],
}: OrderConfirmationEmailProps) => {
  const previewText = `Your WearUp Order ${orderId} is confirmed!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>WEARUP</Text>
          </Section>

          <Section style={bodySection}>
            <Heading style={h1}>Order Confirmed</Heading>
            <Text style={text}>
              Hey {customerName},
            </Text>
            <Text style={text}>
              Thanks for gearing up with us. We've received your order and are getting it ready to be shipped. 
              Below are the details of your purchase.
            </Text>

            <Section style={orderInfo}>
              <Text style={orderIdText}>Order ID: <strong>{orderId}</strong></Text>
            </Section>

            <Hr style={hr} />

            <Section>
              <Heading as="h3" style={h3}>Order Summary</Heading>
              {items.map((item, index) => (
                <div key={index} style={itemRow}>
                  <Text style={itemName}>{item.name} x{item.quantity}</Text>
                  <Text style={itemPrice}>₹{item.price}</Text>
                </div>
              ))}
            </Section>

            <Hr style={hr} />

            <Section style={totalSection}>
              <Text style={totalLabel}>Total</Text>
              <Text style={totalValue}>₹{totalAmount}</Text>
            </Section>

            <Section style={buttonContainer}>
              <Link href="https://wearupindia.com/shop" style={button}>
                CONTINUE SHOPPING
              </Link>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Need help? Reply to this email or contact us at info@wearupindia.com
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} WearUp India. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden',
};

const header = {
  backgroundColor: '#050505',
  padding: '32px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  letterSpacing: '4px',
  margin: '0',
};

const bodySection = {
  padding: '32px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
};

const h3 = {
  color: '#555',
  fontSize: '18px',
  fontWeight: 'bold',
  marginTop: '0',
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const orderInfo = {
  backgroundColor: '#f9f9f9',
  padding: '16px',
  borderRadius: '4px',
  marginBottom: '24px',
};

const orderIdText = {
  color: '#333',
  fontSize: '16px',
  margin: '0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '24px 0',
};

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
};

const itemName = {
  color: '#555',
  fontSize: '15px',
  margin: '0',
};

const itemPrice = {
  color: '#333',
  fontSize: '15px',
  fontWeight: 'bold',
  margin: '0',
};

const totalSection = {
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#f9f9f9',
  padding: '16px',
  borderRadius: '4px',
};

const totalLabel = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const totalValue = {
  color: '#e8161b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const button = {
  backgroundColor: '#e8161b',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  letterSpacing: '2px',
};

const footer = {
  padding: '0 32px',
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '8px 0',
};

export default OrderConfirmationEmail;
