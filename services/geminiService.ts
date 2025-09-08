

import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Job, CV } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Type definitions for the raw Gemini API responses
type RawJob = Omit<Job, 'id' | 'employerId' | 'views' | 'clicks'>;
type RawCV = Omit<CV, 'id' | 'avatarUrl' | 'userId' | 'cvFileName' | 'contactEmail' | 'phone'>;


export const generateInitialData = async (): Promise<{ jobs: Job[]; cvs: CV[] }> => {
    try {
        const jobsPromise = ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate 15 diverse job postings for a tech job portal, with locations primarily in Lusaka and cities in the Copperbelt region of Zambia (e.g., Ndola, Kitwe, Chingola). Include job title, company name, location, and a 2-3 sentence description for each.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "The title of the job." },
                            company: { type: Type.STRING, description: "The name of the company hiring." },
                            location: { type: Type.STRING, description: "The location of the job (e.g., Lusaka, Zambia or Kitwe, Zambia)." },
                            description: { type: Type.STRING, description: "A brief, 2-3 sentence description of the job." },
                        },
                    },
                },
            },
        });

        // This is now just for placeholder data for employers if no one has signed up
        const cvsPromise = ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate 10 diverse candidate profiles for a tech job portal. For each, include a realistic Zambian name (e.g., Bwalya, Temwani, Chipo), current job title, a list of 3 key skills, and a list of 2 past experiences (as short strings).",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The candidate's full name (should be a common Zambian name)." },
                            title: { type: Type.STRING, description: "The candidate's current professional title." },
                            skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3 key skills." },
                            experience: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2 past experiences." },
                        },
                    },
                },
            },
        });

        const [jobResponse, cvResponse] = await Promise.all([jobsPromise, cvsPromise]);

        const rawJobs: RawJob[] = JSON.parse(jobResponse.text);
        const rawCvs: RawCV[] = JSON.parse(cvResponse.text);

        const jobs: Job[] = rawJobs.map((job, index) => {
             // Simulate some basic analytics data for demonstration
            const clicks = Math.floor(Math.random() * 250) + 20; // e.g., 20 to 270 clicks
            const views = clicks + Math.floor(Math.random() * 800) + 50; // Views are always more than clicks

            return {
                ...job,
                id: `job-${Date.now()}-${index}`,
                employerId: 'user-demo-employer', // Associate with demo employer
                views,
                clicks,
            };
        });

        const cvs: CV[] = rawCvs.map((cv, index) => ({
            ...cv,
            id: `cv-${Date.now()}-${index}`,
            userId: `gemini-generated-${index}`, // placeholder userId
        }));

        return { jobs, cvs };

    } catch (error) {
        console.error("Error generating initial data with Gemini:", error);
        throw new Error("Failed to fetch initial data from AI service.");
    }
};