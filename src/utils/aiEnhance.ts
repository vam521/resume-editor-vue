import { useAISettingsStore } from '../store/aiSettings'

export type EnhanceType = 'polish' | 'translate' | 'shorten' | 'expand'

interface EnhanceOptions {
  type: EnhanceType
  content: string
  context?: string
}

const PROMPT_TEMPLATES = {
  polish: (content: string, context?: string) => `请润色以下简历内容，使语言更加专业、简洁、有吸引力。${context ? `岗位背景：${context}` : ''}\n\n内容：\n${content}\n\n请直接返回润色后的内容，不要添加任何解释。`,

  translate: (content: string) => `请将以下中文简历内容翻译成英文，保持专业、地道的表达。\n\n内容：\n${content}\n\n请直接返回翻译后的内容，不要添加任何解释。`,

  shorten: (content: string) => `请将以下简历内容精简到原来的一半左右，保留核心信息，去除冗余表达。\n\n内容：\n${content}\n\n请直接返回精简后的内容，不要添加任何解释。`,

  expand: (content: string) => `请将以下简历内容适当扩展，使其更加丰富、具体、有说服力。\n\n内容：\n${content}\n\n请直接返回扩展后的内容，不要添加任何解释。`
}

export const useAIEnhance = () => {
  const aiStore = useAISettingsStore()
  const { settings } = storeToRefs(aiStore)

  const enhance = async ({ type, content, context }: EnhanceOptions): Promise<string> => {
    if (!settings.value.enabled || !settings.value.apiKey) {
      throw new Error('AI 功能未启用或未配置 API Key')
    }

    const prompt = PROMPT_TEMPLATES[type](content, context)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    let requestBody: any = {
      model: settings.value.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }

    if (settings.value.provider === 'openai') {
      headers['Authorization'] = `Bearer ${settings.value.apiKey}`
    } else if (settings.value.provider === 'anthropic') {
      headers['x-api-key'] = settings.value.apiKey
      headers['anthropic-version'] = '2023-06-01'
      requestBody = {
        model: settings.value.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }
    } else {
      headers['Authorization'] = `Bearer ${settings.value.apiKey}`
    }

    const url = settings.value.provider === 'anthropic'
      ? `${settings.value.baseUrl}/v1/messages`
      : `${settings.value.baseUrl}/chat/completions`

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `API 请求失败: ${response.status}`)
    }

    const data = await response.json()

    if (settings.value.provider === 'anthropic') {
      return data.content[0].text
    }

    return data.choices[0].message.content
  }

  return {
    enhance,
    isEnabled: () => settings.value.enabled && !!settings.value.apiKey
  }
}

import { storeToRefs } from 'pinia'
