// pages/api/prodia.js
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI API with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || '' });

export async function POST(req) {
  const { prompt } = await req.json();

  // Check if API key is available
  if (!process.env.GOOGLE_API_KEY) {
    console.error("Google API key missing! Add it to your environment variables.");
    return NextResponse.json({ 
      error: 'Google API key missing', 
      details: 'Please add GOOGLE_API_KEY to your environment variables.' 
    }, { status: 500 });
  }

  try {
    // Before attempting image generation, check if we've exceeded our retry attempts
    const currentAttempts = parseInt(req.cookies?.get('image_gen_attempts')?.value || '0');
    const lastAttemptTime = parseInt(req.cookies?.get('last_attempt_time')?.value || '0');
    const currentTime = Date.now();
    
    // If we've made attempts recently, enforce a cooldown period
    if (currentAttempts > 3 && (currentTime - lastAttemptTime) < 60000) {  // 1 minute cooldown
      return NextResponse.json({
        error: 'Too Many Requests',
        message: 'Please wait before generating another image.',
        retryAfter: '60 seconds',
        details: 'To avoid API rate limits, we\'ve added a cooldown period between requests.'
      }, { status: 429 });
    }

    // Try the Imagen model for image generation
    try {
      const result = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
        }
      });
      
      console.log('API Response structure:', JSON.stringify(result, null, 2));
      
      // Handle the Imagen response structure
      if (!result || !result.generatedImages || result.generatedImages.length === 0) {
        throw new Error('No images were generated');
      }

      // Extract the image from the Imagen response format
      const generatedImage = result.generatedImages[0];
      if (!generatedImage || !generatedImage.image || !generatedImage.image.imageBytes) {
        throw new Error('Invalid image data in response');
      }
      
      const base64 = generatedImage.image.imageBytes;
      const mimeType = 'image/png'; // Imagen typically returns PNGs
      
      return NextResponse.json({ 
        image: `data:${mimeType};base64,${base64}`
      });
    } catch (imagenError) {
      console.error('Imagen generation failed:', imagenError);
      
      // Check if this is a rate limit error
      if (imagenError.toString().includes('429 Too Many Requests')) {
        throw imagenError; // Let the outer catch block handle rate limiting
      }
      
      // Try Gemini model as fallback
      try {
        console.log('Attempting fallback to Gemini model...');
        
        // Use Gemini model as fallback
        const geminiResult = await ai.models.generateContent({
          model: 'gemini-1.5-pro', // Try a more stable model
          contents: [{ text: `Generate an image of: ${prompt}` }],
          config: {
            responseModalities: ["TEXT", "IMAGE"],
          }
        });
        
        console.log('Fallback response structure:', JSON.stringify(geminiResult, null, 2));

        // Process all possible response structures
        const possiblePaths = [
          // Path 1: Standard candidates path
          () => geminiResult.response.candidates[0].content.parts.find(
            part => part.inlineData && part.inlineData.mimeType.startsWith('image/')
          ),
          // Path 2: Direct parts in response
          () => geminiResult.response.parts.find(
            part => part.inlineData && part.inlineData.mimeType.startsWith('image/')
          ),
          // Path 3: Parts in content
          () => geminiResult.response.content.parts.find(
            part => part.inlineData && part.inlineData.mimeType.startsWith('image/')
          ),
          // Path 4: Media array
          () => geminiResult.response.media.find(
            media => media.mimeType.startsWith('image/')
          ),
        ];

        let imageData = null;
        for (const tryPath of possiblePaths) {
          try {
            const result = tryPath();
            if (result) {
              imageData = result.inlineData || result;
              break;
            }
          } catch (e) {
            // Just continue to the next path
            console.warn('Failed to extract image data from path:', e);
            continue;
          }
        }

        if (!imageData) {
          throw new Error('No image found in fallback response');
        }

        return NextResponse.json({ 
          image: `data:${imageData.mimeType};base64,${imageData.data}`
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        
        // Check if this is a rate limit error (429)
        if (fallbackError.toString().includes('429 Too Many Requests')) {
          throw fallbackError; // Let the outer catch block handle rate limiting
        }
        
        return NextResponse.json({
          error: 'Failed to generate image with Google Gemini',
          message: `Original error: ${imagenError.message || String(imagenError)}. Fallback error: ${fallbackError.message || String(fallbackError)}`
        }, { status: 500 });
      }
    }
    
  } catch (error) {
    console.error('Error during image generation:', error);
    
    // Check if this is a rate limit error (429)
    if (error.toString().includes('429 Too Many Requests')) {
      // Prepare response with clearer information
      const response = NextResponse.json({
        error: 'API Rate Limit Reached',
        message: 'The Google AI API rate limit has been reached. This is common with free API keys.',
        suggestion: 'You can try again later or consider upgrading to a paid plan for higher quotas.',
        retryAfter: extractRetryDelay(error.toString()) || '60 seconds',
        details: 'For more information, visit https://ai.google.dev/gemini-api/docs/rate-limits'
      }, { status: 429 });
      
      // Set cookies to track attempts and implement exponential backoff
      response.cookies.set({
        name: 'image_gen_attempts',
        value: String(parseInt(req.cookies?.get('image_gen_attempts')?.value || '0') + 1),
        maxAge: 3600, // 1 hour expiry
        path: '/'
      });
      
      response.cookies.set({
        name: 'last_attempt_time',
        value: String(Date.now()),
        maxAge: 3600, // 1 hour expiry
        path: '/'
      });
      
      return response;
    }
    
    return NextResponse.json({
      error: 'Failed to generate image with Google Gemini',
      message: error.message || String(error),
      suggestion: 'Please try a different prompt or try again later when API quotas refresh.'
    }, { status: 500 });
  }
}

// Helper function to extract retry delay from error message
function extractRetryDelay(errorString) {
  const retryMatch = errorString.match(/retryDelay":"([^"]+)"/);
  return retryMatch ? retryMatch[1] : null;
}