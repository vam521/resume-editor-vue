<template>
  <el-dialog
    v-model="dialogVisible"
    title="AI 润色设置"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form :model="localSettings" label-width="100px">
      <el-form-item label="启用AI">
        <el-switch v-model="localSettings.enabled" />
      </el-form-item>

      <el-form-item label="AI服务商">
        <el-select v-model="localSettings.provider" style="width: 100%">
          <el-option label="OpenAI" value="openai" />
          <el-option label="Anthropic (Claude)" value="anthropic" />
          <el-option label="自定义 API" value="custom" />
        </el-select>
      </el-form-item>

      <el-form-item label="API Key">
        <el-input
          v-model="localSettings.apiKey"
          type="password"
          placeholder="请输入 API Key"
          show-password
        />
      </el-form-item>

      <el-form-item label="Base URL">
        <el-input
          v-model="localSettings.baseUrl"
          placeholder="API 基础地址"
        >
          <template #prefix>
            <el-icon><Link /></el-icon>
          </template>
        </el-input>
        <div class="form-tip">
          OpenAI: https://api.openai.com/v1<br>
          Anthropic: https://api.anthropic.com<br>
          自定义: 你的 API 代理地址
        </div>
      </el-form-item>

      <el-form-item label="模型">
        <el-input
          v-model="localSettings.model"
          placeholder="模型名称"
        />
        <div class="form-tip">
          常用模型: gpt-3.5-turbo, gpt-4, claude-3-opus, claude-3-sonnet
        </div>
      </el-form-item>

      <el-form-item>
        <el-button @click="testConnection" :loading="testing">
          测试连接
        </el-button>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveSettings">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAISettingsStore } from '../store/aiSettings'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { Link } from '@element-plus/icons-vue'

const aiStore = useAISettingsStore()
const { settings } = storeToRefs(aiStore)

const dialogVisible = ref(false)
const testing = ref(false)

const localSettings = ref({ ...settings.value })

watch(dialogVisible, (val) => {
  if (val) {
    localSettings.value = { ...settings.value }
  }
})

const testConnection = async () => {
  if (!localSettings.value.apiKey) {
    ElMessage.warning('请先输入 API Key')
    return
  }

  testing.value = true
  aiStore.updateSettings(localSettings.value)
  const success = await aiStore.testConnection()
  testing.value = false

  if (success) {
    ElMessage.success('连接成功!')
  } else {
    ElMessage.error('连接失败，请检查配置')
  }
}

const saveSettings = () => {
  aiStore.updateSettings(localSettings.value)
  dialogVisible.value = false
  ElMessage.success('AI 设置已保存')
}

defineExpose({
  dialogVisible
})
</script>

<style scoped>
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.5;
}
</style>
