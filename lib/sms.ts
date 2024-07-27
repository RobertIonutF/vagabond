// lib/sms.ts
import twilio from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

export async function sendSMS(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('Twilio credentials not set. SMS will not be sent.');
    return;
  }

  const client = twilio(accountSid, authToken);

  try {
    console.log('Sending SMS to:', to, 'Body:', body, 'From:', fromNumber);

    const message = await client.messages.create({
      body: body,
      from: `+${fromNumber}`, // Adding the '+' back to the number
      to: to.startsWith('+') ? to : `+${to}` // Ensure the 'to' number has a '+'
    });

    const status: MessageInstance["status"] | undefined = message.status;
    if (message.errorMessage) {
      console.error('Failed to send SMS:', message.errorMessage);
      return;
    }

    console.log('SMS sent successfully. SID:', message.sid, 'Status:', status);
  } catch (error) {
    console.error('Failed to send SMS:', error);
    // We don't throw here, as we don't want SMS failure to block appointment creation
  }
}