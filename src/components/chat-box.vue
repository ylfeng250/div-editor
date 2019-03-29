<template>
  <div class="chat-box">
    <template v-for="(item,index) in items">
      <div :class="[item.origin ? 'self' : 'other']" class="message-item" :key="index + item.uname">
        <img
          class="user-head"
          src="https://tva1.sinaimg.cn/crop.0.0.750.750.180/006bQeGsjw8f1tgl7z9ncj30ku0kuq44.jpg"
          alt="大头"
        >
        <div class="message-info">
          <div class="message-head">
            <span class="user-name">{{ item.uname }}</span>
            <time class="pub-time" pubdate>{{ item.pubdate | fmtDatetime }}</time>
          </div>
          <div class="message-body" v-html="item.message"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.chat-box {
  font-size: 0.16rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.other {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.self {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
}

.message-item .user-head {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
}

.other .message-info {
  margin: 0.04rem 0.6rem 0.04rem 0.1rem;
}

.self .message-info {
  margin: 0.04rem 0.1rem 0.04rem 0.6rem;
}

.message-head {
  display: flex;
  flex-direction: row;
  color: rgb(169, 178, 191);
  margin: 0.1rem;
}

.self .message-head {
  flex-direction: row-reverse;
}

.user-name {
  margin: 0 0.05rem;
}

.message-body {
  position: relative;
  word-break: break-all;
  font-size: 0.18rem;
  margin: 0.1rem;
  padding: 0.06rem 0.08rem;
  border-radius: 0.1rem;
}

.other .message-body {
  background: rgb(245, 247, 250);
}

.other .message-body::before {
  position: absolute;
  left: -0.18rem;
  top: -0.01rem;
  content: "";
  /* background: red; */
  width: 0.18rem;
  height: 0.12rem;
  border-top-right-radius: 60% 50%;
  border-right: 0.08rem solid;
  border-color: rgb(245, 247, 250);
}

.self .message-body {
  color: #fff;
  background: rgb(0, 190, 255);
}

.self .message-body::after {
  position: absolute;
  right: -0.18rem;
  top: -0.01rem;
  content: "";
  /* background: red; */
  width: 0.18rem;
  height: 0.12rem;
  border-top-left-radius: 60% 50%;
  border-left: 0.08rem solid;
  border-color: rgb(0, 190, 255);
}
</style>

<script>
export default {
  name: "chat-box",
  props: {
    items: {
      default: []
    }
  },
  filters: {
    fmtDatetime (time) {
      var month = time.getMonth() + 1 // 月份
      var date = time.getDate() // 日期
      var hours = time.getHours() // 小时
      var miniutes = time.getMinutes() // 分钟
      return `${month}月${date}日 ${hours}:${miniutes}`
    },
    fmtMessage(str) {
      return '你好啊！！！'
    }
  }
};
</script>
