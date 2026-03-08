import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface AISettings {
  provider: 'openai' | 'anthropic' | 'custom'
  apiKey: string
  baseUrl: string
  model: string
  enabled: boolean
}

const STORAGE_KEY = 'resume-ai-settings'

export const useAISettingsStore = defineStore('ai-settings', () => {
  const settings = ref<AISettings>({
    provider: 'openai',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-3.5-turbo',
    enabled: false
  })

  const loadFromStorage = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        settings.value = { ...settings.value, ...parsed }
      }
    } catch (error) {
      console.error('加载AI设置失败:', error)
    }
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    } catch (error) {
      console.error('保存AI设置失败:', error)
    }
  }

  const updateSettings = (newSettings: Partial<AISettings>) => {
    Object.assign(settings.value, newSettings)
    saveToStorage()
  }

  const testConnection = async (): Promise<boolean> => {
    if (!settings.value.apiKey) {
      return false
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      if (settings.value.provider === 'openai') {
        headers['Authorization'] = `Bearer ${settings.value.apiKey}`
      }

      const response = await fetch(`${settings.value.baseUrl}/models`, {
        method: 'GET',
        headers
      })

      return response.ok
    } catch (error) {
      console.error('AI连接测试失败:', error)
      return false
    }
  }

  loadFromStorage()

  watch(settings, saveToStorage, { deep: true })

  return {
    settings,
    updateSettings,
    testConnection,
    loadFromStorage
  }
})
