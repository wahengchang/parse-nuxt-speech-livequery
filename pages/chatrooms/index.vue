<template>
  <div class="container">
    <!-- Header -->
			<header id="header" :style='{"background-color": "#225473"}'>
      <a class="logo" href="/">Speech To Text Online</a>
    </header>

    <section class="wrapper" id="main">
      <div class="inner">
        <div class="content" v-if="isInited">
          <h1>Chatrooms <button @click='onClickCreate' class="button fa fa-plus small" :disabled="isSubmiting"></button></h1> 
          <a :href='`/chatrooms/${item.objectId}`' class='row' v-for='item in msgList' :key='item.id'>
            <div class='leftBox'>
              <span class='title'>{{item.title || '--'}}</span>
              <span class='username'>{{item.ownerName}}</span>
            </div>
            <span class='date'>{{easyReadDateFormat(item.createdAt)}}</span>
          </a>
        </div>
        <div v-else>lodaing...</div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import SpeechToText from "@/components/SpeechToText";
import langList from "~/components/SpeechToText/config.js";
import Footer from '~/components/Footer.vue'
import Parse from "parse";
import time from '~/lib/time'

export default {
  components: {
    Logo,
    SpeechToText,
    Footer
  },
  computed: {
  },
  data() {
    return {
      isInited: false,
      msgList: null,
      isSubmiting: false
    }
  },
  mounted: async function() {
    await this.init()
  },
  methods: {
    init: async function() {
      this.isInited = false;
      const query = new Parse.Query("Chatrooms");
      query.descending("createdAt");
      const result = await query.find();
      this.msgList = result.map(item => item.toJSON());
      this.isInited = true;
    },
    onClickCreate: async function() {
      const title = prompt("Please enter your name", "Harry Potter");

      if(!title) {
        alert('Title is required!')
        throw new Error('Title is required!')
      }

      const user = Parse.User.current();
      this.isSubmiting = true;

      const Chatrooms = Parse.Object.extend("Chatrooms");
      const cRoom = new Chatrooms();
      cRoom.set("title", title);
      cRoom.set("owner", user);
      cRoom.set("ownerName", user.get("username"));
      const result = await cRoom.save();

      this.$router.push(`/chatrooms/${result.id}`)
      this.isSubmiting = false
    },
    easyReadDateFormat: time.easyReadDateFormat
  }
};
</script>

<style scoped>
.row {
  margin-top: 20px;
  border-top: 1px solid gray;
}
.leftBox {
  display: flex;
  flex-direction: column;
  width: 60%;
}
.leftBox .title{
  font-size: 20px;
}
.leftBox .username{

}
.leftBox .date{

}
</style>
