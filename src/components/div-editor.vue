<template>
<div>
  <slot></slot>
  <div 
    class="edit-box" 
    :placeholder="placeholder"
    :class="{'show-placeholder':showPlaceholder}">
    <div 
    :style="{'min-height':minh,'max-height':maxh }"
    class="edit-panel" 
    contenteditable="true" 
    ref="editor"></div>
    <span class="input-num">{{ inputNum }}</span>
    <at :users="users" :textarea="textarea" v-if="isMounted" @select="handleSelectUser">
      <template v-slot:item="user">
        <span>{{user.item}}</span>
      </template>
    </at>
  </div>
  <div class="publish-tools">
    <div class="icon-btn">
      <a 
        class="emoji tools-btn" 
        title="表情" 
        ref="emojiBtn"
        href="javascript:void(0)">🙂表情</a>
      <a 
        class="topic tools-btn" 
        title="话题" 
        href="javascript:void(0)" 
        @click="addTopic"
        @mousedown="OnMousedown">#话题</a>
    </div>
    <button class="submit" title="发布" @click="sendMessage">发布</button>
  </div>
  <emoji-box 
    v-if="isMounted" 
    :emojiBtn="emojiBtn"
    @select="selectEmoji">
  </emoji-box>
</div>
</template>

<style>
  .edit-box {
    position: relative;
    border: 1px solid;
    border-radius: 5px;
    padding: 4px 6px;
    height: auto;
    font-size: 14px;
    line-height: 20px;
  }
  .show-placeholder::before {
    content: attr(placeholder);
    color: #555;
    pointer-events: none;
    position: absolute;
  }
  .edit-panel {
    /* 去掉外发光 */
    outline: none;
    overflow: auto;
  }
  .input-num {
    position: absolute;
    bottom: 4px;
    right: 6px;
    color: #555;
    pointer-events: none;
  }
  .publish-tools {
    display: flex;
    flex-direction:row;
    justify-content: space-between;
    margin-top: 4px; 
    vertical-align: baseline;
  }
  .publish-tools .icon-btn {
    display: flex;
  }
  .publish-tools .tools-btn {
    color: dimgrey;
    text-decoration:none;
    margin-right: 8px; 
  }
  .publish-tools .tools-btn:hover{
    color:orangered;
  }
  .submit {
    align-self: flex;
    cursor: pointer;
    font-size: 14px;
    width: 60px;
    height: 28px;
    border: #38b7e9;
    background: #3fc0f3;
  }
  .submit:hover {
    background: #38b7e9;
  }
  .user-btn {
    background: transparent;
    margin: 0;
    padding: 0;
    border-style: none; 
    color: #38b7e9;
  }
</style>

<script>
import { getDomValue, emojiMap, insertHtmlAtCaret, getCursortPosition } from "../utils"

import emojiBox from './emoji-box'
import At from './at'
export default {
  name: 'div-editor',
  props: {
    // 输入框的最小高度
    minHeight: {
      default: 100
    },
    // 输入框的最大高度
    maxHeight: {
      default: 300
    },
    // placeholder 提示文字
    placeholder: {
      default: '请输入的想法'
    },
    // 能够输入的最大字数
    maxCount: {
      default: 233
    },
    // 用于v-model绑定
    value: {}
  },
  components: {
    emojiBox,
    At
  },
  data() {
    return {
      contentValue: '',
      defaultTopic: '请输入一个话题',
      isMounted: false,
      users: ['孙悟空', '孙悟饭', 'jack', 'tom', 'bob', 'jk', 'lalala', '18号', 'No.96']
    }
  },
  computed: {
    minh() {
      return parseFloat(this.minHeight) + 'px'
    },
    maxh() {
      return parseFloat(this.maxHeight) + 'px'
    },
    showPlaceholder() {
      // 判断是否有内容显示 placeholder
      return this.contentValue.length === 0
    },
    inputNum() {
      let maxCount = this.maxCount || 233
      return maxCount - this.contentValue.length
    }
  },
  mounted() {
    // 初始化的时候让输入框自动聚焦
    this.$nextTick(() => {
      this.textarea = this.$refs.editor
      this.$refs.editor.focus()
      this.isMounted = true
      this.emojiBtn = this.$refs.emojiBtn
    })
    
    this.initEvent()
  },
  beforeDestroy() {
    // 删除事件
    this.removeEvent()
  },
  methods: {
    OnMousedown(event) {
      event.preventDefault()
    },
    onPaste (e) {
      e.preventDefault()
      let text = ''

      if (window.clipboardData && window.clipboardData.setData) {
        // IE
        text = window.clipboardData.getData('text')
      } else {
        text = (e.originalEvent || e).clipboardData.getData('text/plain') || ''
      }
      // 过滤转义html标签
      text = text.replace(/</g, '&lt').replace(/>/g, '&gt')
      text = text.replace(/\r\n/g, '<br>')
      document.execCommand('insertHTML', false, text)
    },
    initEvent() {
      this.$refs.editor.addEventListener('focus', this.changeContentValue)
      this.$refs.editor.addEventListener('input', this.changeContentValue)
      this.$refs.editor.addEventListener('DOMNodeInserted', this.changeContentValue)
    },
    removeEvent() {
      this.$refs.editor.removeEventListener('focus', this.changeContentValue)
      this.$refs.editor.removeEventListener('input', this.changeContentValue)
      this.$refs.editor.removeEventListener('DOMNodeInserted', this.changeContentValue)
    },
    changeContentValue() {
      // 更新值
      this.contentValue = getDomValue(this.$refs.editor)
        .replace(/^\n/, "")
        .replace(/\n$/, "")
      this.$refs.editor.value = this.contentValue
      // 同时更行v-model绑定的值
      this.$emit("input", this.contentValue)
    },
    // 添加话题
    addTopic(e) {
      this.$refs.editor.focus()
      insertHtmlAtCaret('#')
      insertHtmlAtCaret(this.defaultTopic)
      insertHtmlAtCaret('#')
      var range = window.getSelection().getRangeAt(0)
      range.selectNodeContents(range.startContainer.childNodes[range.startOffset - 2])
    },
    // 插入表情
    selectEmoji(emoji) {
      var img = `<img src="${emojiMap[emoji]}" alt="${emoji}" style="vertical-align:-6px; display: inline-block">`
      document.execCommand('insertHTML', false, img)
    },
    handleSelectUser(user) {
      // 获取输入框中的值
      const fullText = this.textarea.value
      // 获取光标位置
      const end = getCursortPosition(this.textarea)
      // 光标之前用户名最大可能长度的文本
      const content = fullText.slice(end-this.maxLength, end)
      // 获取离光标最近的一个@的位置
      const lastAtIndex = content.lastIndexOf('@')
      const offset = end - lastAtIndex
      // 删除之前的内容
      var range = window.getSelection().getRangeAt(0)
      range.setStart(range.endContainer, range.endOffset - offset)
      range.deleteContents()
      // 插入选中的user
      var input = `<button contenteditable="false" class="user-btn">@${user}&nbsp;</button>`
      insertHtmlAtCaret(input)
    },
    // 发送消息
    sendMessage (event) {
      const textContent = JSON.stringify(this.contentValue)
      this.$emit('sendMessage', textContent)
    },
  }
}
</script>