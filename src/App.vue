<template>
  <div id="app">
    <editor v-model="content"></editor>
  </div>
</template>
<style scoped>
</style>

<script>
import Editor from './components/editor'
export default {
  name: 'App',
  components: {
    Editor
  },
  data () {
    return {
      content: ''
    }
  }
}
</script>
