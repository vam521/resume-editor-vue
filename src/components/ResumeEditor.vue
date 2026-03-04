<template>
  <div class="resume-editor">
    <div class="editor-header">
      <h3>简历内容编辑</h3>
      <div class="header-actions">
        <el-button size="small" :icon="Document" @click="fillSampleData">
          填充示例
        </el-button>
        <el-button size="small" :icon="Plus" @click="showAddSectionDialog = true">
          添加模块
        </el-button>
        <el-button size="small" :icon="Sort" @click="toggleDragMode">
          {{ dragMode ? '完成排序' : '调整顺序' }}
        </el-button>
      </div>
    </div>

    <div class="sections-container">
      <draggable
        v-model="sortedSections"
        v-bind="dragOptions"
        @end="handleDragEnd"
        item-key="id"
      >
        <template #item="{ element: section }">
          <div class="section-item">
            <div class="section-header">
              <h4 class="section-title">
                <el-icon v-if="dragMode" class="drag-handle">
                  <Rank />
                </el-icon>
                {{ section.title }}
              </h4>
              <div class="section-actions">
                <el-button
                  v-if="section.type !== 'personal'"
                  size="small"
                  text
                  :icon="Delete"
                  @click="removeSection(section.id)"
                />
                <el-icon class="collapse-icon" @click="toggleSectionCollapse(section.id)">
                  <ArrowDown v-if="!collapsedSections[section.id]" />
                  <ArrowRight v-else />
                </el-icon>
              </div>
            </div>

            <div v-show="!collapsedSections[section.id]" class="section-content">
              <!-- 个人信息表单 -->
              <div v-if="section.type === 'personal'" class="personal-form">
                <div class="avatar-section">
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :before-upload="handleAvatarBeforeUpload"
                    :http-request="handleAvatarUpload"
                  >
                    <img v-if="section.content.avatar" :src="section.content.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                  </el-upload>
                  <div class="avatar-tip">点击上传头像</div>
                </div>
                <el-form :model="section.content" label-width="100px">
                  <el-form-item label="姓名">
                    <el-input v-model="section.content.name" placeholder="请输入姓名" />
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="section.content.email" placeholder="请输入邮箱" />
                  </el-form-item>
                  <el-form-item label="电话">
                    <el-input v-model="section.content.phone" placeholder="请输入电话" />
                  </el-form-item>
                  <el-form-item label="地点">
                    <el-input v-model="section.content.location" placeholder="请输入城市" />
                  </el-form-item>
                  <el-form-item label="个人网站">
                    <el-input v-model="section.content.website" placeholder="请输入个人网站或博客地址" />
                  </el-form-item>
                </el-form>
              </div>

              <!-- 教育背景、工作经历、项目经验、技能列表 -->
              <div v-else-if="section.type === 'project'" class="list-editor">
                <draggable
                  v-model="section.content"
                  v-bind="projectDragOptions"
                  item-key="index"
                  handle=".project-drag-handle"
                  @end="handleProjectDragEnd(section.id)"
                >
                  <template #item="{ element: item, index }">
                    <div class="list-item">
                      <div class="list-item-header">
                        <div class="drag-handle-wrapper project-drag-handle">
                          <el-icon><Rank /></el-icon>
                        </div>
                        <h5>{{ getItemTitle(item, section.type) }}</h5>
                        <el-button size="small" text :icon="Delete" @click="removeListItem(section.id, Number(index))" />
                      </div>
                      <el-form :model="item" size="small">
                        <el-form-item label="项目名称">
                          <el-input v-model="item.name" placeholder="请输入项目名称" />
                        </el-form-item>
                        <el-form-item label="角色">
                          <el-input v-model="item.role" placeholder="请输入你在项目中的角色" />
                        </el-form-item>
                        <el-form-item label="时间">
                          <el-date-picker
                            v-model="item.dateRange"
                            type="monthrange"
                            range-separator="至"
                            start-placeholder="开始月份"
                            end-placeholder="结束月份"
                            value-format="YYYY-MM"
                          />
                        </el-form-item>
                        <el-form-item label="项目描述">
                          <RichTextEditor v-model="item.description" />
                        </el-form-item>
                        <el-form-item label="技术栈">
                          <el-tag
                            v-for="(tech, techIndex) in item.technologies"
                            :key="techIndex"
                            class="tech-tag"
                            closable
                            @close="removeTech(item, Number(techIndex))"
                          >
                            {{ tech }}
                          </el-tag>
                          <el-input
                            v-if="item.techInputVisible"
                            ref="techInputRef"
                            v-model="item.techInputValue"
                            size="small"
                            class="tech-input"
                            @keyup.enter="addTech(item)"
                            @blur="addTech(item)"
                          />
                          <el-button v-else size="small" @click="showTechInput(item)">
                            添加技术
                          </el-button>
                        </el-form-item>
                      </el-form>
                    </div>
                  </template>
                </draggable>
                <el-button class="add-list-item" :icon="Plus" @click="addListItem(section.id)">
                  添加项目经验
                </el-button>
              </div>

              <div v-else-if="['education', 'work', 'skill'].includes(section.type)" class="list-editor">
                <div v-for="(item, index) in section.content" :key="index" class="list-item">
                  <div class="list-item-header">
                    <h5>{{ getItemTitle(item, section.type) }}</h5>
                    <el-button size="small" text :icon="Delete" @click="removeListItem(section.id, Number(index))" />
                  </div>
                  <el-form :model="item" size="small">
                    <div v-if="section.type === 'education'">
                      <el-form-item label="学校名称">
                        <el-input v-model="item.school" placeholder="请输入学校名称" />
                      </el-form-item>
                      <el-form-item label="专业">
                        <el-input v-model="item.major" placeholder="请输入专业" />
                      </el-form-item>
                      <el-form-item label="学历">
                        <el-input v-model="item.degree" placeholder="请输入学历" />
                      </el-form-item>
                      <el-form-item label="时间">
                        <el-date-picker
                          v-model="item.dateRange"
                          type="monthrange"
                          range-separator="至"
                          start-placeholder="开始月份"
                          end-placeholder="结束月份"
                          value-format="YYYY-MM"
                        />
                      </el-form-item>
                      <el-form-item label="描述">
                        <RichTextEditor v-model="item.description" />
                      </el-form-item>
                    </div>

                    <div v-else-if="section.type === 'work'">
                      <el-form-item label="公司名称">
                        <el-input v-model="item.company" placeholder="请输入公司名称" />
                      </el-form-item>
                      <el-form-item label="职位">
                        <el-input v-model="item.position" placeholder="请输入职位" />
                      </el-form-item>
                      <el-form-item label="时间">
                        <el-date-picker
                          v-model="item.dateRange"
                          type="monthrange"
                          range-separator="至"
                          start-placeholder="开始月份"
                          end-placeholder="结束月份"
                          value-format="YYYY-MM"
                        />
                      </el-form-item>
                      <el-form-item label="工作描述">
                        <RichTextEditor v-model="item.description" />
                      </el-form-item>
                    </div>

                    <div v-else-if="section.type === 'project'">
                      <el-form-item label="项目名称">
                        <el-input v-model="item.name" placeholder="请输入项目名称" />
                      </el-form-item>
                      <el-form-item label="角色">
                        <el-input v-model="item.role" placeholder="请输入你在项目中的角色" />
                      </el-form-item>
                      <el-form-item label="时间">
                        <el-date-picker
                          v-model="item.dateRange"
                          type="monthrange"
                          range-separator="至"
                          start-placeholder="开始月份"
                          end-placeholder="结束月份"
                          value-format="YYYY-MM"
                        />
                      </el-form-item>
                      <el-form-item label="项目描述">
                        <RichTextEditor v-model="item.description" />
                      </el-form-item>
                      <el-form-item label="技术栈">
                        <el-tag
                          v-for="(tech, techIndex) in item.technologies"
                          :key="techIndex"
                          class="tech-tag"
                          closable
                          @close="removeTech(item, Number(techIndex))"
                        >
                          {{ tech }}
                        </el-tag>
                        <el-input
                          v-if="item.techInputVisible"
                          ref="techInputRef"
                          v-model="item.techInputValue"
                          size="small"
                          class="tech-input"
                          @keyup.enter="addTech(item)"
                          @blur="addTech(item)"
                        />
                        <el-button v-else size="small" @click="showTechInput(item)">
                          添加技术
                        </el-button>
                      </el-form-item>
                    </div>

                    <div v-else-if="section.type === 'skill'">
                      <el-form-item label="技能类别">
                        <el-input v-model="item.category" placeholder="如：编程语言、框架、工具等" />
                      </el-form-item>
                      <el-form-item label="技能项">
                        <el-tag
                          v-for="(skill, skillIndex) in item.skills"
                          :key="skillIndex"
                          class="skill-tag"
                          closable
                          @close="removeSkill(item, Number(skillIndex))"
                        >
                          {{ skill }}
                        </el-tag>
                        <el-input
                          v-if="item.skillInputVisible"
                          ref="skillInputRef"
                          v-model="item.skillInputValue"
                          size="small"
                          class="skill-input"
                          @keyup.enter="addSkill(item)"
                          @blur="addSkill(item)"
                        />
                        <el-button v-else size="small" @click="showSkillInput(item)">
                          添加技能
                        </el-button>
                      </el-form-item>
                    </div>
                  </el-form>
                </div>
                <el-button class="add-list-item" :icon="Plus" @click="addListItem(section.id)">
                  添加{{ getSectionTypeLabel(section.type) }}
                </el-button>
              </div>

              <!-- 个人简介富文本编辑器 -->
              <div v-else-if="section.type === 'summary'" class="rich-text-editor">
                <RichTextEditor v-model="section.content" />
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- 添加模块对话框 -->
    <el-dialog v-model="showAddSectionDialog" title="添加模块" width="400px">
      <el-form :model="newSection" label-width="80px">
        <el-form-item label="模块类型">
          <el-select v-model="newSection.type" placeholder="请选择模块类型">
            <el-option label="教育背景" value="education" />
            <el-option label="工作经历" value="work" />
            <el-option label="项目经验" value="project" />
            <el-option label="技能专长" value="skill" />
            <el-option label="个人简介" value="summary" />
            <el-option label="自定义模块" value="custom" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块标题">
          <el-input v-model="newSection.title" placeholder="请输入模块标题" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddSectionDialog = false">取消</el-button>
          <el-button type="primary" @click="addNewSection">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, nextTick } from 'vue'
