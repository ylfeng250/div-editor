<template>
  <div id="app">
    <div class="demo">
      <div-editor
        :min-height="100"
        :max-height="300"
        :palceholder="placeholder"
        v-model="userInput"
        class="publish-box"
        @sendMessage="sendMessage"
        >
        <div class="publish-title">基于Vue的富文本消息发布框</div>
      </div-editor>
      <hr>
      <h2>发送消息展示</h2>
      <p ref="message"></p>
    </div>
  </div>
</template>

<script>
import divEditor from './components/div-editor'
export default {
  name: 'App',
  components: {
    divEditor
  },
  data() {
    return {
      placeholder: '请输入你的想法',
      userInput: ''
    }
  },
  methods: {
    sendMessage(val) {
      const message = this.$refs.message
      message.textContent = val
    }
  }
}
</script>

<style>
#app {
  display: flex;
  justify-content: center;
}
.publish-box {
  width: 600px;
}
.publish-title {
  text-align: center;
}
.message {
  border: 1px solid;
  height: 400px;
  overflow: auto;
}
</style>
