<template>
  <div class="columns-table">
    <!--<i-button icon="md-refresh" @click="refreshEvent"  type="primary" shape="circle" title="刷新"></i-button>-->
    <Icon type="md-refresh" size="24" class="cursor-p" @click="refreshEvent" />
    <Dropdown placement="bottom-end">
      <div class="cursor-p dropdown-columns">
        <slot>
          <Icon type="md-apps" size="24" />
        </slot>
      </div>
      <DropdownMenu slot="list">
        <div class="columns-dropdown">
          <div v-for="(item,index) in columnsTable" v-if="!item.type" :key="index" :class="item.show ? 'columns-table-item checked-item' : 'columns-table-item'" :style="{width: columnsWidth + 'px'}">
            <Checkbox v-model="item.show" class="hzline1" :disabled="checkNumber<= 2&& item.show ? true:false" @on-change="getShowColumns('checked')">{{item.title}}</Checkbox>
          </div>
        </div>
      </DropdownMenu>
    </Dropdown>
    <Dropdown v-if="autoRefresh" class="m-r10">
      <div class="cursor-p">
        <div>
          <slot>
            <span>{{times}}</span>
            <Icon type="md-arrow-dropdown" />
          </slot>
        </div>
      </div>
      <DropdownMenu slot="list">
          <RadioGroup v-model="times" class="times-wrapper" @on-change="autoRefreshChange">
            <Radio v-for="(item,index) in timesList" :key="index" :label="item"></Radio>
          </RadioGroup>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        times: '40S',
        interval: null,
        timesList: ['40S', '60S', '90S', '120S'],
        columnsTable: [],
        showList: [],
       changeType: '',
        checkNumber: 0
      }
    },
    props: {
      columns: '',
      autoRefresh: {
        type: Boolean,
        default: true
      },
      columnsWidth: {
        type: Number,
        default: 140
      }
    },
    watch: {
      columns: {
        handler (val) {
          this.columnsTable = JSON.parse(JSON.stringify(val))
          this.getShowColumns()
          this.$nextTick(() => {
            // this.initScroll(document.querySelectorAll('.columns-dropdown'))
          })
        },
        deep: true
      },
      // showList: {
      //   handler (val) {
      //     console.log()
      //     // this.$emit('change', val,this.changeType)
      //   },
      //   deep: true
      // },
    },
    beforeCreate () {
      this.$nextTick(() => {
        this.columnsTable = JSON.parse(JSON.stringify(this.columns))
        this.getShowColumns()
        this.initAutoRefresh()
      })
    },
    destroyed() {
      if(this.interval) clearInterval(this.interval)
    },
    methods: {
      autoRefreshChange(v){
        if(this.interval) clearInterval(this.interval)
        this.initAutoRefresh()
      },
      initAutoRefresh(){
        if(this.autoRefresh) {
          let times = parseInt(this.times) * 1000
          this.interval = setInterval(() => {
            this.$emit('refresh','refresh')
          }, times)
        }
      },
      getShowColumns (type) {
        let showList = []
        let _num = 0
        for (let item of this.columnsTable) {
          if (item.show) {
            showList.push(_num)
          }
          _num++
        }
        if(this.showList.toString() != showList.toString()) {
          this.changeType =type
          this.checkNumber = showList.length
          this.showList = showList
          this.$emit('change', showList,type)
        }
      },

      refreshEvent(){
        this.$emit('refresh','click')
      }
    }
  }
</script>

<style scoped>
  .columns-dropdown{max-height: 200px;overflow: hidden; overflow: auto}
  .dropdown-columns{line-height: 32px; margin: 0 10px}
  .dropdown-columns .ivu-icon{font-weight: bold}
  .columns-table-item{width: 120px;line-height: 32px;height: 32px;padding: 0 20px;}
  .columns-table-item:hover{background-color: #eeeeee}
  .columns-table-item.checked-item{background-color: #b2efef}

  .times-wrapper .ivu-radio-group{display: block!important;}
  .times-wrapper .ivu-radio-wrapper{display: block!important;padding: 5px 10px!important;}
</style>
