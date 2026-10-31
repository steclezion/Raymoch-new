<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Raymoch trial coupon</title>
</head>
<body style="margin:0;padding:0;background:#f7f2ea;color:#382116;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f2ea;">
    <tr>
        <td align="center" style="padding:34px 16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;overflow:hidden;border:1px solid #ded2c3;border-radius:24px;background:#fffdfa;box-shadow:0 20px 55px rgba(56,33,22,.12);">
                <tr>
                    <td style="padding:22px 30px;background:#382116;color:#fff8e7;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td style="font-family:Georgia,'Times New Roman',serif;font-size:23px;font-weight:bold;">Raymoch</td>
                                <td align="right" style="color:#f3c94f;font-size:11px;font-weight:bold;letter-spacing:1.3px;text-transform:uppercase;">Secure trial access</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:42px 38px 34px;">
                        <p style="margin:0 0 12px;color:#d39a2c;font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;">Email verification</p>
                        <h1 style="margin:0;color:#382116;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.18;font-weight:normal;">Your trial coupon is ready.</h1>
                        <p style="margin:20px 0 0;color:#73523d;font-size:16px;line-height:1.7;">Hello {{ $firstName }}, use the one-time coupon below to verify <strong>{{ $email }}</strong> and continue to your Raymoch trial workspace.</p>

                        <div style="margin:30px 0;padding:24px;border:1px solid #e8c982;border-radius:18px;background:#fff4cc;text-align:center;">
                            <span style="display:block;margin-bottom:10px;color:#886438;font-size:11px;font-weight:bold;letter-spacing:1.3px;text-transform:uppercase;">Your six-digit coupon</span>
                            <strong style="display:block;color:#321c14;font-family:'Courier New',monospace;font-size:40px;line-height:1;letter-spacing:9px;">{{ $coupon }}</strong>
                            <span style="display:block;margin-top:13px;color:#73523d;font-size:13px;">Expires in {{ $expiresInMinutes }} minutes · Can be used once</span>
                        </div>

                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                            <tr>
                                <td style="border-radius:999px;background:#4a2a1d;">
                                    <a href="{{ $verificationUrl }}" style="display:inline-block;padding:15px 28px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">Verify your coupon</a>
                                </td>
                            </tr>
                        </table>

                        <div style="margin-top:30px;padding:16px 18px;border-left:4px solid #d39a2c;background:#fff8e7;color:#73523d;font-size:13px;line-height:1.6;">
                            <strong style="color:#4a2a1d;">Keep this coupon private.</strong> Raymoch will never ask you to share it by phone, chat, or social media.
                        </div>
                        <p style="margin:24px 0 0;color:#886f5d;font-size:12px;line-height:1.6;">If you did not request a Raymoch trial, you can safely ignore this email. The coupon will expire automatically.</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 30px;border-top:1px solid #eadfcf;background:#fbf6ed;color:#886f5d;font-size:11px;line-height:1.6;text-align:center;">
                        Raymoch · African business intelligence, made human<br>
                        This is an automated security notification.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
