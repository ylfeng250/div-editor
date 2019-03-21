<template>
  <div class="at-panel" :style="style" v-if="atwho">
    <ul class="at-list" ref="userList">
      <li 
        v-for="(user, index) in atwho.users" 
        :key="index"
        :class="{'at-high-light': index === atwho.cur}"
        @click="selectUser"
        @mousedown="OnMouseDown"
        @mouseover="handleMouseover(index)"
        class="at-item">
        <slot name="item" :item="user">
          <span> {{user}}</span>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
import { getCursortPosition } from "../utils"
export default {
  name: 'at',
  props: {
    // 用户列表
    users: {
      type: Array,
      default: []
    },
    // 绑定的输入框
    textarea: {}
  },
  data() {
    return {
      // 用来记录过滤的用户列表和其他基本信息
      atwho: null,
      // 最长10个字符
      maxLength: 10,
    }
  },
  watch: {
    atwho: {
      handler() {
        if(this.atwho && this.atwho.cur !== void 0) {
          this.$nextTick(() => {
            const index = this.atwho.cur
            const userList = this.$refs.userList.parentNode
            if (index * 24 > userList.scrollTop + 100) { // 向下选择超出视窗区域
              userList.scrollTop = index * 24 - 100
            } else if (index * 24 < userList.scrollTop) { // 向上选择超出视窗区域
              userList.scrollTop = index * 24
            }
          })
        }
      },
      deep: true
    }
  },
  computed: {
    // 出现的位置
    style() {
      if(!this.atwho) {
        return {
          top:'0px',
          left:'0px'
        }
      }
      return {
        top: this.atwho.top + 'px',
        left: this.atwho.left + 'px'
      }
    }
  },
  mounted() {
    this.initEvent()
  },
  methods: {
    OnMouseDown(e) {
      e.preventDefault()
    },
    isTextareaViald() {
      return this.textarea && this.textarea.contentEditable
    },
    initEvent() {
      if (this.isTextareaViald()) {
        this.textarea.addEventListener('input', this.handleInput)
        this.textarea.addEventListener('keydown', this.handleKeyDown)
      }
    },
    removeEvent() {
      this.textarea.removeEventListener('input', this.handleInput)
      this.textarea.removeEventListener('keydown', this.handleKeyDown)
    },
    show(filterUsers) {
      const func = () => {
        var atwho = {}
        // users
        atwho.users = filterUsers
        // top && left
        var sel = window.getSelection()
        if (sel) {
          const range = sel.getRangeAt(0)
          const textareaRect = this.textarea.getBoundingClientRect()
          const rangeRect = range.getBoundingClientRect()
          const top = rangeRect.y - textareaRect.y + 28
          const left = rangeRect.x - textareaRect.x + 10
          atwho.top = top
          atwho.left = left
        }
        // 当前列表中的索引
        atwho.cur = 0
        this.atwho = atwho
      }
      if(this.atwho) {
        func()
      } else {
        setTimeout(func, 10)
      }
    },
    hiden() {
      this.atwho = null
    },
    // 处理用户输入
    handleInput() {
      // 获取输入框中的值
      const fullText = this.textarea.value.replace(/\n/g, '')
      // 获取光标位置
      const end = getCursortPosition(this.textarea)
      // 光标之前用户名最大可能长度的文本
      const content = fullText.slice(end-this.maxLength, end)
      // 获取离光标最近的一个@的位置
      const lastAtIndex = content.lastIndexOf('@')
      if(lastAtIndex > -1) {
        // 说明输入了@ 截取@到光标之间的字符串
        const targetText = content.slice(lastAtIndex + 1)
        const regx = /[^\u4e00-\u9fa5\w-]/ 
        if(/^\s/.test(targetText) || targetText.match(regx)) {
          // 以空白符开头 或者包含不合法字符
          this.hiden()
        } else {
          // 合法的用户输入
          const filterUsers = this.users.filter((user) => {
            const u = user.toLowerCase()
            if (u.match(targetText.toLowerCase())) {
              return true
            }
            return false
          })
          if (filterUsers.length > 0) {
            this.show(filterUsers)
          } else {
            this.hiden()
          }
        }
      } else {
        this.hiden()
      }
    },
    handleKeyDown(e) {
      const atwho = this.atwho
      if (atwho) {
        if (e.keyCode === 38 || e.keyCode === 40) {
          // ↑ ↓
          if (!(e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            e.stopPropagation()
            this.handleKeyBoardSelect(e)
          }
          return
        }
        if (e.keyCode === 13) {
          // 按下回车键
          this.selectUser()
          e.preventDefault()
          e.stopPropagation()
        }
      }
    },
    handleKeyBoardSelect(e) {
      // 处理键盘的上下输入
      const offset = e.keyCode === 38 ? -1 : 1
      const { cur, users } = this.atwho
      // 循环的计算
      const next = Math.max(0, Math.min(cur + offset, users.length - 1))
      this.atwho = {
        ...this.atwho,
        cur: next
      }
    },
    handleMouseover(index) {
      this.atwho.cur = index
    },
    selectUser() {
      // 选择之后隐藏列表
      this.$nextTick(() => {
        this.atwho = null
      })
      this.$emit('select', this.atwho.users[this.atwho.cur])
    }
  }
}
</script>

<style scoped>
  .at-panel {
    position: absolute;
    margin: 0;
    padding: 0;
    background: #fff;
    border-radius: 5px;
    border: 1px solid;
    font-size: 14px;
    line-height: 24px;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
    min-width: 120px;
    z-index: 11110 !important;
    overflow: auto;
  }
  ul.at-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 135px;
  }
  ul.at-list li.at-item {
    box-sizing: border-box;
    margin-left: 4px; 
    cursor: pointer;
  }
  li.at-item span {
    overflow: hidden;
  }
  .at-high-light {
    color: blue;
  }
</style>