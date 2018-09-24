<template>
  <div>
    <router-link to="/">画面遷移成功！</router-link>
  </div>
</template>

<script>
  export default {
    name: 'Next',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style scoped>

</style>
