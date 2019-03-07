<template>
  <div id="app">
    <editor v-model="content"></editor>
  </div>
</template>

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
