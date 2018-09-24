<template>
  <div id="wrapper">
    <span class="title">
      サマディ門前仲町の申請を自動でしてくれるやつ
    </span>
    <main>
      <div class="left-side">
        <Form />
        <code-paste-modal />
      </div>
      <div class="right-side">
        <div class="doc">
          <div class="title">使い方</div>
          <ol>
            <li>Gmailの認証をする</li>
            <li>個人情報を入力する</li>
            <li>Executeボタンを押下する</li>
          </ol>
          <p>途中でやめる場合はCancelボタンを押下</p>
        </div>
        <div class="doc">
          <div class="title alt">設定項目</div>
          <vs-button vs-color="primary" vs-type="border" @click="googleAuth()">Google認証</vs-button>
          <vs-button vs-color="primary" vs-type="border" @click="open('https://vuejs.org/v2/guide/')">フォーム入力情報の設定</vs-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import Form from '@/components/Form'
  import CodePasteModal from '@/components/CodePasteModal'

  export default {
    name: 'landing-page',
    components: {
      Form,
      CodePasteModal
    },
    data () {
      return {
        val: '',
        activePrompt: false
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      googleAuth () {
        this.$electron.ipcRenderer.send('init')
        this.$electron.ipcRenderer.on('authUrl', (event, url) => {
          console.log('renderer: ', url)
          open(url)
          // prompt
        })
        this.$electron.ipcRenderer.on('initReply', (event, arg) => {
          console.log(arg)
        })
      },
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
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
