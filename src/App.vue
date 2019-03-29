<template>
  <div id="app">
    <div class="demo">
      <div-editor
        :min-height="100"
        :max-height="300"
        :placeholder="placeholder"
        v-model="userInput"
        class="publish-box"
        @sendMessage="sendMessage"
        >
        <div class="publish-title">基于Vue的富文本消息发布框</div>
      </div-editor>
      <hr>
      <h2>发送消息展示</h2>
      <chat-box :items="messageItems"></chat-box>
    </div>
  </div>
</template>

<script>
import divEditor from './components/div-editor'
import chatBox from './components/chat-box'
export default {
  name: 'App',
  components: {
    divEditor,
    chatBox
  },
  data() {
    return {
      placeholder: '请输入你的想法',
      userInput: '',
      messageItems: [{
        origin:0,
        uname:'大头',
        pubdate:new Date(),
        message: 'hello world'
      }]
    }
  },
  methods: {
    sendMessage(val) {
      // const message = this.$refs.message
      // message.textContent = val
      var obj = {
        origin:1,
        uname:'测试',
        pubdate: new Date(),
        message: val.html
      }
      this.messageItems.push(obj)
    }
  }
}
</script>

<style>
#app {
  display: flex;
  justify-content: center;
}
.demo {
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
