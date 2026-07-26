import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini API client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  // API Endpoint: /api/explain - Dynamically parse any AI concept into structured 3D visualization specs
  app.post('/api/explain', async (req, res) => {
    try {
      const { prompt, category } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      const ai = getGeminiClient();

      const preferredCategory = category && ['dnn', 'cnn', 'transformer', 'llm'].includes(category)
        ? category
        : (prompt.toLowerCase().includes('vision') || prompt.toLowerCase().includes('cnn') || prompt.toLowerCase().includes('image') || prompt.toLowerCase().includes('resnet') ? 'cnn' :
           prompt.toLowerCase().includes('attention') || prompt.toLowerCase().includes('transformer') || prompt.toLowerCase().includes('bert') ? 'transformer' :
           prompt.toLowerCase().includes('llm') || prompt.toLowerCase().includes('gpt') || prompt.toLowerCase().includes('chat') || prompt.toLowerCase().includes('language') ? 'llm' : 'dnn');

      if (!ai) {
        // Fallback generator if API key is not set
        res.json({
          id: 'custom-' + Date.now(),
          title: prompt,
          subtitle: 'Interactive Architecture Visualization',
          category: preferredCategory,
          badge: 'Custom AI Concept',
          summary: `Detailed 3D architectural breakdown of ${prompt}, highlighting key functional components, layer operations, and non-linear transformations.`,
          architectureBreakdown: [
            {
              id: 'layer-0',
              name: `${prompt} Input Ingestion`,
              role: 'Data Normalization',
              nodesCount: 12,
              dimensions: '12 x 1',
              description: `Processes incoming feature embeddings or tensor inputs for ${prompt}.`,
              details: ['Normalizes continuous numerical values', 'Passes representations to feature projection layers']
            },
            {
              id: 'layer-1',
              name: `${prompt} Feature Extractor`,
              role: 'Representation Learning',
              nodesCount: 16,
              dimensions: '16 x 16 Matrix',
              activationFunction: 'GELU / Swish',
              description: `Applies weighted matrix transformations and non-linear activation functions tailored for ${prompt}.`,
              details: ['Extracts non-linear interaction features', 'Computes key internal tensor states']
            },
            {
              id: 'layer-2',
              name: 'Output Projection & Decision Head',
              role: 'Prediction & Logits',
              nodesCount: 6,
              dimensions: '6 x 1 Logits',
              activationFunction: 'Softmax',
              description: 'Produces final normalized classification or token prediction logits.',
              details: ['Maps high-dimensional latent space to target metrics']
            }
          ],
          mathFormulas: [
            {
              title: 'Primary State Operator',
              expression: 'h = \\sigma(W x + b)',
              description: 'Affine transformation with learnable weight matrix $W$ and bias vector $b$.'
            },
            {
              title: 'Loss Objective Function',
              expression: '\\mathcal{L}(\\theta) = -\\sum y \\log(\\hat{y})',
              description: 'Cross-entropy loss comparing ground truth against predicted probabilities.'
            }
          ],
          keyHighlights: [
            `Dynamic 3D representation tailored for custom concept "${prompt}"`,
            'Interactive node exploration and state parameter controls',
            'Synchronized real-time sidebar mathematical breakdown'
          ],
          parameters: [
            { label: 'Layer Depth Scale', key: 'depthScale', value: 1.5, min: 0.5, max: 3.0, step: 0.1 },
            { label: 'Signal Flow Speed', key: 'flowSpeed', value: 1.0, min: 0.2, max: 2.5, step: 0.1 }
          ]
        });
        return;
      }

      // Call Gemini 3.6 Flash model with JSON schema
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analyze the AI concept "${prompt}"${category ? ` in the context of the "${category}" architecture family` : ''}. Produce a clean structured JSON output explaining its architecture, category (must be one of: 'dnn', 'cnn', 'transformer', 'llm'), layer breakdown, and math equations for a 3D visualization.`,
        config: {
          systemInstruction: 'You are an expert AI Architect and Computer Science Professor. Generate technical precision JSON for interactive 3D visualizations.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              category: { type: Type.STRING, description: "Must be 'dnn', 'cnn', 'transformer', or 'llm'" },
              badge: { type: Type.STRING },
              summary: { type: Type.STRING },
              architectureBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    nodesCount: { type: Type.INTEGER },
                    dimensions: { type: Type.STRING },
                    activationFunction: { type: Type.STRING },
                    description: { type: Type.STRING },
                    details: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['id', 'name', 'role', 'nodesCount', 'description']
                }
              },
              mathFormulas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    expression: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ['title', 'expression', 'description']
                }
              },
              keyHighlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['title', 'subtitle', 'category', 'badge', 'summary', 'architectureBreakdown', 'mathFormulas', 'keyHighlights']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      const validCategory = ['dnn', 'cnn', 'transformer', 'llm'].includes(parsed.category) ? parsed.category : preferredCategory;

      res.json({
        id: 'custom-' + Date.now(),
        title: parsed.title || prompt,
        subtitle: parsed.subtitle || 'Custom Architecture',
        category: validCategory,
        badge: parsed.badge || 'AI Architecture',
        summary: parsed.summary || `Exploration of ${prompt}`,
        architectureBreakdown: parsed.architectureBreakdown || [],
        mathFormulas: parsed.mathFormulas || [],
        keyHighlights: parsed.keyHighlights || ['Interactive 3D layer visualization'],
        parameters: [
          { label: 'Layer Depth Scale', key: 'depthScale', value: 1.5, min: 0.5, max: 3.0, step: 0.1 },
          { label: 'Signal Flow Speed', key: 'flowSpeed', value: 1.0, min: 0.2, max: 2.5, step: 0.1 }
        ]
      });
    } catch (err: any) {
      console.error('Error generating AI explanation:', err);
      res.status(500).json({ error: 'Failed to generate concept analysis' });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
