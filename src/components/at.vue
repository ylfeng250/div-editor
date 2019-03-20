<template>
  <div v-show="shown" :style="{left:cleft,top:ctop}" class="at-box">
    <ul class="userlist">
      <li v-for="(user, index) in filterUser" 
        :key="user" 
        :class="{mousehover: index === selctedIndex}"
        @mouseover="handleMouseover(index)"
        > {{user}} </li>
    </ul>
  </div>
</template>

<style scoped>
.at-box {
  position: absolute;
  background: #fff;
}
.userlist {
  width: 80px;
  overflow: auto;
  margin: 0;
  padding: 0 3px;
  border: 1px solid;
  border-radius: 5px;
}
.userlist li {
  cursor: pointer;
}
.userlist li:hover {
  color: blue;
}
.mousehover{
  color: blue;
}
</style>


<script>
import { getCursortPosition, debounce } from "../utils/index";
export default {
  name: "at",
  props: {
    editor: {}
  },
  data() {
    return {
      user: [
        '孙悟空',
        '孙悟饭',
        '琪琪',
        '小林',
        '天津饭',
        '龟仙人',
        '比克',
        '布玛尔',
        '弗利萨',
        '18号'
      ],
      filterUser: [],
      shown: false,
      top: 0,
      left: 0,
      selctedIndex: 0,
      maxUserNum: 6
    };
  },
  computed: {
    ctop() {
      return this.top + 'px'
    },
    cleft() {
      return this.left + 'px'
    }
  },
  mounted() {
    this.initEvent();
    this.updateView()
  },
  methods: {
    initEvent() {
      // 对输入框添加监听事件
      this.editor.addEventListener('input', this.handleChange)
      this.editor.addEventListener('DOMNodeInserted', this.handleChange)
      this.editor.addEventListener('keyup', this.handleKeyup)
      this.editor.addEventListener('focus', this.handleChange)
    },
    handleChange (e) {
      debounce(this.updateView, 300)()
    },
    updateView() {
      // 当前光标的位置
      const end = getCursortPosition(this.editor)
      // 获取光标前 10个字符
      const fullText = this.editor.value.substring(end - 10, end)
      // 获取@的位置
      const atIndex = fullText.indexOf("@")

      if (atIndex !== -1) {
        this.shown = true
        this.changePlace()
        // @与光标之间的字符
        const filterText = fullText.substring(atIndex + 1)
        // 判断是否为合法字符
        const regx = /^[\u4e00-\u9fa5_a-zA-Z0-9]*$/ // 匹配合法用户的正则
        if (regx.test(filterText)) {
          this.handleFilterUser (filterText)
        } else {
          this.shown = false
        }
      } else {
        this.shown = false
      }
    },
    // 过滤用户列表
    handleFilterUser (filterText) {
      this.filterUser = []
      this.user.forEach((u) => {
        if(u.match(filterText)) {
          this.filterUser.push(u)
        }
      })
      this.filterUser = this.filterUser.sort().slice(0, this.maxUserNum)
    },
    changePlace() {
      // 修改选择框的位置
      try {
        const range = window.getSelection().getRangeAt(0)
        const rangePoint = range.getBoundingClientRect()
        const editorPoint = this.editor.getBoundingClientRect()
        this.top = rangePoint.top - editorPoint.top + 26
        this.left = rangePoint.left - editorPoint.left + 8
      } catch(e) {
        console.log('出错')
      }
    },
    // 处理按键触发
    handleKeyup (e) {
      if (!this.shown) {
        return
      }
      // ↓
      if (e.keyCode === 40) {
        this.selctedIndex = (this.selctedIndex + 1) % this.filterUser.length
      } 
      // ↑
      if (e.keyCode === 38) {
        const index = (this.selctedIndex - 1) % this.filterUser.length
        this.selctedIndex = index >= 0 ? index : 0
      }
    },
    handleMouseover(index) {
      this.selctedIndex = this.filterUser.length + 1
    } 
  }
};
</script>
