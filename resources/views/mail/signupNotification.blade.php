<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Raymoch Notification</title>
</head>

<body style="margin:0;padding:0;background:#1A267A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#1A267A;">
    <tr>
      <td align="center" style="padding:28px 14px;">

        <table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0"
          style="width:100%;max-width:680px;border-radius:18px;overflow:hidden;">

          <!-- HERO (matches your blue theme) -->
          <tr>
            <td style="
              background:#293696;
              background-image:linear-gradient(135deg,#313EAE 0%, #293696 45%, #1A267A 100%);
              padding:30px 26px;
            ">
              <div style="font-family:Arial,Helvetica,sans-serif;color:#fff;">
                <div style="font-size:34px;line-height:1.1;font-weight:900;">
                  Redefining African Potential
                </div>
                <div style="margin-top:12px;font-size:15px;line-height:1.7;color:rgba(255,255,255,.92);max-width:560px;">
                  At Raymoch, we connect investors and entrepreneurs through trust, verified data, and actionable insights.
                </div>
              </div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="
              background:#1A267A;
              background-image:linear-gradient(180deg,#293696 0%, #1A267A 65%, #0F1A5E 100%);
              padding:18px 20px 22px 20px;
            ">

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.14);border-radius:16px;">
                <tr>
                  <td style="padding:18px 16px;">

                    <div style="font-family:Arial,Helvetica,sans-serif;color:rgba(255,255,255,.92);font-size:14px;line-height:1.6;">
                      Hi <strong style="color:#fff;">{{ $name }}</strong>,
                    </div>

                    <div style="margin-top:10px;font-family:Arial,Helvetica,sans-serif;color:#fff;font-size:18px;line-height:1.3;font-weight:900;">
                      {{ $messageTitle }}
                    </div>

                    <div style="margin-top:10px;font-family:Arial,Helvetica,sans-serif;color:rgba(255,255,255,.88);font-size:13px;line-height:1.7;">
                      {{ $messageBody }}
                    </div>

                    <!-- CTA Button -->
                    <div style="text-align:center;margin-top:16px;">
                      <a href="{{ $ctaUrl }}"
                         style="
                           display:inline-block;
                           background:#1d4ed8;
                           color:#fff;
                           text-decoration:none;
                           font-family:Arial,Helvetica,sans-serif;
                           font-weight:900;
                           font-size:14px;
                           padding:12px 18px;
                           border-radius:12px;
                         ">
                        {{ $ctaText }}
                      </a>
                    </div>

                    <div style="margin-top:14px;font-family:Arial,Helvetica,sans-serif;color:rgba(255,255,255,.82);font-size:12px;line-height:1.6;text-align:center;">
                      {{ $footerNote }}
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <div style="margin-top:16px;border-top:1px solid rgba(255,255,255,.14);padding-top:12px;text-align:center;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(255,255,255,.80);line-height:1.6;">
                  © {{ date('Y') }} Raymoch. All rights reserved.
                </div>
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(255,255,255,.80);line-height:1.6;margin-top:6px;">
                  <a href="{{ url('/privacy') }}" style="color:rgba(255,255,255,.85);text-decoration:underline;">Privacy</a>
                  &nbsp;•&nbsp;
                  <a href="{{ url('/terms') }}" style="color:rgba(255,255,255,.85);text-decoration:underline;">Terms</a>
                  &nbsp;•&nbsp;
                  <a href="{{ url('/contact') }}" style="color:rgba(255,255,255,.85);text-decoration:underline;">Contact</a>
                </div>
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