import { Plus, Sort, Delete, Rank, ArrowDown, ArrowRight, Document } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { useResumeStore, type ResumeSection } from '@/store/resume'
import RichTextEditor from './RichTextEditor.vue'
import { ElMessage } from 'element-plus'

const resumeStore = useResumeStore()

const sortedSections = computed({
  get: () => resumeStore.sortedSections,
  set: (value) => {
    // 更新store中的顺序
    resumeStore.reorderSections(value.map(s => s.id))
  }
})

const dragMode = ref(false)
const collapsedSections = ref<Record<string, boolean>>({})
const showAddSectionDialog = ref(false)
const newSection = reactive({
  type: 'education' as ResumeSection['type'],
  title: ''
})

const dragOptions = computed(() => ({
  animation: 200,
  disabled: !dragMode.value,
  ghostClass: 'ghost',
  handle: dragMode.value ? '.drag-handle' : undefined
}))

const projectDragOptions = {
  animation: 200,
  ghostClass: 'ghost'
}

const toggleDragMode = () => {
  dragMode.value = !dragMode.value
}

const handleDragEnd = () => {
  resumeStore.saveDraft()
}

const handleProjectDragEnd = (sectionId: string) => {
  const section = resumeStore.sections.find(s => s.id === sectionId)
  if (section) {
    resumeStore.updateSectionContent(sectionId, section.content)
  }
}

