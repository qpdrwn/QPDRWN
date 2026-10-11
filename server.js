const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({
  dest: "/tmp/qpdrwn-uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
    fields: 10
  }
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/brief", upload.single("file"), async (req, res) => {
  let uploadedFile = req.file;

  try {
    const { name, brand, email, service, budget, message } = req.body;

    if (!name || !brand || !email || !service || !budget || !message) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields."
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({
        success: false,
        message: "Telegram is not configured."
      });
    }

    const text = [
      "📩 NEW PROJECT BRIEF",
      "",
      `👤 Name: ${name}`,
      `🏢 Brand: ${brand}`,
      `📧 Email: ${email}`,
      `🎨 Service: ${service}`,
      `💰 Budget: ${budget}`,
      "",
      "📝 Project Details:",
      message
    ].join("\n");

    const telegramUrl = `https://api.telegram.org/bot${token}`;

    const telegramResponse = await fetch(`${telegramUrl}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text
      })
    });

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      throw new Error("Telegram message delivery failed.");
    }

    if (uploadedFile) {
      const form = new FormData();

      form.append("chat_id", chatId);
      form.append(
        "document",
        new Blob([fs.readFileSync(uploadedFile.path)]),
        uploadedFile.originalname
      );

      const fileResponse = await fetch(`${telegramUrl}/sendDocument`, {
        method: "POST",
        body: form
      });

      const fileResult = await fileResponse.json();

      if (!fileResponse.ok || !fileResult.ok) {
        throw new Error("Telegram file delivery failed.");
      }
    }

    return res.json({
      ok: true,
      message: "Your project brief has been sent successfully."
    });
  } catch (error) {
    console.error("Brief submission error:", error.message);

    return res.status(500).json({
      ok: false,
      message: "Unable to send your brief. Please try again."
    });
  } finally {
    if (uploadedFile) {
      fs.promises.unlink(uploadedFile.path).catch(() => {});
    }
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      ok: false,
      message: "The uploaded file may be too large."
    });
  }

  console.error(error.message);

  return res.status(500).json({
    ok: false,
    message: "An unexpected error occurred."
  });
});

app.listen(PORT, () => {
  console.log(`qpdrwn server is running on port ${PORT}`);
});
