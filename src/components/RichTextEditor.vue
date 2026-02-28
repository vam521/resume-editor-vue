<template>
  <div class="rich-text-editor">
    <div v-if="editor" class="editor-toolbar">
      <el-button-group size="small">
        <el-button
          :type="editor.isActive('bold') ? 'primary' : 'default'"
          @click="editor.chain().focus().toggleBold().run()"
          title="加粗"
        >B</el-button>
        <el-button
          :type="editor.isActive('italic') ? 'primary' : 'default'"
          @click="editor.chain().focus().toggleItalic().run()"
          title="斜体"
        >I</el-button>
        <el-button
          :type="editor.isActive('underline') ? 'primary' : 'default'"
          @click="editor.chain().focus().toggleUnderline().run()"
          title="下划线"
        >U</el-button>
        <el-button
          :type="editor.isActive('strike') ? 'primary' : 'default'"
          @click="editor.chain().focus().toggleStrike().run()"
          title="删除线"
        >S</el-button>
      </el-button-group>

      <el-button-group size="small" style="margin-left: 8px;">
        <el-button
          :type="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'"
          @click="editor.chain().focus().setTextAlign('left').run()"
          title="左对齐"
        >左</el-button>
        <el-button
          :type="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'"
          @click="editor.chain().focus().setTextAlign('center').run()"
          title="居中对齐"
        >中</el-button>
        <el-button
          :type="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'"
          @click="editor.chain().focus().setTextAlign('right').run()"
          title="右对齐"
        >右</el-button>
      </el-button-group>

      <el-button-group size="small" style="margin-left: 8px;">
        <el-button
          @click="editor.chain().focus().toggleBulletList().run()"
          title="项目符号"
        >•</el-button>
        <el-button
          @click="editor.chain().focus().toggleOrderedList().run()"
          title="编号列表"
        >1.</el-button>
      </el-button-group>

      <el-select
        v-model="headingLevel"
        size="small"
        style="width: 100px; margin-left: 8px;"
        placeholder="标题"
        @change="changeHeading"
      >
        <el-option label="正文" value="0" />
        <el-option label="标题 1" value="1" />
        <el-option label="标题 2" value="2" />
        <el-option label="标题 3" value="3" />
      </el-select>

      <el-button-group size="small" style="margin-left: 8px;">
        <el-button
          @click="editor.chain().focus().undo().run()"
          title="撤销"
        >↶</el-button>
        <el-button
          @click="editor.chain().focus().redo().run()"
          title="重做"
        >↷</el-button>
      </el-button-group>
    </div>

    <div class="editor-content">
      <editor-content :editor="editor" class="tiptap-editor" />
    </div>

    <div class="editor-footer">
      <span class="char-count">{{ charCount }} 字符</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'


const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const headingLevel = ref('0')

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Typography,
    Placeholder.configure({
      placeholder: props.placeholder || '请输入内容...',
    }),
    CharacterCount,
  ],
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
  },
})

const charCount = computed(() => {
  return editor.value ? editor.value.storage.characterCount.characters() : 0
})

const changeHeading = (level: string) => {
  if (!editor.value) return

  const levelNum = parseInt(level)
  if (levelNum === 0) {
    editor.value.chain().focus().setParagraph().run()
  } else {
    editor.value.chain().focus().toggleHeading({ level: levelNum as any }).run()
  }
}

watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue, {})
  }
})

watch(() => editor.value, (newEditor) => {
  if (newEditor) {
    // 监听标题变化以更新选择器
    newEditor.on('selectionUpdate', () => {
      if (newEditor.isActive('heading', { level: 1 })) {
        headingLevel.value = '1'
      } else if (newEditor.isActive('heading', { level: 2 })) {
        headingLevel.value = '2'
      } else if (newEditor.isActive('heading', { level: 3 })) {
        headingLevel.value = '3'
      } else {
        headingLevel.value = '0'
      }
    })
  }
})

onMounted(() => {
  if (editor.value && props.modelValue) {
    editor.value.commands.setContent(props.modelValue, {})
  }
})

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  padding: 8px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.editor-content {
  min-height: 150px;
  padding: 12px;
}

.tiptap-editor {
  min-height: 120px;
  outline: none;
}

.tiptap-editor :deep(.ProseMirror) {
  min-height: 100px;
  padding: 8px;
  outline: none;
  cursor: text;
}

.tiptap-editor :deep(.ProseMirror:focus) {
  outline: none;
}

.tiptap-editor :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.tiptap-editor :deep(p) {
  margin: 0.5em 0;
}

.tiptap-editor :deep(h1) {
  font-size: 1.5em;
  margin: 0.8em 0 0.4em;
}

.tiptap-editor :deep(h2) {
  font-size: 1.3em;
  margin: 0.7em 0 0.35em;
}

.tiptap-editor :deep(h3) {
  font-size: 1.1em;
  margin: 0.6em 0 0.3em;
}

.tiptap-editor :deep(ul),
.tiptap-editor :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.tiptap-editor :deep(li) {
  margin: 0.2em 0;
}

.editor-footer {
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-top: 1px solid #dcdfe6;
  text-align: right;
  font-size: 12px;
  color: #909399;
}
</style>