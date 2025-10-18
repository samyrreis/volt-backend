import express from "express";
import cors from "cors";
import { Resend } from "resend";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes." });
  }

  try {
    // 🔥 instanciamos o Resend AQUI dentro, depois que as variáveis já estão disponíveis
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "contato@voltbrasil.app";

    const data = await resend.emails.send({
      from: fromEmail,
      to: "contato@voltbrasil.app",
      subject: `Nova mensagem de contato - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2ecc71;">Nova mensagem de contato - Volt</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">Esta mensagem foi enviada através do formulário de contato do site Volt.</p>
        </div>
      `,
      reply_to: email
    });

    res.status(200).json({ success: true, message: "Mensagem enviada com sucesso!", data });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ success: false, message: "Erro ao enviar e-mail." });
  }
});

app.get("/", (req, res

