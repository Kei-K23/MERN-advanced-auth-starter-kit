export const VERIFICATION_EMAIL_TEMPLATE = `
<!-- email-verify.html -->
<!-- email-verify.html -->
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      background: #f4f4f7;
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
    }

    h1 {
      font-size: 24px;
      color: #333;
    }

    p {
      color: #555;
      font-size: 16px;
    }

    .btn {
      display: inline-block;
      padding: 12px 24px;
      margin: 20px;
      background: #4CAF50;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }

    .footer {
      font-size: 12px;
      color: #aaa;
      text-align: center;
    }

    .box {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Verify Your Email</h1>
    <p>Hi {{name}},</p>
    <p>Thank you for signing up! Please confirm your email by clicking the button below or use the verification code:
    </p>
    <div class="box">
      <a href="{{verifyLink}}" class="btn">Verify Email</a>
    </div>
    <p>If the button doesn't work, copy and paste the verification code.</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{{verificationCode}}</span>
    </div>
    <p>Verification code will expire in 15 minutes for security reasons.</p>
    <div style="margin-top: 40px">
      <p class="footer">
        If you didn't request this, you can ignore this email.
      </p>
      <p class="footer">This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!-- email-reset-password.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; background-color: #fff; margin: 40px auto; padding: 20px; border-radius: 8px; }
    h2 { color: #2c3e50; }
    p { color: #555; font-size: 16px; }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background: #3498db;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer { margin-top: 30px; color: #aaa; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>Hi {{name}},</p>
    <p>We received a request to reset your password. Click the button below to proceed:</p>
    <a href="{{resetLink}}" class="btn">Reset Password</a>
    <p>If you didn’t request this, you can safely ignore it.</p>
    <p>Or copy this link manually:</p>
    <p><a href="{{resetLink}}">{{resetLink}}</a></p>
    <div class="footer">Your security is important to us.</div>
  </div>
</body>
</html>
`;

export const WELCOME_TEMPLATE = `<!-- email-welcome.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome!</title>
  <style>
    body { background: #f4f4f7; margin: 0; font-family: 'Segoe UI', sans-serif; }
    .container { max-width: 600px; margin: 50px auto; background: #ffffff; padding: 30px; border-radius: 10px; }
    h1 { color: #333333; }
    p { color: #555555; font-size: 16px; }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #2ecc71;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome, {{name}}! 🎉</h1>
    <p>We're excited to have you on board. Your account has been verified successfully.</p>
    <p>Feel free to explore and enjoy our services.</p>
    <div class="footer">Thank you for joining us!
    <br/>
      <br/>
      This is an automated message, please do not reply to this email.
    </div>
  </div>
</body>
</html>
`;
