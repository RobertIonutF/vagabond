// lib/sms.ts
import twilio from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

function validateEnvVariables() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('Twilio credentials not set. SMS will not be sent.');
    return null;
  }

  return { accountSid, authToken, fromNumber };
}

function logMessage(level: 'info' | 'warn' | 'error', message: string, ...args: any[]) {
  console[level](message, ...args);
}

export async function sendSMS(to: string, body: string) {
  const envVars = validateEnvVariables();
  if (!envVars) return;

  const { accountSid, authToken, fromNumber } = envVars;
  const client = twilio(accountSid, authToken);

  try {
    logMessage('info', 'Sending SMS to:', to, 'Body:', body, 'From:', fromNumber);

    const message = await client.messages.create({
      body: body,
      from: `+${fromNumber}`, // Adding the '+' back to the number
      to: to.startsWith('+') ? to : `+${to}` // Ensure the 'to' number has a '+'
    });

    const status: MessageInstance["status"] | undefined = message.status;
    if (message.errorMessage) {
      logMessage('error', 'Failed to send SMS:', message.errorMessage);
      return;
    }

    logMessage('info', 'SMS sent successfully. SID:', message.sid, 'Status:', status);
  } catch (error) {
    logMessage('error', 'Failed to send SMS:', error);
    // We don't throw here, as we don't want SMS failure to block appointment creation
  }
}