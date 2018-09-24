<template>
  <div>
    <div>
      <vs-input placeholder="事業所記号(半角)" v-model="value1"/>
      <vs-input placeholder="被保険者番号(半角)" v-model="value1"/>
      <vs-input placeholder="申込代表者名(全角カナ)" v-model="value1"/>
      <!--生年月日-->
      <vs-select
        placeholder="年"
        v-model="selectYear"
      >
        <vs-select-item :key="index" :vs-value="item.value" :vs-text="item.text" v-for="(item,index) in optionsYear" />
      </vs-select>
      <vs-select
        placeholder="月"
        v-model="selectMonth"
      >
        <vs-select-item :key="index" :vs-value="item.value" :vs-text="item.text" v-for="(item,index) in optionsMonth" />
      </vs-select>
      <vs-select
        placeholder="日"
        v-model="selectDay"
      >
        <vs-select-item :key="index" :vs-value="item.value" :vs-text="item.text" v-for="(item,index) in optionsDay" />
      </vs-select>
      <vs-input placeholder="事業所名" v-model="value1"/>
      <vs-input placeholder="連絡先電話番号" v-model="value1"/>
      <!--住所-->
      <!--希望日-->
      <vs-select
        placeholder="利用時間"
        v-model="selectTimeZone"
      >
        <vs-select-item :key="index" :vs-value="item.value" :vs-text="item.text" v-for="(item,index) in optionsTimeZone" />
      </vs-select>
    </div>
    <div class="doc">
      <button class="alt">Execute</button>
      <button class="alt">Cancel</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Form',
    data () {
      return {
        value1: '',
        selectYear: 0,
        selectMonth: 0,
        selectDay: 0,
        optionsYear: [],
        optionsMonth: [],
        optionsDay: [],
        selectTimeZone: 0,
        optionsTimeZone: [
          {text: '11:00~13:00', value: 1},
          {text: '13:00~15:00', value: 2},
          {text: '15:00~17:00', value: 3}
        ]
      }
    },
    created () {
      let thisYear = new Date().getFullYear()
      for (let i = 1940; i <= thisYear; i++) {
        this.optionsYear.push({text: i, value: i})
      }
      for (let i = 1; i < 13; i++) {
        this.optionsMonth.push({text: i, value: i})
      }
      for (let i = 1; i < 31; i++) {
        this.optionsDay.push({text: i, value: i})
      }
    }
  }
</script>

<style scoped>

</style>
