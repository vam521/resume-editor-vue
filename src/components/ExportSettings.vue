<template>
  <div class="export-settings">
    <el-form :model="settings" label-width="100px">
      <el-form-item label="导出格式">
        <el-radio-group v-model="settings.format">
          <el-radio label="pdf">PDF（推荐）</el-radio>
          <el-radio label="html" disabled>HTML</el-radio>
          <el-radio label="docx" disabled>Word</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="页面尺寸">
        <el-select v-model="settings.pageSize" style="width: 200px;">
          <el-option label="A4 (210mm × 297mm)" value="a4" />
          <el-option label="Letter (8.5in × 11in)" value="letter" />
          <el-option label="A3 (297mm × 420mm)" value="a3" />
        </el-select>
      </el-form-item>

      <el-form-item label="页面方向">
        <el-radio-group v-model="settings.orientation">
          <el-radio label="portrait">纵向</el-radio>
          <el-radio label="landscape">横向</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="边距">
        <el-slider
          v-model="settings.margin"
          :min="5"
          :max="30"
          :step="5"
          show-input
          input-size="small"
          style="width: 300px;"
        />
        <span style="margin-left: 10px; color: #909399;">{{ settings.margin }}mm</span>
      </el-form-item>

      <el-form-item label="文件名">
        <el-input v-model="settings.fileName" placeholder="例如：张三_简历_2025" style="width: 300px;">
          <template #append>.pdf</template>
        </el-input>
      </el-form-item>

      <el-form-item label="图像质量">
        <el-slider
          v-model="settings.imageQuality"
          :min="0.1"
          :max="1"
          :step="0.1"
          show-input
          input-size="small"
          style="width: 300px;"
        />
        <span style="margin-left: 10px; color: #909399;">{{ Math.round(settings.imageQuality * 100) }}%</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Download" @click="handleExport" :loading="exporting">
          导出简历
        </el-button>
        <el-button :icon="View" @click="handlePreview">
          预览打印效果
        </el-button>
        <el-button :icon="Setting" @click="resetSettings">
          恢复默认
        </el-button>
      </el-form-item>
    </el-form>

    <div class="export-tips">
      <h4>导出提示：</h4>
      <ul>
        <li>PDF格式适合打印和投递，能保持格式一致性</li>
        <li>建议使用A4尺寸，这是最常用的简历尺寸</li>
        <li>导出前请确保预览效果符合预期</li>
        <li>高质量图像会增加文件大小，但打印效果更好</li>
        <li>导出过程可能需要几秒钟，请耐心等待</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Download, View, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const exporting = ref(false)

const settings = reactive({
  format: 'pdf',
  pageSize: 'a4',
  orientation: 'portrait',
  margin: 10,
  fileName: '',
  imageQuality: 1.0
})

const getPageDimensions = () => {
  const dimensions: Record<string, { width: number; height: number }> = {
    a4: { width: 210, height: 297 },
    letter: { width: 215.9, height: 279.4 },
    a3: { width: 297, height: 420 }
  }
  const dim = dimensions[settings.pageSize] || dimensions.a4
  if (!dim) {
    return { width: 210, height: 297 }
  }
  return settings.orientation === 'landscape' 
    ? { width: dim.height, height: dim.width }
    : dim
}

const handleExport = async () => {
  exporting.value = true
  try {
    const previewComponent = document.querySelector('.resume-preview') as HTMLElement
    if (!previewComponent) {
      throw new Error('找不到预览内容')
    }

    const canvas = await html2canvas(previewComponent, {
      scale: 4,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
      removeContainer: true
    })

    const dimensions = getPageDimensions()
    const pdf = new jsPDF({
      orientation: settings.orientation as any,
      unit: 'mm',
      format: settings.pageSize as any
    })

    const ctx = canvas.getContext('2d')
    let actualHeight = canvas.height
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      for (let y = canvas.height - 1; y >= 0; y--) {
        let hasContent = false
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4
          if (imageData.data[idx] !== 255 || imageData.data[idx+1] !== 255 || imageData.data[idx+2] !== 255) {
            hasContent = true
            break
          }
        }
        if (hasContent) {
          actualHeight = y + 1
          break
        }
      }
    }

    const croppedCanvas = document.createElement('canvas')
    croppedCanvas.width = canvas.width
    croppedCanvas.height = actualHeight
    const croppedCtx = croppedCanvas.getContext('2d')
    if (croppedCtx) {
      croppedCtx.drawImage(canvas, 0, 0, canvas.width, actualHeight, 0, 0, canvas.width, actualHeight)
    }

    const pdfWidth = dimensions.width - settings.margin * 2
    const pdfHeight = dimensions.height - settings.margin * 2
    const imgHeight = (croppedCanvas.height * pdfWidth) / croppedCanvas.width
    const imgData = croppedCanvas.toDataURL('image/jpeg', settings.imageQuality)

    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, 'JPEG', settings.margin, settings.margin, pdfWidth, imgHeight)
    } else {
      const pageCount = Math.ceil(imgHeight / pdfHeight)
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage(settings.pageSize, settings.orientation as 'portrait' | 'landscape')
        }
        
        const sourceY = (i * pdfHeight * croppedCanvas.height) / imgHeight
        const sourceHeight = Math.min((pdfHeight * croppedCanvas.height) / imgHeight, croppedCanvas.height - sourceY)
        
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = croppedCanvas.width
        tempCanvas.height = sourceHeight
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCtx.drawImage(
            croppedCanvas,
            0, sourceY, croppedCanvas.width, sourceHeight,
            0, 0, croppedCanvas.width, sourceHeight
          )
          const pageImgData = tempCanvas.toDataURL('image/jpeg', settings.imageQuality)
          const pageImgHeight = (sourceHeight * pdfWidth) / croppedCanvas.width
          pdf.addImage(pageImgData, 'JPEG', settings.margin, settings.margin, pdfWidth, pageImgHeight)
        }
      }
    }

    const fileName = settings.fileName 
      ? `${settings.fileName}.pdf`
      : `简历_${new Date().getTime()}.pdf`

    pdf.save(fileName)
    
    ElMessage.success('简历导出成功！')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
  } finally {
    exporting.value = false
  }
}

const handlePreview = () => {
  window.print()
}

const resetSettings = () => {
  Object.assign(settings, {
    format: 'pdf',
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 10,
    fileName: '',
    imageQuality: 0.8
  })
  ElMessage.success('设置已恢复默认')
}

defineExpose({
  handleExport
})
</script>

<style scoped>
.export-settings {
  padding: 20px;
}

.export-tips {
  margin-top: 30px;
  padding: 16px;
  background-color: #f0f9ff;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.export-tips h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.export-tips ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.export-tips li {
  margin-bottom: 6px;
  line-height: 1.5;
}
</style>
