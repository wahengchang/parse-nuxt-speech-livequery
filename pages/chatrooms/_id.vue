<template>
  <div class="container">
    <!-- Header -->
			<header id="header" :style='{"background-color": "#225473"}'>
      <a class="logo" href="/">Speech To Text Online</a>
    </header>

    <select :disabled='isSpeechOn' v-model="selectedLangId">
      <option v-for='item in langList' :value="item.value" :key='item.display'>{{item.display}}</option>
    </select>
    <!-- {{langObj && langObj.display || '--'}} -->
    <div class="buttonBorder" v-if='selectedLangId' @click="()=> isSpeechOn=!isSpeechOn">
      <span :class="recordButton"></span>
    </div>
    <SpeechToText
      :lang="selectedLangId"
      v-if="isSpeechOn && !isRestartingSpeech && selectedLangId"
      :onRuntimeEnd="onRuntimeEnd"
    />

    <div class='messageContainer'>
      <div class='row' v-for='item of messageList' :key='item.id'>
        <span class='username'>{{item.ownerName}}</span>
        <span class='title'>{{item.message}}</span>
      </div>
    </div>

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

const sleep =(second = 1) => new Promise((resolve)=> setTimeout(() => {
  return resolve()
}, second* 1000))

export default {
  components: {
    Logo,
    SpeechToText,
    Footer
  },
  computed: {
    recordButton: function() {
      const _class = this.isSpeechOn ? " Rec" : "";
      return "styleSpeechButton" + _class;
    },
    langObj: function() {
      const id = 'yue-Hant-HK'
      return langList.find(item => item.value === id);
    },
  },
  data() {
    return {
      isInited: false,
      chatroom: null,
      chatroomRaw: null,
      messageList: [],
      isSubmiting: false,
      isSpeechOn: false,
      isRestartingSpeech: false,
      value: '',
      onRuntimeTimestamp: new Date().getTime(),
      livequerySubscription: null,
      selectedLangId: 'en-US',
      langList
    }
  },
  mounted: async function() {
    await this.init()
  },
  methods: {
    init: async function() {
      const { id = null } = this.$route.params;

      this.isInited = false;

      //fetch Chatrooms
      const cRoom = await this.fetchChatroom(id)

      //fetch Message of Chatrooms
      const messageList = await this.fetchMessageList(cRoom)
      this.messageList = messageList.map(item => item.toJSON())
      this.chatroom = cRoom.toJSON()
      this.chatroomRaw = cRoom

      // init livequery
      this.initLivequery()

      this.isInited = true;
    },
    fetchChatroom: function(id) {
      const query = new Parse.Query("Chatrooms");
      return query.get(id)
    },
    fetchMessageList: function(cRoom) {
      const query = new Parse.Query("Messages");
      query.descending("createdAt")
      query.limit(20)
      query.equalTo('chatroom', cRoom)
      return query.find();
    },
    initLivequery: async function() {
      const query = new Parse.Query('Messages')
      this.livequerySubscription = await query.subscribe()
      this.livequerySubscription.on('open', () => {
        console.log('this.livequerySubscription opened');
      });
      this.livequerySubscription.on('create', (msgObj) => {
        this.messageList.unshift(msgObj.toJSON());
      });
      this.livequerySubscription.on('enter', (msgObj) => {
        console.log(msgObj.get('message'), ' enter'); // This should output Mengyan
      });
      this.livequerySubscription.on('update', (msgObj) => {
        console.log(msgObj.get('message'), 'update'); // This should output 100
      })
    },
    onRuntimeEnd: async function(textObj = {}) {
      const { runtimeText } = textObj;

      const {onRuntimeTimestamp} = this
      const currentTimestamp = new Date().getTime()
      const dTimeStamp = currentTimestamp - onRuntimeTimestamp

      if(!runtimeText || runtimeText.length <=0) return

      if(dTimeStamp <= 1000) return

      await this.addingMessage(runtimeText)
      console.log('send ...', runtimeText)

      this.isRestartingSpeech = true
      await sleep(0.5)
      this.isRestartingSpeech = false
      console.log('restarting speech')

      // const { runtimeText } = textObj;
      // this.value += " " + runtimeText.join(" ");
    },
    addingMessage: async function(str) {
      const user = Parse.User.current()
      this.isSubmiting = true

      const Messages = Parse.Object.extend("Messages");
      const msg = new Messages();
      msg.set("chatroom", this.chatroomRaw);
      msg.set("message", str);
      msg.set("owner", user);
      msg.set("ownerName", user.get('username'))
      await msg.save()
      console.log('msg is saved')
      this.isSubmiting = true
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



.buttonBorder {
  width: 100%;
  border-radius: 3px;
  background-color: #225473;
  text-align: center;
  margin-bottom: 30px;
  cursor: pointer;
}
.styleSpeechButton {
  width: 15px;
  height: 15px;
  font-size: 0;
  background-color: red;
  border: 0;
  border-radius: 35px;
  outline: none;
  display: inline-block;
  cursor: pointer;
  margin-left: 10px;
  vertical-align: middle;
  margin: 10px 0;
}
.inputTitle {
}

.Rec {
  animation-name: pulse;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes pulse {
  0% {
    box-shadow: 0px 0px 5px 0px rgba(173, 0, 0, 0.3);
  }
  65% {
    box-shadow: 0px 0px 5px 13px rgba(173, 0, 0, 0.3);
  }
  90% {
    box-shadow: 0px 0px 5px 13px rgba(173, 0, 0, 0);
  }
}
</style>
