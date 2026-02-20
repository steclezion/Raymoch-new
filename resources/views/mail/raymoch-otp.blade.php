<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Raymoch Verification</title>
</head>
<body style="margin:0;padding:0;background:#1A267A;">
  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="background:#1A267A;">
    <tr>
      <td align="center" style="padding:28px 14px;">

        <!-- Card container -->
        <table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0"
          style="width:100%;max-width:680px;border-radius:18px;overflow:hidden;">

          <!-- ===== HERO (matches your blue image) ===== -->
          <tr>
            <td
              style="
                background:#293696;
                background-image: linear-gradient(135deg,#313EAE 0%, #293696 45%, #1A267A 100%);
                padding:34px 28px 18px 28px;
              "
            >
              <div style="font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
                <div style="font-size:40px;line-height:1.1;font-weight:900;letter-spacing:.2px;">
                  Redefining African Potential
                </div>

                <div style="margin-top:14px;font-size:16px;line-height:1.7;color:rgba(255,255,255,.92);max-width:520px;">
                  At Raymoch, we connect investors and entrepreneurs through trust, verified data, and actionable insights.
                  Our mission is to unlock visibility and capital for businesses across Africa and beyond.
                </div>
              </div>
            </td>
          </tr>

          <!-- ===== OTP SECTION (still blends with blue theme) ===== -->
          <tr>
            <td
              style="
                background:#293696;
                background-image: linear-gradient(180deg,#293696 0%, #1A267A 100%);
                padding:18px 22px 26px 22px;
              "
            >
              <!-- Inner panel -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.14);border-radius:16px;">
                <tr>
                  <td style="padding:18px 16px;text-align:center;">
                    <div style="font-family:Arial,Helvetica,sans-serif;color:rgba(255,255,255,.92);font-size:14px;line-height:1.6;">
                      Your Raymoch verification code (expires in <strong style="color:#ffffff;">{{ $minutes }}</strong> minutes)
                    </div>

                    <!-- OTP box -->
                    <div style="margin-top:14px;">
                      <span
                        style="
                          display:inline-block;
                          background:#ffffff;
                          border:1px solid rgba(255,255,255,.55);
                          border-radius:14px;
                          padding:14px 18px;
                        "
                      >
                        <span style="font-family:Arial,Helvetica,sans-serif;font-size:32px;letter-spacing:7px;font-weight:900;color:#1d4ed8;">
                          {{ $code }}
                        </span>
                      </span>
                    </div>

                    <div style="margin-top:12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:rgba(255,255,255,.85);">
                      If you didn’t request this code, you can ignore this email.
                    </div>

                    <!-- CTA button (aligned + email-safe) -->
                    <div style="margin-top:16px;">
                      <a href="{{ url('/signup') }}"
                        style="
                          display:inline-block;
                          background:#1d4ed8;
                          color:#ffffff;
                          text-decoration:none;
                          font-family:Arial,Helvetica,sans-serif;
                          font-weight:800;
                          font-size:14px;
                          padding:12px 18px;
                          border-radius:12px;
                        ">
                        Continue Signup
                      </a>
                    </div>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ===== STEPS SECTION (keeps your “how it works” structure) ===== -->
          <tr>
            <td
              style="
                background:#1A267A;
                background-image: linear-gradient(180deg,#1A267A 0%, #0F1A5E 100%);
                padding:22px 18px 18px 18px;
              "
            >
              <div style="text-align:center;font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-weight:900;font-size:18px;">
                How it works
              </div>
              <div style="text-align:center;font-family:Arial,Helvetica,sans-serif;color:rgba(255,255,255,.86);font-size:12px;line-height:1.6;margin-top:6px;">
                Verify your email to activate your account.
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:14px;">
                <tr>
                  <td valign="top" style="width:25%;padding:10px 10px;text-align:center;">
                    <div style="font-size:26px;line-height:1;">📝</div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:900;color:#ffffff;margin-top:10px;">
                      Register
                    </div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:rgba(255,255,255,.86);margin-top:6px;">
                      Create your account in seconds.
                    </div>
                  </td>

                  <td valign="top" style="width:25%;padding:10px 10px;text-align:center;">
                    <div style="font-size:26px;line-height:1;">✅</div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:900;color:#ffffff;margin-top:10px;">
                      Verify
                    </div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:rgba(255,255,255,.86);margin-top:6px;">
                      Enter the code to confirm your email.
                    </div>
                  </td>

                  <td valign="top" style="width:25%;padding:10px 10px;text-align:center;">
                    <div style="font-size:26px;line-height:1;">🎯</div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:900;color:#ffffff;margin-top:10px;">
                      Explore
                    </div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:rgba(255,255,255,.86);margin-top:6px;">
                      Discover verified companies and insights.
                    </div>
                  </td>

                  <td valign="top" style="width:25%;padding:10px 10px;text-align:center;">
                    <div style="font-size:26px;line-height:1;">📩</div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:900;color:#ffffff;margin-top:10px;">
                      Updates
                    </div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:rgba(255,255,255,.86);margin-top:6px;">
                      We’ll notify you via email.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <div style="margin-top:18px;border-top:1px solid rgba(255,255,255,.14);padding-top:14px;text-align:center;">
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
        <!-- /Card container -->

      </td>
    </tr>
  </table>
</body>
</html>
