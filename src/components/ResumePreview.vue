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
              <!-- 内容渲染 -->
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

              <div v-else-if="section.type === 'work'">
                <div v-for="(work, index) in section.content" :key="index" class="classic-item">
                  <div class="classic-item-header">
                    <h3>{{ work.company }}</h3>
                    <span class="classic-date">{{ formatDateRange(work.dateRange) }}</span>
                  </div>
                  <div class="classic-item-subtitle">{{ work.position }}</div>
                  <div v-if="work.description" class="classic-item-description" v-html="work.description" />
                </div>
              </div>

              <div v-else-if="section.type === 'project'">
                <div v-for="(project, index) in section.content" :key="index" class="classic-item">
                  <div class="classic-item-header">
                    <h3>{{ project.name }}</h3>
                    <span class="classic-date">{{ formatDateRange(project.dateRange) }}</span>
                  </div>
                  <div class="classic-item-subtitle">{{ project.role }}</div>
                  <div v-if="project.description" class="classic-item-description" v-html="project.description" />
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
                <div v-for="(skillGroup, index) in section.content" :key="index" class="classic-item">
                  <div class="classic-item-subtitle">{{ skillGroup.category }}</div>
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
          </div>
        </div>
      </div>

      <!-- 创意风格模板 -->
      <div v-else class="creative-template">
        <div class="creative-layout">
          <div class="creative-left">
            <div class="creative-personal">
              <img v-if="personalInfo.avatar" :src="personalInfo.avatar" class="avatar" />
              <h1>{{ personalInfo.name || '姓名' }}</h1>
              <div v-if="personalInfo.jobIntent" class="job-intent">{{ personalInfo.jobIntent }}</div>
              <div class="creative-contact">
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

            <div v-for="section in visibleSections" :key="section.id" class="creative-section-left">
              <template v-if="section.type === 'skill'">
                <h2 class="creative-section-title">{{ section.title }}</h2>
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
              </template>
            </div>
          </div>

          <div class="creative-right">
            <div v-for="section in visibleSections" :key="section.id" class="creative-section-right">
              <template v-if="section.type === 'education'">
                <h2 class="creative-section-title">{{ section.title }}</h2>
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
              </template>

              <template v-else-if="section.type === 'work'">
                <h2 class="creative-section-title">{{ section.title }}</h2>
                <div v-for="(work, index) in section.content" :key="index" class="work-item">
                  <div class="work-header">
                    <h3>{{ work.company }}</h3>
                    <span class="work-date">{{ formatDateRange(work.dateRange) }}</span>
                  </div>
                  <div class="work-position">{{ work.position }}</div>
                  <div v-if="work.description" class="work-description" v-html="work.description" />
                </div>
              </template>

              <template v-else-if="section.type === 'project'">
                <h2 class="creative-section-title">{{ section.title }}</h2>
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
              </template>

              <template v-else-if="section.type === 'summary'">
                <h2 class="creative-section-title">{{ section.title }}</h2>
                <div class="summary-content" v-html="section.content" />
              </template>
            </div>
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

/* 现代科技风模板样式 */
.modern-template .modern-header {
  padding-bottom: 16px;
  margin-bottom: 20px;
  border-bottom: 2px solid #00d2ff;
  background: linear-gradient(135deg, #00d2ff08 0%, #3a7bd5100 100%);
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
  color: #1a1a2e;
  letter-spacing: 1px;
}

.modern-template .job-intent {
  color: #00d2ff;
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
  background: #f0f7ff;
  padding: 2px 8px;
  border-radius: 12px;
}

.modern-template .contact-info .el-icon {
  color: #00d2ff;
  font-weight: 600;
}

.modern-template .modern-section {
  margin-bottom: 16px;
}

.modern-template .section-title {
  font-size: 15px;
  font-weight: 600;
  color: #00d2ff;
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
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
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
  color: #1a1a2e;
}

.modern-template .education-date,
.modern-template .work-date,
.modern-template .project-date {
  color: #00d2ff;
  font-size: 13px;
  font-weight: 500;
  background: #e6f7ff;
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

/* 经典金融风模板样式 */
.classic-template {
  background: #fff;
  font-family: 'Georgia', 'Times New Roman', serif;
}

.classic-template .classic-header {
  text-align: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 2px solid #1a3a5c;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  padding: 20px 24px;
  margin: -30px -30px 16px -30px;
}

.classic-template .classic-personal h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: #1a3a5c;
  letter-spacing: 3px;
  font-weight: 700;
  text-transform: uppercase;
}

.classic-template .classic-job-intent {
  text-align: center;
  color: #8b7355;
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: 500;
  letter-spacing: 1px;
}

.classic-template .classic-contact {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  color: #555;
  font-size: 13px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
}

.classic-template .contact-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-style: italic;
}

