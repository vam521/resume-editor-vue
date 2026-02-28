<template>
  <div class="template-library">
    <div class="template-filters">
      <el-radio-group v-model="filter.category" size="small">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="modern">现代</el-radio-button>
        <el-radio-button label="classic">经典</el-radio-button>
        <el-radio-button label="creative">创意</el-radio-button>
      </el-radio-group>
      
      <el-radio-group v-model="filter.industry" size="small" style="margin-left: 16px;">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="tech">科技</el-radio-button>
        <el-radio-button label="finance">金融</el-radio-button>
        <el-radio-button label="design">设计</el-radio-button>
        <el-radio-button label="general">通用</el-radio-button>
      </el-radio-group>
    </div>

    <div class="template-grid">
      <el-card
        v-for="template in filteredTemplates"
        :key="template.id"
        class="template-card"
        :class="{ 'selected': isSelected(template) }"
        @click="handleSelectTemplate(template)"
      >
        <div class="template-thumbnail">
          <div class="thumbnail-placeholder">
            <el-icon :size="48" color="#909399">
              <Picture />
            </el-icon>
            <span class="thumbnail-text">{{ template.name }}</span>
          </div>
        </div>
        <div class="template-info">
          <h4>{{ template.name }}</h4>
          <p class="template-description">{{ template.description }}</p>
          <div class="template-tags">
            <el-tag size="small" :type="getCategoryType(template.category)">
              {{ getCategoryLabel(template.category) }}
            </el-tag>
            <el-tag size="small" type="info">
              {{ getIndustryLabel(template.industry) }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <div class="selected-template-info" v-if="selectedTemplate">
      <h4>已选模板：{{ selectedTemplate.name }}</h4>
      <p>{{ selectedTemplate.description }}</p>
      <el-button type="primary" size="small" @click="applyTemplate">
        应用此模板
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { useResumeStore, type ResumeTemplate } from '@/store/resume'
import { ElMessage } from 'element-plus'

const resumeStore = useResumeStore()

const filter = ref({
  category: 'all',
  industry: 'all'
})

const filteredTemplates = computed(() => {
  return resumeStore.templates.filter(template => {
    const categoryMatch = filter.value.category === 'all' || template.category === filter.value.category
    const industryMatch = filter.value.industry === 'all' || template.industry === filter.value.industry
    return categoryMatch && industryMatch
  })
})

const selectedTemplate = computed(() => resumeStore.selectedTemplate)

const isSelected = (template: ResumeTemplate) => {
  return selectedTemplate.value?.id === template.id
}

const handleSelectTemplate = (template: ResumeTemplate) => {
  resumeStore.selectTemplate(template)
}

const applyTemplate = () => {
  // 应用模板逻辑，可能需要更新预览样式
  ElMessage.success(`已应用模板：${selectedTemplate.value?.name}`)
}

const getCategoryType = (category: string) => {
  switch (category) {
    case 'modern': return 'success'
    case 'classic': return 'warning'
    case 'creative': return 'danger'
    default: return 'info'
  }
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'modern': return '现代'
    case 'classic': return '经典'
    case 'creative': return '创意'
    default: return category
  }
}

const getIndustryLabel = (industry: string) => {
  switch (industry) {
    case 'tech': return '科技'
    case 'finance': return '金融'
    case 'design': return '设计'
    case 'general': return '通用'
    default: return industry
  }
}
</script>

<style scoped>
.template-library {
  padding: 16px;
}

.template-filters {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.template-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  border-radius: 10px;
  overflow: hidden;
}

.template-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.2);
}

.template-card.selected {
  border-color: #409eff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
}

.template-thumbnail {
  height: 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px 8px 0 0;
}

.thumbnail-placeholder {
  text-align: center;
  color: white;
}

.thumbnail-text {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}

.template-info {
  padding: 12px;
}

.template-info h4 {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.template-description {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.template-tags {
  display: flex;
  gap: 6px;
}

.selected-template-info {
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
}

.selected-template-info h4 {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
}

.selected-template-info p {
  margin: 0 0 12px 0;
  font-size: 13px;
  opacity: 0.9;
}

.selected-template-info .el-button {
  background: white;
  color: #667eea;
  border: none;
  font-weight: 500;
}

.selected-template-info .el-button:hover {
  background: #f0f0f0;
}
</style>