const toggleSectionCollapse = (sectionId: string) => {
  collapsedSections.value[sectionId] = !collapsedSections.value[sectionId]
}

const removeSection = (sectionId: string) => {
  resumeStore.removeSection(sectionId)
}

const addNewSection = () => {
  if (!newSection.title.trim()) {
    ElMessage.warning('请输入模块标题')
    return
  }

  resumeStore.addSection(newSection.type, newSection.title)
  showAddSectionDialog.value = false
  newSection.title = ''
}

const getItemTitle = (item: any, type: string) => {
  switch (type) {
    case 'education': return `${item.school || '未命名'} - ${item.major || '未指定专业'}`
    case 'work': return `${item.company || '未命名'} - ${item.position || '未指定职位'}`
    case 'project': return item.name || '未命名项目'
    case 'skill': return item.category || '未分类技能'
    default: return '未命名'
  }
}

const getSectionTypeLabel = (type: string) => {
  switch (type) {
    case 'education': return '教育经历'
    case 'work': return '工作经历'
    case 'project': return '项目经验'
    case 'skill': return '技能'
    default: return '项目'
  }
}

// 头像上传处理
const handleAvatarBeforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

const handleAvatarUpload = (options: any) => {
  const { file } = options
  const reader = new FileReader()
  reader.onload = (e) => {
    const personalSection = resumeStore.sections.find(s => s.type === 'personal')
    if (personalSection) {
      personalSection.content.avatar = e.target?.result as string
      resumeStore.updateSectionContent(personalSection.id, personalSection.content)
    }
  }
  reader.readAsDataURL(file)
}

// 列表项管理
const addListItem = (sectionId: string) => {
  const section = resumeStore.sections.find(s => s.id === sectionId)
  if (!section) return

  const newItem = getDefaultListItem(section.type)
  section.content.push(newItem)
  resumeStore.updateSectionContent(sectionId, section.content)
}

