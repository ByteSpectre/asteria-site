import nodemailer from "nodemailer";

type LeadMailPayload = {
  email: string;
  phone: string;
  mode: "consultation" | "service";
  serviceName?: string;
};

function getToEmail() {
  return process.env.CONTACT_TO_EMAIL?.trim() || "sdtagirov2005@gmail.com";
}

function getFromEmail(smtpUser: string) {
  const configured = process.env.CONTACT_FROM_EMAIL?.trim();
  if (configured) return configured;
  return `Asteria <${smtpUser}>`;
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT?.trim() || "465");
  const secure =
    process.env.SMTP_SECURE?.trim() === "false"
      ? false
      : process.env.SMTP_SECURE?.trim() === "true"
        ? true
        : port === 465;

  if (!host || !user || !pass || !Number.isFinite(port)) {
    return null;
  }

  return { host, port, secure, user, pass };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildLeadEmailHtml(payload: {
  kind: string;
  subject: string;
  email: string;
  phone: string;
  serviceName: string;
  mode: string;
  time: string;
}) {
  const kind = escapeHtml(payload.kind);
  const subject = escapeHtml(payload.subject);
  const email = escapeHtml(payload.email);
  const phone = escapeHtml(payload.phone);
  const serviceName = escapeHtml(payload.serviceName);
  const mode = escapeHtml(payload.mode);
  const time = escapeHtml(payload.time);

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f1e8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f1e8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#fbf8f1;border:1px solid rgba(22,19,16,0.10);">
          <tr>
            <td style="background:#2c1119;padding:28px 32px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.2;letter-spacing:-0.03em;color:#fbf8f1;">Астерия</p>
              <p style="margin:10px 0 0;font-family:ui-monospace,Consolas,monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(251,248,241,0.55);">Юридическое агентство · заявка с сайта</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              <p style="margin:0;font-family:ui-monospace,Consolas,monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(22,19,16,0.40);">${kind}</p>
              <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;font-weight:500;letter-spacing:-0.03em;color:#161310;">${subject}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 0;">
              <div style="height:1px;background:rgba(22,19,16,0.10);line-height:1px;font-size:1px;">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:16px 0;border-bottom:1px solid rgba(22,19,16,0.08);">
                    <p style="margin:0 0 6px;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(22,19,16,0.40);">Почта</p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.4;color:#161310;">
                      <a href="mailto:${email}" style="color:#431c26;text-decoration:none;">${email}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 0;border-bottom:1px solid rgba(22,19,16,0.08);">
                    <p style="margin:0 0 6px;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(22,19,16,0.40);">Телефон</p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.4;color:#161310;">${phone}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 0;border-bottom:1px solid rgba(22,19,16,0.08);">
                    <p style="margin:0 0 6px;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(22,19,16,0.40);">Название услуги</p>
                    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.35;color:#161310;">${serviceName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 0;">
                    <p style="margin:0 0 6px;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(22,19,16,0.40);">Тип заявки</p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.4;color:#431c26;">${mode}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#431c26;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(251,248,241,0.55);">Ответить клиенту</p>
                    <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.4;">
                      <a href="mailto:${email}" style="color:#fbf8f1;text-decoration:none;">Написать на ${email}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#f5f1e8;border-top:1px solid rgba(22,19,16,0.08);padding:18px 32px;">
              <p style="margin:0;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(22,19,16,0.40);">Отправлено ${time}</p>
              <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:rgba(22,19,16,0.45);">Заявка с сайта юридического агентства Астерия.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendContactLeadEmail(payload: LeadMailPayload) {
  const to = getToEmail();
  const smtp = getSmtpConfig();

  const kindLabel =
    payload.mode === "service" ? "Заказ услуги" : "Заказ консультации";
  const subject =
    payload.mode === "service" && payload.serviceName
      ? `${kindLabel}: ${payload.serviceName}`
      : kindLabel;
  const time = new Date().toLocaleString("ru-RU");
  const serviceName =
    payload.mode === "service" ? payload.serviceName || "—" : "—";
  const phone = payload.phone || "—";

  const text = [
    kindLabel,
    "",
    `Почта: ${payload.email}`,
    `Телефон: ${phone}`,
    `Услуга: ${serviceName}`,
    `Тип: ${payload.mode}`,
    "",
    `Время: ${time}`,
  ].join("\n");

  const html = buildLeadEmailHtml({
    kind: kindLabel,
    subject,
    email: payload.email,
    phone,
    serviceName,
    mode: payload.mode,
    time,
  });

  if (!smtp) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact-lead:dev]", { to, subject, text });
      return { ok: true as const, mocked: true as const };
    }
    return {
      ok: false as const,
      error: "Почтовая отправка не настроена (SMTP_HOST / SMTP_USER / SMTP_PASS).",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    await transporter.sendMail({
      from: getFromEmail(smtp.user),
      to,
      replyTo: payload.email,
      subject: `Астерия — ${subject}`,
      text,
      html,
    });

    return { ok: true as const, mocked: false as const };
  } catch (error) {
    console.error(
      "[contact-lead] smtp failed",
      error instanceof Error ? error.message : "unknown",
    );
    return {
      ok: false as const,
      error: "Не удалось отправить заявку. Попробуйте позже.",
    };
  }
}
