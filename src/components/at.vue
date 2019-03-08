<template>
  <div>
    <ul>
      <li></li>
    </ul>
  </div>
</template>

<style scoped>
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
        "孙悟空",
        "孙悟饭",
        "琪琪",
        "小林",
        "天津饭",
        "龟仙人",
        "比克",
        "布玛尔"
      ]
    };
  },
  mounted() {
    this.initEvent();
  },
  methods: {
    initEvent() {
      this.editor.addEventListener("input", this.handleChange)
      this.editor.addEventListener("DOMSubtreeModified", this.handleChange)
    },
    handleChange () {
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
        // @与光标之间的字符
        const filterText = fullText.substring(atIndex + 1)
        console.log(filterText)
      }
    }
  }
};
</script>