const removeListItem = (sectionId: string, index: number) => {
  const section = resumeStore.sections.find(s => s.id === sectionId)
  if (!section) return

  section.content.splice(index, 1)
  resumeStore.updateSectionContent(sectionId, section.content)
}

const getDefaultListItem = (type: string) => {
  switch (type) {
    case 'education':
      return {
        school: '',
        major: '',
        degree: '',
        dateRange: [],
        description: ''
      }
    case 'work':
      return {
        company: '',
        position: '',
        dateRange: [],
        description: ''
      }
    case 'project':
      return {
        name: '',
        role: '',
        dateRange: [],
        description: '',
        technologies: [],
        techInputVisible: false,
        techInputValue: ''
      }
    case 'skill':
      return {
        category: '',
        skills: [],
        skillInputVisible: false,
        skillInputValue: ''
      }
    default:
      return {}
  }
}

// 技术栈管理
const showTechInput = (item: any) => {
  item.techInputVisible = true
  item.techInputValue = ''
  nextTick(() => {
    // 需要获取ref，这里简化处理
  })
}

const addTech = (item: any) => {
  if (item.techInputValue && !item.technologies.includes(item.techInputValue)) {
    item.technologies.push(item.techInputValue)
  }
  item.techInputVisible = false
  item.techInputValue = ''
}

const removeTech = (item: any, index: number) => {
  item.technologies.splice(index, 1)
}

// 技能管理
const showSkillInput = (item: any) => {
  item.skillInputVisible = true
  item.skillInputValue = ''
}

const addSkill = (item: any) => {
  if (item.skillInputValue && !item.skills.includes(item.skillInputValue)) {
    item.skills.push(item.skillInputValue)
  }
  item.skillInputVisible = false
  item.skillInputValue = ''
}

const removeSkill = (item: any, index: number) => {
  item.skills.splice(index, 1)
}

const fillSampleData = () => {
  const personalSection = resumeStore.sections.find(s => s.type === 'personal')
  if (personalSection) {
    personalSection.content = {
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      location: '北京',
      website: 'https://zhangsan.dev'
    }
  }

  const educationSection = resumeStore.sections.find(s => s.type === 'education')
  if (educationSection) {
    educationSection.content = [
      {
        school: '清华大学',
        major: '计算机科学与技术',
        degree: 'master',
        dateRange: ['2018-09-01', '2021-06-30'],
        description: '<p>主修课程：数据结构、算法分析、操作系统、计算机网络、数据库原理</p>'
      },
      {
        school: '浙江大学',
        major: '软件工程',
        degree: 'bachelor',
        dateRange: ['2014-09-01', '2018-06-30'],
        description: '<p>主修课程：软件工程、面向对象编程、Web开发、移动应用开发</p>'
      }
    ]
  }

  const workSection = resumeStore.sections.find(s => s.type === 'work')
  if (workSection) {
    workSection.content = [
      {
        company: '字节跳动',
        position: '高级前端工程师',
        dateRange: ['2021-07-01', '至今'],
        description: '<ul><li>负责公司核心产品的前端架构设计与开发</li><li>主导完成了多个大型项目的性能优化，提升页面加载速度40%</li><li>建立团队前端代码规范，推广单元测试和E2E测试</li></ul>'
      },
      {
        company: '阿里巴巴',
        position: '前端开发工程师',
        dateRange: ['2019-03-01', '2021-06-30'],
        description: '<ul><li>参与公司电商平台的前端开发工作</li><li>负责移动端H5页面开发，实现响应式布局</li><li>与后端团队紧密协作，优化接口性能</li></ul>'
      }
    ]
  }

  const projectSection = resumeStore.sections.find(s => s.type === 'project')
  if (projectSection) {
    projectSection.content = [
      {
        name: '企业级低代码平台',
        role: '技术负责人',
        dateRange: ['2023-01-01', '至今'],
        description: '<p>主导设计并开发了一款企业级低代码平台，支持可视化拖拽构建表单和流程，提升开发效率60%。</p>',
        technologies: ['Vue3', 'TypeScript', 'Node.js', 'PostgreSQL'],
        techInputVisible: false,
        techInputValue: ''
      },
      {
        name: '实时协作文档系统',
        role: '核心开发',
        dateRange: ['2022-03-01', '2022-12-31'],
        description: '<p>参与开发支持多人实时协作的文档系统，采用WebSocket和CRDT算法实现实时同步。</p>',
        technologies: ['React', 'WebSocket', 'Redis', 'MongoDB'],
        techInputVisible: false,
        techInputValue: ''
      }
    ]
  }

  const skillSection = resumeStore.sections.find(s => s.type === 'skill')
  if (skillSection) {
    skillSection.content = [
      {
        category: '前端开发',
        skills: ['Vue', 'React', 'TypeScript', 'Webpack', 'Vite'],
        skillInputVisible: false,
        skillInputValue: ''
      },
      {
        category: '后端开发',
        skills: ['Node.js', 'Python', 'Go', 'MySQL', 'Redis'],
        skillInputVisible: false,
        skillInputValue: ''
      },
      {
        category: '工具&其他',
        skills: ['Git', 'Docker', 'Linux', 'Figma'],
        skillInputVisible: false,
        skillInputValue: ''
      }
    ]
  }

  const summarySection = resumeStore.sections.find(s => s.type === 'summary')
  if (summarySection) {
    summarySection.content = '<p>5年+前端开发经验，精通Vue和React框架，熟悉Node.js后端开发。具备良好的代码规范意识和性能优化能力，有幸参与过多个大型项目的从0到1建设。热爱技术，善于学习新技术，具备较强的团队协作能力和项目管理经验。</p>'
  }

  resumeStore.sections.forEach(section => {
    resumeStore.updateSectionContent(section.id, section.content)
  })

  ElMessage.success('示例数据已填充')
}
</script>

