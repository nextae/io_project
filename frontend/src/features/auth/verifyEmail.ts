import { EmailClient, EmailMessage } from "@azure/communication-email";

export async function sendVerificationEmail(email: string, code: string) {
  if (
    !import.meta.env
      .VITE_DANGEROUS_PUBLICLY_VISIBLE_AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING ||
    !import.meta.env.VITE_AZURE_COMMUNICATION_SERVICES_SENDER_EMAIL
  ) {
    console.info(
      "No connection string for Azure Communication Services, skipping sending verification email"
    );
    console.info("Code: ", code);
    return;
  }

  const client = new EmailClient(
    import.meta.env.VITE_DANGEROUS_PUBLICLY_VISIBLE_AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING
  );
  const message: EmailMessage = {
    sender: import.meta.env.VITE_AZURE_COMMUNICATION_SERVICES_SENDER_EMAIL,
    content: {
      subject: "IO Project: Verify your email address",
      plainText: `Your verification code is: ${code}`,
    },
    recipients: {
      to: [{ email: email }],
    },
  };

  const response = await client.send(message);
}

// generate a 10 digit code
export function generateVerificationCode() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0].toString().padStart(10, "0");
}
