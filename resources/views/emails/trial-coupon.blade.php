<!doctype html>
<html lang="en">

<body style="margin:0;background:#f7f2ea;color:#382116;font-family:Arial,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f2ea">
        <tr>
            <td align="center" style="padding:36px 16px">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                    style="max-width:620px;border:1px solid #d8c6b4;border-radius:22px;overflow:hidden;background:#fffdf9">
                    <tr>
                        <td style="padding:22px 30px;background:#382116;color:#fff8e7"><strong
                                style="font:700 24px Georgia,serif">Raymoch</strong><span
                                style="float:right;color:#e4ad45;font-size:11px;letter-spacing:1.4px;text-transform:uppercase">Trial
                                access</span></td>
                    </tr>
                    <tr>
                        <td style="padding:42px 38px">
                            <p
                                style="margin:0;color:#b57b3f;font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase">
                                Trial activated</p>
                            <h1 style="margin:10px 0 18px;font:700 34px Georgia,serif;color:#382116">Your secure coupon
                                is ready.</h1>
                            <p style="color:#73523d;line-height:1.7">Hello {{ $firstName }}, use the coupon below
                                with <strong>{{ $email }}</strong> to sign in during your trial.</p>
                            <div
                                style="margin:28px 0;padding:25px;border:1px solid #e1b65d;border-radius:16px;background:#fff1c7;text-align:center">
                                <span
                                    style="display:block;color:#805b2d;font-size:11px;font-weight:bold;text-transform:uppercase">16-character
                                    trial coupon</span><strong
                                    style="display:block;margin-top:11px;color:#321c14;font:700 24px 'Courier New',monospace;letter-spacing:2px;word-break:break-all">{{ $coupon }}</strong><small
                                    style="display:block;margin-top:12px;color:#73523d">Trial access ends
                                    {{ $trialEndsAt->format('M j, Y \a\t g:i A T') }}</small></div>
                            <p style="text-align:center"><a href="{{ $loginUrl }}"
                                    style="display:inline-block;padding:14px 26px;border-radius:999px;background:#5b3825;color:#fff;text-decoration:none;font-weight:bold">Sign
                                    in with coupon</a></p>
                            <div
                                style="margin-top:26px;padding:15px 17px;border-left:4px solid #b57b3f;background:#fff8e7;color:#73523d;font-size:13px;line-height:1.6">
                                <strong>Keep this coupon private.</strong> Only its secure hash is stored by Raymoch, so
                                this email is your copy.</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:18px;background:#f4e9dc;color:#8a705e;text-align:center;font-size:11px">Amber
                            clarity · Honey trust · Espresso security</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
