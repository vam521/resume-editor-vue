<template>
  <div class="resume-preview" :class="templateClass" ref="previewRef">
    <div class="resume-page">
      <!-- 现代风格模板 -->
      <div v-if="isModernTemplate" class="modern-template">
        <header class="modern-header">
          <div class="personal-info" :class="{ 'has-avatar': personalInfo.avatar }">
            <img v-if="personalInfo.avatar" :src="personalInfo.avatar" class="avatar" />
            <div class="info-content">
              <h1>{{ personalInfo.name || '姓名' }}</h1>
              <div v-if="personalInfo.jobIntent" class="job-intent">{{ personalInfo.jobIntent }}</div>
              <div class="contact-info">
                <span v-if="personalInfo.email">
                  <el-icon><Message /></el-icon>
                  {{ personalInfo.email }}
                </span>
                <span v-if="personalInfo.phone">
                  <el-icon><Phone /></el-icon>
                  {{ personalInfo.phone }}
                </span>
                <span v-if="personalInfo.location">
                  <el-icon><Location /></el-icon>
                  {{ personalInfo.location }}
                </span>
                <span v-if="personalInfo.website">
                  <el-icon><Link /></el-icon>
                  {{ personalInfo.website }}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div class="modern-sections">
          <section v-for="section in visibleSections" :key="section.id" class="modern-section">
            <h2 class="section-title">{{ section.title }}</h2>
            <div class="section-content">
              <div v-if="section.type === 'education'">
                <div v-for="(edu, index) in section.content" :key="index" class="education-item">
                  <div class="education-header">
                    <h3>{{ edu.school }}</h3>
                    <span class="education-date">{{ formatDateRange(edu.dateRange) }}</span>
                  </div>
                  <div class="education-details">
                    <span class="degree">{{ edu.degree }} · {{ edu.major }}</span>
                  </div>
                  <div v-if="edu.description" class="education-description" v-html="edu.description" />
                </div>
              </div>

              <div v-else-if="section.type === 'work'">
                <div v-for="(work, index) in section.content" :key="index" class="work-item">
                  <div class="work-header">
                    <h3>{{ work.company }}</h3>
                    <span class="work-date">{{ formatDateRange(work.dateRange) }}</span>
                  </div>
                  <div class="work-position">{{ work.position }}</div>
                  <div v-if="work.description" class="work-description" v-html="work.description" />
                </div>
              </div>

              <div v-else-if="section.type === 'project'">
                <div v-for="(project, index) in section.content" :key="index" class="project-item">
                  <div class="project-header">
                    <h3>{{ project.name }}</h3>
                    <span class="project-date">{{ formatDateRange(project.dateRange) }}</span>
                  </div>
                  <div class="project-role">{{ project.role }}</div>
                  <div v-if="project.description" class="project-description" v-html="project.description" />
                  <div v-if="project.technologies && project.technologies.length" class="project-technologies">
                    <span class="tech-label">技术栈：</span>
                    <el-tag
                      v-for="(tech, techIndex) in project.technologies"
                      :key="techIndex"
                      size="small"
                      class="tech-tag"
                    >
                      {{ tech }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <div v-else-if="section.type === 'skill'">
                <div v-for="(skillGroup, index) in section.content" :key="index" class="skill-group">
                  <h3>{{ skillGroup.category }}</h3>
                  <div class="skill-tags">
                    <el-tag
                      v-for="(skill, skillIndex) in skillGroup.skills"
                      :key="skillIndex"
                      size="small"
                      class="skill-tag"
                    >
                      {{ skill }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <div v-else-if="section.type === 'summary'" class="summary-content" v-html="section.content" />
            </div>
          </section>
        </div>
      </div>

      <!-- 经典风格模板 -->
      <div v-else-if="selectedTemplate?.category === 'classic'" class="classic-template">
        <div class="classic-header">
          <div class="classic-personal">
            <h1>{{ personalInfo.name || '姓名' }}</h1>
            <div v-if="personalInfo.jobIntent" class="classic-job-intent">{{ personalInfo.jobIntent }}</div>
            <div class="classic-contact">
              <div v-if="personalInfo.email" class="contact-item">
                <el-icon><Message /></el-icon>
                <span>{{ personalInfo.email }}</span>
              </div>
              <div v-if="personalInfo.phone" class="contact-item">
                <el-icon><Phone /></el-icon>
                <span>{{ personalInfo.phone }}</span>
              </div>
              <div v-if="personalInfo.location" class="contact-item">
                <el-icon><Location /></el-icon>
                <span>{{ personalInfo.location }}</span>
              </div>
              <div v-if="personalInfo.website" class="contact-item">
                <el-icon><Link /></el-icon>
                <span>{{ personalInfo.website }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="classic-body">
          <div v-for="section in visibleSections" :key="section.id" class="classic-section">
            <h2 class="classic-section-title">
              <span class="title-text">{{ section.title }}</span>
              <span class="title-line"></span>
            </h2>
            <div class="classic-section-content">
              <!-- 内容渲染与上面类似，省略以节省空间 -->
              <div v-if="section.type === 'education'">
                <div v-for="(edu, index) in section.content" :key="index" class="classic-item">
                  <div class="classic-item-header">
                    <h3>{{ edu.school }}</h3>
                    <span class="classic-date">{{ formatDateRange(edu.dateRange) }}</span>
                  </div>
                  <div class="classic-item-subtitle">{{ edu.degree }} - {{ edu.major }}</div>
                  <div v-if="edu.description" class="classic-item-description" v-html="edu.description" />
                </div>
              </div>
              <!-- 其他部分类似 -->
            </div>
          </div>
        </div>
      </div>

      <!-- 创意风格模板 -->
      <div v-else class="creative-template">
        <!-- 创意模板设计，省略以节省空间 -->
        <div class="creative-layout">
          <div class="creative-left">
            <div class="creative-personal">
              <h1>{{ personalInfo.name || '姓名' }}</h1>
              <div class="creative-contact">
                <!-- 联系信息 -->
              </div>
            </div>
            <!-- 技能部分 -->
          </div>
          <div class="creative-right">
            <!-- 工作经历、教育背景等 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Message, Phone, Location, Link } from '@element-plus/icons-vue'
import { useResumeStore } from '@/store/resume'

const previewRef = ref<HTMLElement>()
const resumeStore = useResumeStore()

const selectedTemplate = computed(() => resumeStore.selectedTemplate)
const sortedSections = computed(() => resumeStore.sortedSections)

const personalInfo = computed(() => {
  const personalSection = sortedSections.value.find(s => s.type === 'personal')
  return personalSection ? personalSection.content : {}
})

const visibleSections = computed(() => {
  return sortedSections.value.filter(section => {
    if (section.type === 'personal') return false
    if (Array.isArray(section.content)) {
      return section.content.length > 0
    }
    return section.content && section.content.toString().trim().length > 0
  })
})

const templateClass = computed(() => {
  if (!selectedTemplate.value) return 'template-default'
  return `template-${selectedTemplate.value.category}`
})

const isModernTemplate = computed(() => {
  return !selectedTemplate.value || selectedTemplate.value.category === 'modern'
})



const formatDateRange = (dateRange: any) => {
  if (!dateRange || !Array.isArray(dateRange) || dateRange.length !== 2) {
    return ''
  }
  const [start, end] = dateRange
  if (!start) return ''
  if (!end) return `${start} - 至今`
  return `${start} - ${end}`
}

// 导出PDF时获取HTML内容
const getHtmlContent = () => {
  return previewRef.value?.innerHTML || ''
}

defineExpose({
  getHtmlContent
})
</script>

<style scoped>
.resume-preview {
  background-color: white;
  color: #333;
  font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
  line-height: 1.5;
  min-height: 100%;
}

.resume-page {
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
}

/* 现代模板样式 */
.modern-template .modern-header {
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 2px solid #667eea;
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  padding: 16px 24px;
  margin: -30px -30px 20px -30px;
  border-radius: 4px 4px 0 0;
}

.modern-template .personal-info {
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-end;
  text-align: right;
}

.modern-template .personal-info.has-avatar {
  justify-content: flex-start;
}

.modern-template .personal-info.has-avatar .info-content {
  flex: 1;
  text-align: left;
}

.modern-template .personal-info .avatar {
  width: 60px;
  height: 70px;
  border-radius: 4px;
  object-fit: cover;
  border: 2px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modern-template .personal-info h1 {
  margin: 0 0 6px 0;
  font-size: 26px;
  font-weight: 700;
  color: #303133;
  letter-spacing: 1px;
}

.modern-template .job-intent {
  color: #667eea;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.modern-template .contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: #606266;
  font-size: 13px;
}

.modern-template .contact-info span {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 12px;
}

.modern-template .contact-info .el-icon {
  color: #667eea;
  font-weight: 600;
}

.modern-template .modern-section {
  margin-bottom: 16px;
}

.modern-template .section-title {
  font-size: 15px;
  font-weight: 600;
  color: #667eea;
  margin: 0 0 12px 0;
  padding-bottom: 6px;
  border-bottom: 1px solid #e8e8e8;
  position: relative;
  padding-left: 16px;
}

.modern-template .section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.modern-template .education-item,
.modern-template .work-item,
.modern-template .project-item {
  margin-bottom: 12px;
  padding: 12px;
  background: #fafbfc;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.modern-template .education-header,
.modern-template .work-header,
.modern-template .project-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.modern-template .education-header h3,
.modern-template .work-header h3,
.modern-template .project-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.modern-template .education-date,
.modern-template .work-date,
.modern-template .project-date {
  color: #667eea;
  font-size: 13px;
  font-weight: 500;
  background: #f0f4ff;
  padding: 1px 8px;
  border-radius: 10px;
}

.modern-template .education-details,
.modern-template .work-position,
.modern-template .project-role {
  color: #606266;
  margin-bottom: 6px;
  font-size: 13px;
}

.modern-template .education-description,
.modern-template .work-description,
.modern-template .project-description {
  color: #505050;
  font-size: 13px;
  line-height: 1.6;
}

.modern-template .work-description {
  padding-left: 10px;
}

.modern-template .project-technologies {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e8e8e8;
}

.modern-template .tech-label {
  font-size: 13px;
  color: #909399;
  margin-right: 6px;
  font-weight: 500;
}

.modern-template .tech-tag {
  margin-right: 6px;
  margin-bottom: 4px;
  border-radius: 4px;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  color: #667eea;
  border: none;
  font-size: 11px;
  font-weight: 500;
}

.modern-template .skill-group {
  margin-bottom: 10px;
  padding: 10px;
  background: #fafbfc;
  border-radius: 6px;
}

.modern-template .skill-group h3 {
  margin: 0 0 6px 0;
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
}

.modern-template .skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.modern-template .skill-tag {
  margin: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 500;
}

.modern-template .summary-content {
  color: #505050;
  line-height: 1.7;
  font-size: 13px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

/* 经典模板样式 */
.classic-template .classic-header {
  text-align: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #dcdfe6;
}

.classic-template .classic-personal h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #303133;
  letter-spacing: 1px;
}

.classic-template .classic-job-intent {
  text-align: center;
  color: #409eff;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.classic-template .classic-contact {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  color: #606266;
  font-size: 13px;
}

.classic-template .contact-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.classic-template .classic-section {
  margin-bottom: 14px;
}

.classic-template .classic-section-title {
  display: flex;
  align-items: center;
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.classic-template .title-text {
  padding-right: 16px;
  background-color: white;
  z-index: 1;
}

.classic-template .title-line {
  flex: 1;
  height: 1px;
  background-color: #dcdfe6;
  margin-left: -16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-page {
    padding: 20px;
  }
  
  .modern-template .contact-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .modern-template .education-header,
  .modern-template .work-header,
  .modern-template .project-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .modern-template .education-date,
  .modern-template .work-date,
  .modern-template .project-date {
    margin-top: 4px;
  }
}
</style>