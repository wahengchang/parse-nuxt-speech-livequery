<template>
  <div class="home">
    <h1>login</h1>
    <input type="text" name="username" v-model="username" placeholder="Username" />
    <input type="password" name="password" v-model="password" placeholder="Password" />
    <button type="button" @click="login">Login</button>
  </div>
</template>

<script>
import Parse from 'parse'
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    async login() {
      try {
        const {username, password} = this
        if(!username || !password) return alert('[ERROR] username and password are required')

        console.log(username, password)

        const user = await Parse.User.logIn(username, password)
        console.log(`[INFO] login as user ${user.toJSON().username}`)

        const {redirect = null} = this.$route.query || {}

        if(redirect) return this.$router.push(redirect)
        
        this.$router.push("/secret")
      }
      catch(e) {
        console.error(`[ERROR] ${e}`)
        alert(e)
      }
    }
  },
  components: {}
};
</script>

<style scoped>
input {
  display: block;
  margin: auto;
}
</style>