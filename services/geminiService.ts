import { GoogleGenAI, Type } from "@google/genai";
import { AIContextResponse, MeasurementLookupResponse, UnitCategory } from "../types";
import { UNIT_DATA } from "../constants";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

// Use the Lite model for low latency
const MODEL_NAME = "gemini-flash-lite-latest";

export const fetchConversionContext = async (
  value: number,
  fromUnitName: string,
  toUnitName: string
): Promise<AIContextResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const prompt = `
    Convert: ${value} ${fromUnitName} to ${toUnitName}.
    
    Output JSON with:
    1. 'examples': Exactly 2 short, vivid real-world comparisons (e.g. "Height of a giraffe").
    2. 'funFact': One fascinating fact about this scale/unit.
    
    Keep it extremely concise and fast.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            examples: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of exactly 2 real world comparison examples"
            },
            funFact: { type: Type.STRING, description: "One interesting fact about this measurement" }
          },
          required: ["examples", "funFact"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIContextResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const performSmartLookup = async (query: string): Promise<MeasurementLookupResponse> => {
  if (!apiKey) throw new Error("API Key is missing");

  // Construct a context string of valid units
  const validUnitsMap = Object.entries(UNIT_DATA).map(([cat, units]) => {
    return `${cat}: [${units.map(u => u.id).join(', ')}]`;
  }).join('\n');

  // Optimized prompt for speed and insight quality
  const prompt = `
    Query: "${query}"
    
    Task:
    1. Estimate the value of the object in the query.
    2. Map to the best UnitCategory and units from the list below.
    3. Provide a 'explanation' that is a fascinating insight or specific detail about the object's measurement (e.g., "The Eiffel Tower grows ~15cm in summer").
    
    Available Units:
    ${validUnitsMap}

    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: Object.values(UnitCategory) },
            value: { type: Type.NUMBER, description: "Estimated value" },
            fromUnitId: { type: Type.STRING, description: "ID of the source unit from the available list" },
            toUnitId: { type: Type.STRING, description: "ID of the target unit from the available list" },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-1" },
            explanation: { type: Type.STRING, description: "A fascinating, concise insight about the measured object." }
          },
          required: ["category", "value", "fromUnitId", "toUnitId", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as MeasurementLookupResponse;
  } catch (error) {
    console.error("Smart Lookup Error:", error);
    throw error;
  }
};
