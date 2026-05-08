import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

dotenv.config();

const app = express();

// --- AI SETUP ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- API ROUTES ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// AI Chat - Saathi AI
app.post("/api/ai/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: `You are "Saathi AI", the dedicated healthcare assistant for Sehat Saathi. 
      Sehat Saathi is an Indian digital healthcare platform that bridges the gap between rural patients and quality healthcare.
      
      Your roles:
      1. Provide general health information and wellness tips.
      2. Explain features of the Sehat Saathi app (Symptom Checker, Pharmacy Search, Telemedicine, Health Records).
      3. Be empathetic, professional, and clear.
      4. IMPORTANT: Always include a disclaimer that you are an AI and not a substitute for professional medical advice. For emergencies, tell users to call emergency services (102 in India).
      5. Use a mix of English and simple Hindi (Hinglish) if appropriate, as the app serves Indian users.
      
      Do not prescribe specific medications. Suggest consulting a doctor via the app's Telemedicine feature instead.`
    });

    const chat = model.startChat({
      history: history?.map((h: any) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.parts[0].text }]
      })) || []
    });

    const result = await chat.sendMessage(message);
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to communicate with AI" });
  }
});

// AI Symptom Checker
app.post("/api/ai/symptoms", async (req, res) => {
  const { symptoms, language } = req.body;
  if (!symptoms) return res.status(400).json({ error: "Symptoms are required" });

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            condition: { type: SchemaType.STRING },
            severity: { type: SchemaType.STRING },
            recommendation: { type: SchemaType.STRING },
            localLanguageAdvice: { type: SchemaType.STRING },
            isEmergency: { type: SchemaType.BOOLEAN }
          },
          required: ["condition", "severity", "recommendation", "localLanguageAdvice", "isEmergency"]
        }
      }
    });

    const prompt = `Patient symptoms: ${symptoms}. Preferred language: ${language}. Analyze and provide medical guidance carefully.`;
    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("Symptom AI Error:", error);
    res.status(500).json({ error: "AI Diagnostic failure" });
  }
});

// AI Report Analyzer
app.post("/api/ai/analyze-report", async (req, res) => {
  const { text, image } = req.body;
  if (!text && !image) return res.status(400).json({ error: "Content is required" });

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            finding: { type: SchemaType.STRING },
            confidence: { type: SchemaType.NUMBER },
            instructions: { type: SchemaType.STRING }
          },
          required: ["finding", "confidence", "instructions"]
        }
      }
    });

    const parts: any[] = [{ text: `Analyze this medical findings: ${text}` }];
    if (image) {
      parts.push({
        inlineData: {
          data: image.data.split(',')[1],
          mimeType: image.mimeType
        }
      });
    }

    const result = await model.generateContent(parts);
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("Report AI Error:", error);
    res.status(500).json({ error: "Report analysis failed" });
  }
});

// Pharmacy / Medicine Availability
app.get("/api/pharmacy/search", (req, res) => {
  const { query } = req.query;
  const q = String(query || "").toLowerCase();

  const mockPharmacies = [
    { 
      id: 1, 
      name: "Ganga Jan Aushadhi Store", 
      medicines: ["paracetamol", "aspirin", "insulin", "crocin"],
      distance: "0.8km", 
      status: "In Stock", 
      stockLevel: "High", 
      address: "Main Market, Sector 4", 
      price: "₹45" 
    },
    { 
      id: 2, 
      name: "City Apollo Pharmacy", 
      medicines: ["amoxicillin", "cetirizine", "vicks", "metformin"],
      distance: "2.1km", 
      status: "Limited Stock", 
      stockLevel: "Low", 
      address: "Railway Station Rd", 
      price: "₹52" 
    },
    { 
      id: 3, 
      name: "Village Health Point", 
      medicines: ["bandages", "antiseptic", "ors", "paracetamol"],
      distance: "4.5km", 
      status: "Stocked", 
      stockLevel: "Medium", 
      address: "Kisan Chowk", 
      price: "₹15" 
    }
  ];
  
  const filtered = q 
    ? mockPharmacies.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.medicines.some(m => m.includes(q))
      )
    : mockPharmacies;

  res.json(filtered);
});

// Telemedicine - Live online doctors
app.get("/api/telemedicine/doctors-online", (req, res) => {
  res.json([
    { id: "dr1", name: "Dr. Aman Sharma", specialty: "General Physician", online: true, rating: 4.8, experience: "12 yrs", language: ["Hindi", "English", "Punjabi"] },
    { id: "dr2", name: "Dr. Priya Varma", specialty: "Pediatrician", online: true, rating: 4.9, experience: "8 yrs", language: ["Hindi", "English", "Marathi"] },
    { id: "dr3", name: "Dr. K. Rajesh", specialty: "Cardiologist", online: true, rating: 4.7, experience: "15 yrs", language: ["Tamil", "English", "Hindi"] }
  ]);
});

// Health Records Sync
app.post("/api/records/sync", (req, res) => {
  const { patientId, records } = req.body;
  const timestamp = new Date().toISOString();
  console.log(`[SYNC] Patient: ${patientId} | Items: ${records?.length} | Time: ${timestamp}`);
  
  res.json({ 
    status: "synced", 
    serverTime: timestamp,
    acknowledgedIds: records?.map((r: any) => r.id) || []
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// For local development
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const BACKEND_PORT = 3001;
  app.listen(BACKEND_PORT, "0.0.0.0", () => {
    console.log(`Backend server running on http://0.0.0.0:${BACKEND_PORT}`);
  });
}

// Export for Vercel serverless function
export default app;
