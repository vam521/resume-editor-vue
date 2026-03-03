<template>
  <div class="home-view">
    <header class="header">
      <h1>在线简历生成器</h1>
      <p>选择模板，编辑内容，生成专业简历</p>
    </header>

    <div class="main-content">
      <!-- 左侧编辑区域 -->
      <div class="edit-panel">
        <el-tabs type="border-card" class="edit-tabs">
          <el-tab-pane label="模板选择">
            <TemplateLibrary />
          </el-tab-pane>
          <el-tab-pane label="内容编辑">
            <ResumeEditor />
          </el-tab-pane>
          <el-tab-pane label="导出设置">
            <ExportSettings ref="exportSettingsRef" />
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 右侧预览区域 -->
      <div class="preview-panel">
        <div class="preview-header">
          <h3>实时预览</h3>
          <div class="preview-actions">
            <el-button type="primary" :icon="Download" @click="handleExport">
              导出PDF
            </el-button>
            <el-button :icon="Refresh" @click="handleRefresh">
              刷新预览
            </el-button>
          </div>
        </div>
        <div class="preview-container">
          <ResumePreview />
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <footer class="footer">
      <div class="footer-actions">
        <el-button :icon="DocumentAdd" @click="handleNew">
          新建简历
        </el-button>
        <el-button :icon="Upload" @click="handleImport">
          导入数据
        </el-button>
        <el-button :icon="Download" @click="handleExportData">
          导出数据
        </el-button>
        <el-button :icon="Setting" @click="handleSettings">
          设置
        </el-button>
        <el-button type="success" :icon="Refresh" @click="handleSaveDraft">
          保存草稿
        </el-button>
      </div>
      <div class="footer-info">
        <span>数据自动保存中...</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Download, Refresh, DocumentAdd, Upload, Setting } from '@element-plus/icons-vue'
import TemplateLibrary from '@/components/TemplateLibrary.vue'
import ResumeEditor from '@/components/ResumeEditor.vue'
import ResumePreview from '@/components/ResumePreview.vue'
import ExportSettings from '@/components/ExportSettings.vue'
import { useResumeStore } from '@/store/resume'
import { ElMessage, ElMessageBox } from 'element-plus'

const resumeStore = useResumeStore()
const exportSettingsRef = ref<InstanceType<typeof ExportSettings> | null>(null)

const handleExport = () => {
  if (exportSettingsRef.value) {
    exportSettingsRef.value.handleExport()
  }
}

const handleRefresh = () => {
  // 刷新预览逻辑
}

const handleNew = () => {
  ElMessageBox.confirm('新建简历将清除当前编辑内容，是否继续？', '新建简历', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    resumeStore.resetResume()
    resumeStore.clearDraft()
    ElMessage.success('已创建新简历')
  }).catch(() => {})
}

const handleImport = () => {
  // 导入数据逻辑
}

const handleExportData = () => {
  // 导出数据逻辑
}

const handleSettings = () => {
  // 设置逻辑
}

const handleSaveDraft = () => {
  resumeStore.saveDraft()
  ElMessage.success('草稿保存成功')
}

const handleLoadDraft = () => {
  const draftTime = resumeStore.getDraftInfo()
  if (draftTime) {
    const timeStr = draftTime.toLocaleString()
    ElMessageBox.confirm(`检测到上次保存的草稿（${timeStr}），是否恢复？`, '恢复草稿', {
      confirmButtonText: '恢复',
      cancelButtonText: '不恢复',
      type: 'info'
    }).then(() => {
      resumeStore.loadFromStorage()
      ElMessage.success('草稿已恢复')
    }).catch(() => {})
  }
}

onMounted(() => {
  const draftTime = resumeStore.getDraftInfo()
  if (draftTime) {
    handleLoadDraft()
  }
})
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
}

.header {
  padding: 20px 40px;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.header p {
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
}

.main-content {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
}

.edit-panel {
  flex: 1;
  min-width: 400px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.edit-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: none;
  box-shadow: none;
}

.edit-tabs :deep(.el-tabs__header) {
  background: #fafafa;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.edit-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.edit-tabs :deep(.el-tabs__item) {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  padding: 0 24px;
}

.edit-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.edit-tabs :deep(.el-tab-pane) {
  height: 100%;
}

.preview-panel {
  flex: 1;
  min-width: 400px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
}

.preview-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.preview-actions {
  display: flex;
  gap: 12px;
}

.preview-actions .el-button {
  padding: 10px 20px;
  border-radius: 6px;
}

.preview-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background: #f5f7fa;
}

.footer {
  padding: 14px 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.footer-actions .el-button {
  border-radius: 6px;
  padding: 10px 18px;
}

.footer-info {
  color: #909399;
  font-size: 13px;
}

.footer-info::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #67c23a;
  border-radius: 50%;
  margin-right: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .edit-panel,
  .preview-panel {
    min-width: auto;
  }
  
  .header {
    padding: 16px 20px;
  }
  
  .footer {
    flex-direction: column;
    gap: 12px;
    padding: 12px 20px;
  }
}
</style>