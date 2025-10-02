import OpenAI from 'openai';
import { AppError } from '../utils/errors.js';

export interface GenerateRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LlmClient {
  generate(request: GenerateRequest): Promise<string>;
}

export class OpenAiClient implements LlmClient {
  private client: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new AppError('OpenAI API key missing', 'OPENAI_KEY_MISSING');
    }
    this.client = new OpenAI({ apiKey });
  }

  async generate({ prompt, systemPrompt, temperature = 0.7, maxTokens = 800 }: GenerateRequest) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature,
      max_tokens: maxTokens,
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
    });
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new AppError('Empty completion from OpenAI', 'OPENAI_EMPTY_RESPONSE');
    }
    return content;
  }
}
