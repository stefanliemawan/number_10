
import { GoogleGenAI, Type } from "@google/genai";
import { Stats, PoliticalEvent, DispatchAction, Day, Minister } from "../types";

// Note: Always create a fresh instance before calling to ensure latest API key is used
// but here we can define the helper.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const evaluatePMQ = async (question: string, responseLabel: string): Promise<{ score: number, commentary: string }> => {
  const ai = getAI();
  const prompt = `Evaluate PM response for PMQs.
    Q: "${question}"
    PM: "${responseLabel}"
    Return JSON {score: 1-10, commentary: "witty/sarcastic British remark"}.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          commentary: { type: Type.STRING }
        },
        required: ["score", "commentary"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { score: 5, commentary: "Order! Order in the house." };
  }
};

export const generatePoliticalEvent = async (stats: Stats, dispatchType: string, minister?: Minister): Promise<PoliticalEvent> => {
  const ai = getAI();
  const ministerContext = minister ? `Subject: ${minister.name} (${minister.personality}, goal: ${minister.goal}).` : '';
  
  const prompt = `Generate a UK political dilemma. Tone: Dry, sarcastic British.
    Context: Day ${stats.day}, Week ${stats.week}. Approval: ${stats.approval}%. Budget: £${stats.budget}bn.
    Theme: ${dispatchType}. Include real issues: Ukraine, EU Rejoin pressure, Pres. Grump, Bank of England, inflation.
    ${ministerContext}
    Provide 3 choices with consequences for approval, partyUnity, budget, influence, mediaPerception, nationalSecurity.
    For ministerHappiness, return array of {ministerName: string, happinessDelta: number}.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                description: { type: Type.STRING },
                flavourText: { type: Type.STRING },
                consequences: {
                  type: Type.OBJECT,
                  properties: {
                    approval: { type: Type.NUMBER },
                    partyUnity: { type: Type.NUMBER },
                    budget: { type: Type.NUMBER },
                    influence: { type: Type.NUMBER },
                    mediaPerception: { type: Type.NUMBER },
                    nationalSecurity: { type: Type.NUMBER },
                    ministerHappiness: { 
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          ministerName: { type: Type.STRING },
                          happinessDelta: { type: Type.NUMBER }
                        },
                        required: ["ministerName", "happinessDelta"]
                      }
                    }
                  }
                }
              },
              required: ["label", "description", "consequences"]
            }
          }
        },
        required: ["title", "description", "options"]
      }
    }
  });

  const eventData = JSON.parse(response.text || '{}');
  return {
    ...eventData,
    id: Math.random().toString(36).substr(2, 9),
    image: `https://picsum.photos/seed/${Math.random()}/800/400?grayscale`
  };
};

export const generateDailyDispatch = (day: Day, ministers: Minister[]): DispatchAction[] => {
  const baseTypes: DispatchAction['type'][] = ['MI5', 'PROJECT_SIGN', 'PUBLIC_VISIT', 'FOREIGN', 'PRESS', 'MINISTER_SUGGESTION'];
  const shuffled = [...baseTypes].sort(() => 0.5 - Math.random()).slice(0, 4);
  
  return shuffled.map((type, i) => {
    let title = "";
    let description = "";
    let linkedMinisterId = undefined;

    if (type === 'MINISTER_SUGGESTION') {
      const activeMinisters = ministers.filter(m => !m.isResigned);
      const chosen = activeMinisters[Math.floor(Math.random() * activeMinisters.length)];
      linkedMinisterId = chosen?.id;
      title = `Proposal: ${chosen?.name}`;
      description = `A matter of ${chosen?.goal.toLowerCase()}. Urgency: High. Patience: Low.`;
    } else {
      switch(type) {
        case 'MI5': title = "Ukraine Strategy"; description = "Classified intelligence on Russian movements. MI5 awaits your call."; break;
        case 'PROJECT_SIGN': title = "OBR Economic Data"; description = "The Office for Budget Responsibility has revised growth. Spoiler: It's bad."; break;
        case 'PUBLIC_VISIT': title = "Cost of Living Protest"; description = "Angry citizens in Whitehall. Wear your most 'man of the people' tie."; break;
        case 'FOREIGN': title = "Call: President Grump"; description = "The Grump Administration is calling. Again. Something about trade tariffs."; break;
        case 'PRESS': title = "EU Rejoiner Briefing"; description = "A new poll shows 54% want back in. Prepare your best 'No' face."; break;
      }
    }
    return { id: `d-${day}-${i}`, type, title, description, linkedMinisterId };
  });
};