<style scoped>
.resume-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
}

.editor-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-header h3::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.editor-header .el-button {
  border-radius: 6px;
  font-weight: 500;
}

.editor-header .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.editor-header .el-button--primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.sections-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.section-item {
  margin-bottom: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
}

.section-item:hover {
  border-color: #d4c4ed;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.12);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.drag-handle {
  cursor: move;
  color: #b0b0b0;
  font-size: 16px;
  transition: color 0.2s;
}

.drag-handle:hover {
  color: #667eea;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-actions .el-button {
  border-radius: 6px;
}

.section-actions .el-button--danger {
  color: #f56c6c;
}

.section-actions .el-button--danger:hover {
  background: #fef0f0;
}

.collapse-icon {
  cursor: pointer;
  color: #b0b0b0;
  transition: all 0.2s;
  font-size: 14px;
}

.collapse-icon:hover {
  color: #667eea;
  transform: rotate(180deg);
}

.section-content {
  padding: 28px;
}

.personal-form {
  display: flex;
  gap: 32px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.avatar-uploader {
  width: 120px;
  height: 120px;
  border: 2px dashed #d0d0d0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.avatar-uploader:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.avatar-uploader .avatar {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 32px;
  color: #b0b0b0;
}

.avatar-tip {
  margin-top: 12px;
  font-size: 12px;
  color: #909399;
}

.personal-form .el-form {
  flex: 1;
}

.personal-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.personal-form .el-form-item {
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

.personal-form .el-form-item__label {
  font-size: 15px;
  font-weight: 500;
  color: #505050;
  padding-bottom: 0;
  min-width: 100px;
  line-height: 32px;
}

.personal-form .el-form-item__content {
  flex: 1;
  margin-left: 0 !important;
  line-height: 32px;
}

.personal-form .el-input__wrapper {
  border-radius: 8px;
  padding: 6px 14px;
  height: 36px;
}

.personal-form .el-input {
  font-size: 15px;
}

.list-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: #fafbfc;
  transition: all 0.2s ease;
}

.list-item:hover {
  border-color: #d4c4ed;
  background: #fff;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.08);
}

.list-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e8e8e8;
}

.drag-handle-wrapper {
  cursor: move;
  color: #b0b0b0;
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.drag-handle-wrapper:hover {
  color: #667eea;
}

.list-item-header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.list-item .el-form-item {
  margin-bottom: 14px;
}

.list-item .el-form-item__label {
  font-size: 12px;
  font-weight: 500;
  color: #909399;
  padding-bottom: 4px;
}

.list-item .el-select,
.list-item .el-date-editor {
  width: 100%;
}

.list-item .el-input__wrapper {
  border-radius: 6px;
}

.tech-tag,
.skill-tag {
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: none;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  color: #667eea;
  font-weight: 500;
}

.tech-input,
.skill-input {
  width: 140px;
  margin-right: 8px;
}

.add-list-item {
  margin-top: 8px;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
  background: transparent;
  color: #909399;
  font-weight: 500;
  transition: all 0.2s;
}

.add-list-item:hover {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.rich-text-editor {
  min-height: 180px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.rich-text-editor:hover {
  border-color: #d4c4ed;
}

.ghost {
  opacity: 0.6;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  border-color: #667eea;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #d0d0d0;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>