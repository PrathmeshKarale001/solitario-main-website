/**
 * Welcome Email — sent to new Solitario customers on sign-up.
 * Delivers their 20% off first-purchase Shopify discount code via Resend.
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface WelcomeEmailParams {
  email: string;
  firstName?: string;
  code: string;
  expiresAt: string; // ISO date string
  percentOff?: number;
}

function formatExpiry(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

function generateWelcomeEmailHTML(params: WelcomeEmailParams): string {
  const firstName = params.firstName || 'there';
  const percent = params.percentOff ?? 20;
  const expiry = formatExpiry(params.expiresAt);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Solitario — Your ${percent}% Off Code</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f0; font-family: 'Georgia', serif; color:#333;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f0; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #146552 0%, #0d4a3a 100%); padding: 48px 40px; text-align: center; border-radius: 16px 16px 0 0;">
                  <p style="margin: 0 0 12px; color: rgba(255,255,255,0.75); font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Welcome to</p>
                  <h1 style="margin: 0; color: #f7f0e4; font-size: 36px; letter-spacing: 2px; font-weight: 400;">SOLITARIO</h1>
                  <p style="margin: 8px 0 0; color: #c8b89a; font-size: 13px; letter-spacing: 1px;">Lab Grown Diamonds &amp; Fine Jewellery</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="background: #ffffff; padding: 48px 40px;">
                  
                  <p style="margin: 0 0 24px; font-size: 17px; color: #333; line-height: 1.7;">
                    Dear ${firstName},
                  </p>
                  
                  <p style="margin: 0 0 24px; font-size: 16px; color: #555; line-height: 1.8;">
                    Welcome to Solitario — where every piece tells a story of elegance and sustainability. 
                    We're thrilled to have you join our community of discerning jewellery lovers.
                  </p>

                  <p style="margin: 0 0 32px; font-size: 16px; color: #555; line-height: 1.8;">
                    To celebrate your arrival, here's a <strong style="color: #146552;">${percent}% discount</strong> on your very first purchase — our gift to you:
                  </p>

                  <!-- Discount Code Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #f7f0e4 0%, #efe6d2 100%); border: 2px dashed #c8b89a; border-radius: 12px; padding: 32px; text-align: center;">
                        <p style="margin: 0 0 8px; color: #888; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Your Exclusive Code</p>
                        <p style="margin: 0 0 16px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #146552; font-family: 'Courier New', monospace;">${params.code}</p>
                        <p style="margin: 0; color: #999; font-size: 13px;">
                          ${percent}% off your entire order &nbsp;·&nbsp; Valid until <strong>${expiry}</strong>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- How to Use -->
                  <div style="background: #f9f9f6; border-left: 4px solid #146552; padding: 20px 24px; border-radius: 0 8px 8px 0; margin-bottom: 36px;">
                    <p style="margin: 0 0 10px; font-size: 14px; font-weight: bold; color: #146552; text-transform: uppercase; letter-spacing: 1px;">How to Redeem</p>
                    <ol style="margin: 0; padding-left: 20px; color: #555; font-size: 14px; line-height: 2;">
                      <li>Browse our collection and add items to your cart</li>
                      <li>Enter <strong style="color: #146552; font-family: monospace;">${params.code}</strong> at checkout</li>
                      <li>Enjoy ${percent}% off your order automatically</li>
                    </ol>
                  </div>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 40px;">
                    <tr>
                      <td align="center">
                        <a href="https://thesolitario.com" 
                           style="display: inline-block; background: linear-gradient(135deg, #146552 0%, #0d4a3a 100%); color: #f7f0e4; text-decoration: none; padding: 18px 48px; border-radius: 50px; font-size: 16px; letter-spacing: 1px; font-family: Arial, sans-serif;">
                          Shop Now →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 8px; font-size: 14px; color: #888; line-height: 1.7;">
                    Terms: This code is valid for one order only, expires on <strong>${expiry}</strong>, and cannot be combined with other offers. Applies to all products.
                  </p>

                  <p style="margin: 32px 0 0; font-size: 16px; color: #555; line-height: 1.8;">
                    With love &amp; sparkle,<br>
                    <strong style="color: #146552;">Team Solitario</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #1a1a1a; padding: 28px 40px; text-align: center; border-radius: 0 0 16px 16px;">
                  <p style="margin: 0 0 8px; color: rgba(255,255,255,0.5); font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Solitario Diamonds</p>
                  <p style="margin: 0 0 12px; color: rgba(255,255,255,0.35); font-size: 11px;">
                    Lab Grown Diamonds &amp; Fine Jewellery · Mumbai, India
                  </p>
                  <p style="margin: 0;">
                    <a href="https://thesolitario.com" style="color: #c8b89a; font-size: 11px; text-decoration: none;">shop.thesolitario.com</a>
                    &nbsp;·&nbsp;
                    <a href="mailto:hello@thesolitario.com" style="color: #c8b89a; font-size: 11px; text-decoration: none;">hello@thesolitario.com</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
}

/**
 * Sends the welcome discount email to a new user via Resend.
 */
export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<void> {
  const percent = params.percentOff ?? 20;
  const firstName = params.firstName || 'there';

  const { error } = await resend.emails.send({
    from: 'Solitario Diamonds <hello@thesolitario.com>',
    to: [params.email],
    subject: `🎁 Welcome, ${firstName}! Your ${percent}% off code is inside`,
    html: generateWelcomeEmailHTML(params),
  });

  if (error) {
    throw new Error(`Resend failed to send welcome email: ${JSON.stringify(error)}`);
  }
}
