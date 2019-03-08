<template>
  <div class="edit-box">
    <div
      class="edit-panel"
      :class="{'show-placeholder' : showPlaceholder}"
      :placeholder="placeholder"
    >
      <div contenteditable="true" ref="editor" class="editor"></div>
      <span class="count" :class="{'font-red':textCount < 0}">{{ textCount }}</span>
    </div>
    <div class="edit-bottom">
      <emoji-box @select="selectEmoji"></emoji-box>
      <button class="send-btn" @click="sendMessage">发送</button>
    </div>
    <hr>
    <div class="show"></div>
  </div>
</template>

<style scoped>
.edit-box {
  width: 400px;
  height: auto;
}
.edit-panel {
  position: relative;
  width: 100%;
  height: auto;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid;
}
.editor {
  position: relative;
  padding: 4px 8px;
  line-height: 20px;
  min-height: 100px;
  max-height: 200px;
  overflow: auto;
}
.show-placeholder::before {
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
.edit-bottom {
  display: flex;
  justify-content: space-between;
}
</style>

<script>
import { getDomValue, emojiMap } from "../utils";
import EmojiBox from "./emoji-box";
export default {
  name: "editor",
  props: {
    value: {
      type: String,
      default: ""
    },
    maxCount: {
      type: Number,
      default: 233
    },
    placeholder: {
      type: String,
      default: "请输入一些什么"
    }
  },
  components: {
    EmojiBox
  },
  data() {
    return {
      contentValue: ""
    };
  },
  mounted() {
    // 注册事件
    this.initEvent();
    // 初始化value值
    this.contentValue = this.value
  },
  beforeDestroy() {
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
    contentValue(val, oldVal) {
      if (val.length === 0) {
        this.$refs.editor && (this.$refs.editor.textContent = "")
      }
    }
  },
  methods: {
    initEvent() {
      // 注册监听事件
      this.$refs.editor.addEventListener(
        "focus",
        this.changeContentValue,
        true
      )
      this.$refs.editor.addEventListener("input", this.changeContentValue);
      this.$refs.editor.addEventListener(
        "DOMSubtreeModified",
        this.changeContentValue
      )
      this.$refs.editor.addEventListener(
        "paste",
        this.onPaste
      )
    },
    removeEvent() {
      // 移除监听事件
      this.$refs.editor.removeEventListener(
        "focus",
        this.changeContentValue,
        true
      )
      this.$refs.editor.removeEventListener("input", this.changeContentValue);
      this.$refs.editor.removeEventListener(
        "DOMSubtreeModified",
        this.changeContentValue
      )
      this.$refs.editor.removeEventListener(
        "paste",
        this.onPaste
      )
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
    changeContentValue() {
      // 更新值
      this.contentValue = getDomValue(this.$refs.editor)
        .replace(/^\n/, "")
        .replace(/\n$/, "")
      // 同时更行v-model绑定的值
      this.$emit("input", this.contentValue)
    },
    // 处理选中的表情
    selectEmoji (emoji) {
      var img = `<img src="${emojiMap[emoji]}" alt="${emoji}" style="vertical-align:-6px; display: inline-block">`
      document.execCommand('insertHTML', false, img)
    },
    // 发送消息
    sendMessage () {
      var show = document.querySelector('.show')
      console.log(this.contentValue)
      show.textContent = JSON.stringify(this.contentValue)
    }
  }
};
</script>