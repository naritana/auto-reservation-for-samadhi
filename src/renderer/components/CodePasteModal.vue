<template>
  <div>
    <vs-button @click="activePrompt=true" vs-color="primary" vs-type="border">Run prompt</vs-button>
    <vs-prompt
      @vs-cancel="val=''"
      @vs-accept="acceptAlert"
      :vs-active.sync="activePrompt"
    >
      <div>
        Enter the security code
        <vs-input placeholder="Code" vs-placeholder="Code" v-model="val"/>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
  import Vue from 'vue'
  import vuesax from 'vuesax'
  Vue.use(vuesax)
  export default Vue.extend({
    data () {
      return {
        val: '',
        activePrompt: false
      }
    },
    // computed: {
    //   activePrompt: {
    //     get () {
    //       return this.$store.state.activePrompt
    //     },
    //     set (value) {
    //       this.$store.commit('promptState', value)
    //     }
    //   }
    // },
    methods: {
      acceptAlert () {
        if (this.val.length !== 0) {
          var res = this.$electron.ipcRenderer.sendSync('authCode', this.val)
        }
        if (res) {
          this.$vs.notify({
            color: 'success',
            title: 'Authorization success',
            text: '認証に成功しました'
          })
        } else {
          this.$vs.notify({
            color: 'danger',
            title: 'Authorization failed',
            text: '認証に失敗しました'
          })
        }
      }
    }
  })
</script>

<style scoped>
  vs-button {
    color: black;
  }
</style>
