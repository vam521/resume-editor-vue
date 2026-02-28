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
      </div>
      <div class="footer-info">
        <span>数据自动保存中...</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download, Refresh, DocumentAdd, Upload, Setting } from '@element-plus/icons-vue'
import TemplateLibrary from '@/components/TemplateLibrary.vue'
import ResumeEditor from '@/components/ResumeEditor.vue'
import ResumePreview from '@/components/ResumePreview.vue'
import ExportSettings from '@/components/ExportSettings.vue'

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
  // 新建简历逻辑
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
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

.header {
  padding: 20px;
  text-align: center;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  color: #409eff;
}

.header p {
  margin: 10px 0 0;
  color: #666;
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
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.edit-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
}

.preview-panel {
  flex: 1;
  min-width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.preview-header h3 {
  margin: 0;
  color: #303133;
}

.preview-actions {
  display: flex;
  gap: 10px;
}

.preview-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.footer {
  padding: 16px 20px;
  background-color: white;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.footer-info {
  color: #909399;
  font-size: 14px;
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .edit-panel,
  .preview-panel {
    min-width: auto;
  }
}
</style>