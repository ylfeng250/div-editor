<template>
  <div ref="emojibox" v-if="isShowEmojiBox" class="emojibox">
    <div class="box-title">
      <span>表情</span>
      <span class="close-btn" @click="hidden">X</span>
    </div>
    <ul class="emoji-list" @click="selectEmoji">
      <li v-for="(url,emoji) in emojiMap" :key="emoji" class="emoji-item">
        <img :src="url" :alt="emoji" :title="emoji">
      </li>
    </ul>
  </div>
</template>

<style scoped>
.emojibox {
  width: 200px;
  border: 1px solid;
  position: absolute;
  background: #ffffff;
  flex-direction: column;
  display: flex;
}
.box-title {
  display: flex;
  justify-content: space-between;
}
.emoji-list {
  height: auto;
  margin: 0px;
  padding: 2px;
  display: flex;
  flex-basis: 100%;
  flex-wrap: wrap;
  align-items: flex-start;
}
.emoji-item {
  list-style: none;
  cursor: pointer;
  border: 1px solid #ffffff;
}
.emoji-item:hover {
  border: 1px solid blue;
}
.close-btn {
  cursor: pointer;
  color: #555;
}
.close-btn:hover{
  color: black;
}
</style>

<script>
import { emojiMap } from "../utils/emojis"
export default {
  name: "emoji-box",
  props: {
    emojiBtn: {}
  },
  data() {
    return {
      emojiMap: emojiMap,
      isShowEmojiBox: false
    };
  },
  mounted() {
    this.emojiBtn.addEventListener("click", this.isShow)
  },
  methods: {
    isShow() {
      this.isShowEmojiBox = true
    },
    hidden() {
      this.isShowEmojiBox = false
    },
    selectEmoji(event) {
      var emoji = event.target
      if (emoji.nodeName === "IMG") {
        this.$emit("select", emoji.alt)
      }
    }
  }
};
</script>