import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Env, ApiResponse } from '../../types';

const i2iRouter = new Hono<{ Bindings: Env }>();

// I2I 轉換請求驗證 schema
const TransformRequestSchema = z.object({
  image: z.string().min(1, 'Base64 image data required'),
  prompt: z.string().min(1, 'Transformation prompt is required'),
  sessionId: z.string().optional(),
  maxIterations: z.number().min(1).max(5).optional().default(3),
});

// Google Gemini API 集成類 (基於官方文檔)
class GoogleGeminiIntegration {
  private paidApiKey: string;
  private freeApiKey: string;
  private imageGenModel: string = 'gemini-2.5-flash-image'; // 用於圖片生成
  private visionModel: string = 'gemini-1.5-flash'; // 用於圖片分析和文字生成

  constructor(paidKey: string, freeKey: string) {
    this.paidApiKey = paidKey;
    this.freeApiKey = freeKey || paidKey; // fallback 到付費 key
  }

  // 使用免費模型分析輸入圖片
  async analyzeImage(imageBase64: string): Promise<string> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.visionModel}:generateContent?key=${this.freeApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Analyze this image in detail. Describe the style, composition, colors, objects, and artistic elements. This will be used for image transformation." },
              { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
            ]
          }]
        })
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`Gemini API Error: ${result.error?.message || 'Unknown error'}`);
      }
      
      return result.candidates[0]?.content?.parts[0]?.text || "Unable to analyze image";
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw new Error('Failed to analyze image with Gemini');
    }
  }

  // 使用付費模型進行圖片到圖片的轉換生成
  async generateImageFromImageAndText(inputImageBase64: string, transformPrompt: string): Promise<string> {
    try {
      // 根據官方文檔：圖片 + 文字生成圖片 (編輯)
      const fullPrompt = `Transform this image: ${transformPrompt}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.imageGenModel}:generateContent?key=${this.paidApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: fullPrompt },
              { inline_data: { mime_type: "image/jpeg", data: inputImageBase64 } }
            ]
          }]
        })
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`Gemini Image Generation Error: ${result.error?.message || 'Unknown error'}`);
      }
      
      // 查找返回的圖片數據
      for (const part of result.candidates[0]?.content?.parts || []) {
        if (part.inline_data && part.inline_data.mime_type.startsWith('image/')) {
          return part.inline_data.data; // 返回 base64 圖片數據
        }
      }
      
      throw new Error('No image data returned from Gemini');
    } catch (error) {
      console.error('Image generation failed:', error);
      throw new Error('Failed to generate image with Gemini');
    }
  }

  // 使用免費模型評估生成的圖片
  async evaluateGeneratedImage(originalPrompt: string, generatedImageBase64: string, originalImageBase64: string): Promise<{score: number, feedback: string, suggestions: string}> {
    try {
      const evaluationPrompt = `
        Original transformation request: "${originalPrompt}"
        
        Compare the original image with the generated result. Evaluate:
        1. How well the transformation matches the request (1-10)
        2. Quality and artistic merit of the result (1-10)
        3. Preservation of important elements from original (1-10)
        
        Provide response as JSON format:
        {
          "score": overall_score_1_to_10,
          "feedback": "what works well and what doesn't",
          "suggestions": "specific improvements for next iteration"
        }
      `;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.visionModel}:generateContent?key=${this.freeApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: evaluationPrompt },
              { inline_data: { mime_type: "image/jpeg", data: originalImageBase64 } },
              { inline_data: { mime_type: "image/jpeg", data: generatedImageBase64 } }
            ]
          }]
        })
      });
      
      const result = await response.json();
      const responseText = result.candidates[0]?.content?.parts[0]?.text || '{}';
      
      try {
        const evaluation = JSON.parse(responseText.replace(/```json\n?|```/g, '').trim());
        return {
          score: evaluation.score || 5,
          feedback: evaluation.feedback || "No specific feedback available",
          suggestions: evaluation.suggestions || "No suggestions available"
        };
      } catch (parseError) {
        // 如果 JSON 解析失敗，嘗試從文本中提取信息
        return {
          score: 5,
          feedback: responseText.substring(0, 200),
          suggestions: "Continue with current approach"
        };
      }
    } catch (error) {
      console.error('Image evaluation failed:', error);
      return {
        score: 5,
        feedback: "Evaluation failed due to API error",
        suggestions: "Try adjusting the prompt for better results"
      };
    }
  }

  // 使用免費模型根據反饋改進 prompt
  async improvePrompt(originalPrompt: string, imageAnalysis: string, feedback: string, suggestions: string): Promise<string> {
    try {
      const improvementPrompt = `
        Original image transformation prompt: "${originalPrompt}"
        Image analysis: ${imageAnalysis}
        Previous result feedback: ${feedback}
        Improvement suggestions: ${suggestions}
        
        Create an improved transformation prompt that:
        1. Addresses the suggestions
        2. Maintains the core transformation goal
        3. Is more specific and detailed
        4. Leverages the image analysis for better context
        
        Return only the improved prompt text, no additional formatting or explanation.
      `;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.visionModel}:generateContent?key=${this.freeApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: improvementPrompt }] }]
        })
      });
      
      const result = await response.json();
      const improvedPrompt = result.candidates[0]?.content?.parts[0]?.text?.trim();
      
      return improvedPrompt || originalPrompt; // fallback 到原始 prompt
    } catch (error) {
      console.error('Prompt improvement failed:', error);
      return originalPrompt;
    }
  }

  // 輔助方法：從環境變數獲取API密鑰
  static async getApiKeysFromEnv(env: any): Promise<{paidKey: string, freeKey: string}> {
    // 從 D1 數據庫獲取加密的 API 金鑰
    // 這裡需要實現解密邏輯
    const paidKey = env.GOOGLE_AI_API_KEY_PRIMARY || env.PAID_API_KEY || '';
    const freeKey = env.GOOGLE_AI_API_KEY_SECONDARY || env.FREE_API_KEY || paidKey;
    
    if (!paidKey) {
      throw new Error('Google AI API keys not configured');
    }
    
    return { paidKey, freeKey };
  }
}

// GET /api/i2i/health - I2I 服務健康檢查
i2iRouter.get('/health', (c) => {
  return c.json<ApiResponse>({
    success: true,
    message: 'I2I service is running with Google Gemini integration',
    data: {
      environment: c.env?.ENVIRONMENT || 'development',
      timestamp: new Date().toISOString(),
      supportedModels: ['gemini-2.5-flash-image', 'gemini-1.5-flash']
    }
  });
});

// POST /api/i2i/transform - 執行 I2I 轉換 (完整的迭代流程)
i2iRouter.post('/transform', 
  zValidator('json', TransformRequestSchema),
  async (c) => {
    try {
      const { image, prompt, sessionId, maxIterations } = c.req.valid('json');
      
      // 獲取 API 密鑰
      const { paidKey, freeKey } = await GoogleGeminiIntegration.getApiKeysFromEnv(c.env);
      const gemini = new GoogleGeminiIntegration(paidKey, freeKey);
      
      const transformationId = `transform_${Date.now()}`;
      const actualSessionId = sessionId || `session_${Date.now()}`;
      
      // Step 1: 分析輸入圖片
      console.log('Step 1: Analyzing input image...');
      const imageAnalysis = await gemini.analyzeImage(image);
      
      let currentPrompt = prompt;
      let bestResult = null;
      let bestScore = 0;
      
      // 迭代改進循環
      for (let iteration = 1; iteration <= maxIterations; iteration++) {
        console.log(`Step ${iteration + 1}: Generating image with prompt: "${currentPrompt}"`);
        
        // Step 2: 生成圖片
        const generatedImage = await gemini.generateImageFromImageAndText(image, currentPrompt);
        
        // Step 3: 評估結果
        console.log(`Step ${iteration + 2}: Evaluating generated image...`);
        const evaluation = await gemini.evaluateGeneratedImage(prompt, generatedImage, image);
        
        // 如果這是最好的結果，保存它
        if (evaluation.score > bestScore) {
          bestScore = evaluation.score;
          bestResult = {
            generatedImage,
            prompt: currentPrompt,
            evaluation,
            iteration
          };
        }
        
        // 如果分數已經很高或者是最後一次迭代，停止
        if (evaluation.score >= 8 || iteration === maxIterations) {
          break;
        }
        
        // Step 4: 改進 prompt 進行下一次迭代
        console.log(`Step ${iteration + 3}: Improving prompt based on feedback...`);
        currentPrompt = await gemini.improvePrompt(prompt, imageAnalysis, evaluation.feedback, evaluation.suggestions);
      }
      
      // 返回最佳結果
      const result = {
        transformationId,
        sessionId: actualSessionId,
        status: 'completed',
        originalPrompt: prompt,
        finalPrompt: bestResult?.prompt || currentPrompt,
        generatedImageBase64: bestResult?.generatedImage,
        imageAnalysis,
        finalScore: bestResult?.evaluation.score || 0,
        finalFeedback: bestResult?.evaluation.feedback,
        iterationsCompleted: bestResult?.iteration || maxIterations,
        maxIterations,
        processingTimeMs: Date.now() - parseInt(transformationId.replace('transform_', '')),
        createdAt: new Date().toISOString()
      };

      return c.json<ApiResponse>({
        success: true,
        message: 'I2I transformation completed successfully',
        data: result
      });

    } catch (error: any) {
      console.error('I2I Transform Error:', error);
      return c.json<ApiResponse>({
        success: false,
        message: error?.message || 'I2I transformation failed',
        data: null,
      }, 500);
    }
  }
);

// GET /api/i2i/models - 獲取可用的模型信息
i2iRouter.get('/models', (c) => {
  return c.json<ApiResponse>({
    success: true,
    message: 'Available Gemini models for I2I',
    data: {
      imageGeneration: {
        model: 'gemini-2.5-flash-image',
        capabilities: ['text-to-image', 'image-to-image', 'image-editing'],
        costTier: 'paid'
      },
      vision: {
        model: 'gemini-1.5-flash', 
        capabilities: ['image-analysis', 'text-generation', 'evaluation'],
        costTier: 'free'
      }
    }
  });
});

export { i2iRouter };