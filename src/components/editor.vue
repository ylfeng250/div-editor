<template>
<div class="edit-panel" :class="{'show-placeholder' : showPlaceholder}" :placeholder="placeholder">
  <div contenteditable="true" ref="editor" class="editor">
    <img src="" alt="12">
  </div>
  <span class="count" :class="{'font-red':textCount < 0}">{{ textCount }}</span>
</div>
</template>

<style scoped>
.edit-panel{
  display: inline-block;
  position: relative;
  width: 400px;
  height: auto;
  font-size: 14px;
  border: 1px solid;
}
.editor{
  position: relative;
  padding: 4px 8px;
  line-height: 20px;
  min-height: 100px;
  max-height: 200px;
  overflow: auto;
}
.show-placeholder::before{
  content: attr(placeholder);
  position: absolute;
  top: 4px;
  left: 8px;
  color: #555;
  pointer-events: none;
}
.edit-panel .count {
  position: absolute;
  color: #555;
  right: 1rem;
  bottom: 0.5rem;
  user-select: none;
  pointer-events: none;
}
.edit-panel .font-red {
  color: red;
}
</style>

<script>
import { getDomValue } from '../utils'
export default {
  name: 'editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    maxCount: {
      type: Number,
      default: 233
    },
    placeholder: {
      type: String,
      default: '请输入一些什么'
    }
  },
  data () {
    return {
      contentValue: ''
    }
  },
  mounted () {
    // 注册事件
    this.initEvent()
    // 初始化value值
    this.contentValue = this.value
  },
  destroyed () {
    // 删除事件
    this.removeEvent()
  },
  computed: {
    textCount() {
      return this.maxCount - this.contentValue.length
    },
    showPlaceholder() {
      return this.contentValue.length === 0 ? true : false
    }
  },
  watch: {
    contentValue (val, oldVal) {
      if (val.length === 0) {
        this.$refs.editor && (this.$refs.editor.textContent = '')
      }
    }
  },
  methods: {
    initEvent () {
      // 注册监听事件
      this.$refs.editor.addEventListener('focus', this.changeContentValue, true)
      this.$refs.editor.addEventListener('input', this.changeContentValue)
      this.$refs.editor.addEventListener('DOMSubtreeModified', this.changeContentValue)
    },
    removeEvent () {
      // 移除监听事件
      this.$refs.editor.removeEventListener('focus', this.changeContentValue, true)
      this.$refs.editor.removeEventListener('input', this.changeContentValue)
      this.$refs.editor.removeEventListener('DOMSubtreeModified', this.changeContentValue)
    },
    changeContentValue () {
      // 更新值
      this.contentValue =  getDomValue(this.$refs.editor).replace(/^\n/, '').replace(/\n$/, '')
      // 同时更行v-model绑定的值
      this.$emit('input', this.contentValue)
    }
  }
}
</script>