.classic-template .classic-section {
  margin-bottom: 18px;
}

.classic-template .classic-section-title {
  display: flex;
  align-items: center;
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #1a3a5c;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
}

.classic-template .title-text {
  padding-right: 16px;
  background-color: white;
  z-index: 1;
}

.classic-template .title-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, #1a3a5c 0%, #ddd 100%);
  margin-left: -16px;
}

.classic-template .classic-item {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dotted #ddd;
}

.classic-template .classic-item:last-child {
  border-bottom: none;
}

.classic-template .classic-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.classic-template .classic-item-header h3 {
  margin: 0;
  font-size: 15px;
  color: #1a3a5c;
  font-weight: 600;
}

.classic-template .classic-date {
  color: #888;
  font-size: 12px;
  font-style: italic;
}

.classic-template .classic-item-subtitle {
  color: #666;
  font-size: 13px;
  margin: 4px 0;
  font-style: italic;
}

.classic-template .classic-item-description {
  color: #444;
  font-size: 13px;
  line-height: 1.6;
}

.classic-template .summary-content {
  color: #444;
  font-size: 13px;
  line-height: 1.8;
  text-align: justify;
  padding: 8px 0;
}

.classic-template .skill-tag {
  background: #f0f0f0;
  border: 1px solid #ddd;
  color: #1a3a5c;
}

.classic-template .skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

/* 创意设计风模板样式 */
.creative-template {
  padding: 30px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  min-height: 100%;
}

.creative-layout {
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.creative-left {
  width: 240px;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
  border-right: 1px solid #dee2e6;
}

.creative-right {
  flex: 1;
  padding: 32px;
  background: #ffffff;
}

.creative-personal {
  text-align: center;
  margin-bottom: 24px;
}

.creative-personal .avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
  border: 3px solid #ff6b6b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.creative-personal h1 {
  margin: 0 0 8px 0;
  font-size: 22px;
  color: #2d3436;
  font-weight: 700;
}

.creative-personal .job-intent {
  color: #ff6b6b;
  font-size: 13px;
  margin-bottom: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.creative-contact {
  text-align: left;
}

.creative-contact .contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #636e72;
  font-size: 12px;
}

.creative-contact .el-icon {
  color: #ff6b6b;
  font-size: 14px;
}

.creative-section-left,
.creative-section-right {
  margin-bottom: 20px;
}

.creative-section-title {
  font-size: 14px;
  color: #ff6b6b;
  border-bottom: 2px solid #ff6b6b;
  padding-bottom: 6px;
  margin: 0 0 14px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.creative-section-left .skill-group {
  margin-bottom: 16px;
}

.creative-section-left .skill-group h3 {
  font-size: 12px;
  color: #636e72;
  margin: 0 0 8px 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.creative-section-left .skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.creative-section-left .skill-tag {
  background: #ff6b6b;
  border: none;
  color: white;
  font-size: 11px;
}

.creative-section-right .education-item,
.creative-section-right .work-item,
.creative-section-right .project-item {
  margin-bottom: 16px;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #ff6b6b;
}

.creative-section-right .education-header,
.creative-section-right .work-header,
.creative-section-right .project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.creative-section-right h3 {
  margin: 0;
  font-size: 15px;
  color: #2d3436;
  font-weight: 600;
}

.creative-section-right .education-date,
.creative-section-right .work-date,
.creative-section-right .project-date {
  color: #ff6b6b;
  font-size: 12px;
  font-weight: 500;
  background: #fff0f0;
  padding: 2px 8px;
  border-radius: 10px;
}

.creative-section-right .education-details,
.creative-section-right .work-position,
.creative-section-right .project-role {
  color: #636e72;
  font-size: 13px;
  margin-bottom: 8px;
  font-weight: 500;
}

.creative-section-right .summary-content {
  padding: 14px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  border-radius: 10px;
  color: #2d3436;
  line-height: 1.7;
}

.creative-section-right .project-technologies {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dotted #dee2e6;
}

.creative-section-right .tech-label {
  color: #636e72;
  font-size: 12px;
  font-weight: 600;
}

.creative-section-right .tech-tag {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  border: none;
  color: white;
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