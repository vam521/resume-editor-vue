import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface ResumeSection {
  id: string
  type: 'personal' | 'education' | 'work' | 'project' | 'skill' | 'summary'
  title: string
  content: any // 可以是富文本内容或结构化数据
  order: number
}

export interface ResumeTemplate {
  id: string
  name: string
  category: 'modern' | 'classic' | 'creative'
  industry: 'tech' | 'finance' | 'design' | 'general'
  thumbnail: string // 图片URL或路径
  description: string
}

export const useResumeStore = defineStore('resume', () => {
  // 当前选择的模板
  const selectedTemplate = ref<ResumeTemplate | null>(null)
  
  // 简历内容部分
  const sections = ref<ResumeSection[]>([
    {
      id: 'personal',
      type: 'personal',
      title: '个人信息',
      content: {
        name: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        avatar: '',
        jobIntent: ''
      },
      order: 0
    },
    {
      id: 'summary',
      type: 'summary',
      title: '个人简介',
      content: '',
      order: 1
    },
    {
      id: 'education',
      type: 'education',
      title: '教育背景',
      content: [],
      order: 2
    },
    {
      id: 'work',
      type: 'work',
      title: '工作经历',
      content: [],
      order: 3
    },
    {
      id: 'project',
      type: 'project',
      title: '项目经验',
      content: [],
      order: 4
    },
    {
      id: 'skill',
      type: 'skill',
      title: '技能专长',
      content: [],
      order: 5
    }
  ])

  // 模板库
  const templates = ref<ResumeTemplate[]>([
    {
      id: 'modern-tech',
      name: '现代科技风',
      category: 'modern',
      industry: 'tech',
      thumbnail: '/assets/templates/modern-tech.jpg',
      description: '简洁现代的科技行业简历模板'
    },
    {
      id: 'classic-finance',
      name: '经典金融风',
      category: 'classic',
      industry: 'finance',
      thumbnail: '/assets/templates/classic-finance.jpg',
      description: '专业稳重的金融行业简历模板'
    },
    {
      id: 'creative-design',
      name: '创意设计风',
      category: 'creative',
      industry: 'design',
      thumbnail: '/assets/templates/creative-design.jpg',
      description: '富有创意的设计行业简历模板'
    },
    {
      id: 'general-classic',
      name: '通用经典款',
      category: 'classic',
      industry: 'general',
      thumbnail: '/assets/templates/general-classic.jpg',
      description: '适合各行各业的经典简历模板'
    }
  ])

  // 计算属性：排序后的部分
  const sortedSections = computed(() => {
    return sections.value.slice().sort((a, b) => a.order - b.order)
  })

  // 操作：选择模板
  const selectTemplate = (template: ResumeTemplate) => {
    selectedTemplate.value = template
  }

  // 操作：更新部分内容
  const updateSectionContent = (sectionId: string, content: any) => {
    const section = sections.value.find(s => s.id === sectionId)
    if (section) {
      section.content = content
    }
  }

  // 操作：添加新部分
  const addSection = (type: ResumeSection['type'], title: string) => {
    const newSection: ResumeSection = {
      id: `${type}-${Date.now()}`,
      type,
      title,
      content: type === 'personal' ? {
        name: '',
        email: '',
        phone: '',
        location: '',
        website: ''
      } : type === 'summary' ? '' : [],
      order: sections.value.length
    }
    sections.value.push(newSection)
  }

  // 操作：删除部分
  const removeSection = (sectionId: string) => {
    const index = sections.value.findIndex(s => s.id === sectionId)
    if (index !== -1) {
      sections.value.splice(index, 1)
      // 重新排序剩余部分
      sections.value.forEach((section, idx) => {
        section.order = idx
      })
    }
  }

  // 操作：重新排序部分
  const reorderSections = (newOrder: string[]) => {
    newOrder.forEach((sectionId, index) => {
      const section = sections.value.find(s => s.id === sectionId)
      if (section) {
        section.order = index
      }
    })
  }

  // 操作：重置简历
  const resetResume = () => {
    sections.value = sections.value.map(section => ({
      ...section,
      content: section.type === 'personal' ? {
        name: '',
        email: '',
        phone: '',
        location: '',
        website: ''
      } : section.type === 'summary' ? '' : []
    }))
  }

  // 操作：导出简历数据
  const exportData = () => {
    return {
      template: selectedTemplate.value,
      sections: sortedSections.value,
      lastUpdated: new Date().toISOString()
    }
  }

  // 操作：导入简历数据
  const importData = (data: any) => {
    if (data.template) selectedTemplate.value = data.template
    if (data.sections) sections.value = data.sections
  }

  // 自动保存功能
  const STORAGE_KEY = 'resume_builder_data'
  
  // 从本地存储加载数据
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.template) selectedTemplate.value = data.template
        if (data.sections) sections.value = data.sections
      }
    } catch (error) {
      console.error('加载保存的数据失败:', error)
    }
  }

  // 保存数据到本地存储
  const saveToStorage = () => {
    try {
      const data = {
        template: selectedTemplate.value,
        sections: sections.value,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('保存数据失败:', error)
    }
  }

  // 保存草稿（手动）
  const saveDraft = () => {
    saveToStorage()
    return true
  }

  // 清除草稿
  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('清除草稿失败:', error)
    }
  }

  // 获取草稿信息
  const getDraftInfo = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        return parsed.lastSaved ? new Date(parsed.lastSaved) : null
      }
    } catch (error) {
      console.error('获取草稿信息失败:', error)
    }
    return null
  }

  // 初始化时加载数据
  loadFromStorage()

  // 监听变化并自动保存（防抖）
  let saveTimeout: number
  watch([selectedTemplate, sections], () => {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(saveToStorage, 1000)
  }, { deep: true })

  return {
    selectedTemplate,
    sections,
    templates,
    sortedSections,
    selectTemplate,
    updateSectionContent,
    addSection,
    removeSection,
    reorderSections,
    resetResume,
    exportData,
    importData,
    saveDraft,
    clearDraft,
    getDraftInfo,
    loadFromStorage
  }
})