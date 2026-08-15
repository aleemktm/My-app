import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(express.static(__dirname));

// Lazy GenAI initialization
let aiClient = null;
function getAIClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Receipt OCR API
app.post("/api/ocr-receipt", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 payload" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({
        success: false,
        fallback: true,
        message: "Gemini API key is not configured; using offline fallback.",
        parsed: {
          merchant: "Scanned Receipt",
          amount: 0,
          currency: "AED",
          date: new Date().toISOString().slice(0, 10),
          category: "Shopping",
          notes: "Manual review required",
        },
      });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: "Extract key transaction details from this receipt or invoice. Return pure JSON matching the schema.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: {
              type: Type.STRING,
              description: "Store or merchant name, e.g. Carrefour, Starbucks, Lulu Hypermarket",
            },
            amount: {
              type: Type.NUMBER,
              description: "Total monetary amount paid or charged as a positive number",
            },
            currency: {
              type: Type.STRING,
              description: "3-letter currency code, e.g. AED, USD, EUR, GBP, INR, SAR",
            },
            date: {
              type: Type.STRING,
              description: "Date in YYYY-MM-DD format",
            },
            category: {
              type: Type.STRING,
              description: "Suggested expense category, e.g. Groceries, Dining, Transport, Utilities, Shopping, Entertainment, Health",
            },
            paymentMethod: {
              type: Type.STRING,
              description: "Payment method if found, e.g. Credit Card, Apple Pay, Cash, Debit Card",
            },
            notes: {
              type: Type.STRING,
              description: "Brief summary of purchased items or receipt reference",
            },
          },
          required: ["merchant", "amount", "currency", "date", "category"],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      parsed: parsedJson,
    });
  } catch (error) {
    console.error("Receipt OCR error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process receipt image",
    });
  }
});

// Bank SMS Intelligence API
app.post("/api/parse-bank-sms", async (req, res) => {
  try {
    const { text, imageBase64, mimeType = "image/jpeg" } = req.body || {};
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        success: false,
        fallback: true,
        message: "Gemini API key not configured.",
      });
    }

    const parts = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType,
        },
      });
    }
    if (text) {
      parts.push({ text: `Analyze this bank transaction SMS or alert: "${text}"` });
    } else {
      parts.push({ text: "Analyze the bank notification screenshot and extract transaction details." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bankName: { type: Type.STRING, description: "Bank name (e.g. ADCB, Emirates NBD, FAB, Mashreq, DIB, HSBC)" },
            type: { type: Type.STRING, description: "income, expense, or transfer" },
            amount: { type: Type.NUMBER, description: "Transaction amount as positive number" },
            currency: { type: Type.STRING, description: "3-letter currency code (e.g. AED, USD, EUR)" },
            merchant: { type: Type.STRING, description: "Merchant or beneficiary name" },
            cardOrAccount: { type: Type.STRING, description: "Card ending digits or account identifier (e.g. *1234)" },
            date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
            category: { type: Type.STRING, description: "Suggested budget category" },
            notes: { type: Type.STRING, description: "Summary or raw clean context" },
          },
          required: ["type", "amount", "currency", "merchant", "date", "category"],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      parsed: parsedJson,
    });
  } catch (error) {
    console.error("Bank SMS parse error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze SMS",
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

