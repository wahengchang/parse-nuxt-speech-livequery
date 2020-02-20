<template>
  <div class="container">
    <!-- Header -->

    <header id="header" :style='{"background-color": "#225473"}'>
      <a class="logo" href="/">Speech To Text Online</a>
    </header>

    <section class="wrapper" id="main">
      <div class="inner">
        <h2>Hi {{username}}</h2>
        <div class="chatroomContainer" v-if="isInited">
          <div class="actionContainer">
            <input
              type="text"
              name="msg"
              v-model="msg"
              placeholder="Enter your message"
              :disabled="isSubmiting"
            />
            <button class="button primary" @click="onClickAddMsg" :disabled="isSubmiting">add</button>
          </div>
          <div class="messageContainer">
            <div class="row" v-for="item of msgList" :key="item.id">
              <span class="username">{{item.ownerName}}</span>
              <span class="title">{{item.message}}</span>
              <span class="owner">{{simpleDateFormat(item.createdAt)}}</span>
            </div>
          </div>
        </div>

        <div v-else>lodaing...</div>
      </div>
    </section>
  </div>
</template>

<script>
import Parse from "parse";
export default {
  name: "secret",
  data() {
    return {
      email: null,
      createdAt: null,
      username: null,
      msg: "",
      msgList: [],
      livequerySubscription: null,
      isInited: false,
      isSubmiting: false
    };
  },
  async mounted() {
    const user = Parse.User.current();
    const { username, createdAt, email } = user.toJSON();
    this.username = username;
    this.createdAt = createdAt;
    this.email = email;

    await this.init();
  },
  methods: {
    init: async function() {
      this.isInited = false;
      await this.initLivequery();

      const query = new Parse.Query("Chatrooms");
      query.descending("createdAt");
      query.limit(20);
      const result = await query.find();
      this.msgList = result.map(item => item.toJSON());
      this.isInited = true;
    },
    initLivequery: async function() {
      const query = new Parse.Query("Chatrooms");
      this.livequerySubscription = await query.subscribe();
      this.livequerySubscription.on("open", () => {
        console.log("this.livequerySubscription opened");
      });
      this.livequerySubscription.on("create", cRoom => {
        this.msgList.unshift(cRoom.toJSON());
      });
      this.livequerySubscription.on("enter", cRoom => {
        console.log(cRoom.get("msg"), " enter"); // This should output Mengyan
      });
      this.livequerySubscription.on("update", cRoom => {
        console.log(cRoom.get("msg"), "update"); // This should output 100
      });
    },
    onClickAddMsg: async function() {
      const { msg = "" } = this;
      const user = Parse.User.current();
      this.isSubmiting = true;

      const Chatrooms = Parse.Object.extend("Chatrooms");
      const cRoom = new Chatrooms();

      cRoom.set("message", msg);
      cRoom.set("owner", user);
      cRoom.set("ownerName", user.get("username"));
      await cRoom.save();
      console.log("cRoom is saved");
      this.isSubmiting = true;
    },
    simpleDateFormat: function(_today) {
      const today = typeof _today === "string" ? new Date(_today) : _today;

      const addZero = num => (num < 10 ? `0${num}` : num);

      const dd = addZero(today.getDate());
      const mm = addZero(today.getMonth() + 1);
      const yyyy = addZero(today.getFullYear());
      const h = addZero(today.getHours());
      const m = addZero(today.getMinutes());

      return `${yyyy}/${mm}/${dd}-${h}:${m}`;
    }
  },
  components: {}
};
</script>

<style scoped>
.messageContainer {
  width: 400px;
  margin: auto;
}
.row {
  width: 100%;
  line-height: 30px;
  border-bottom: solid gray 1px;
}
.row .title {
  width: 30%;
  display: inline-block;
}
.row .username {
  width: 30%;
  display: inline-block;
}
.row .owner {
  width: 30%;
}
</style>