<template>
  <div class="wrapper-box wrapper b">
    <div class="clear m-t10">
      <table-columns class="fr c3" :columns="columns" @change="columnsChange" @refresh="loadTable"></table-columns>
    </div>
    <div class="m-t10">
      <i-table class="table-dray" :columns="changeColumns" :data="data" border  size="small" ref="table"></i-table>
    </div>
  </div>
</template>

<script>

  import tableColumns from '../../components/table-columns'
  import {tableMixin} from '../../mixins/tableMixin'

  export default {
    name: "changes",
    mixins: [tableMixin],
    data() {
      return {
        columns: [
          {type: "selection", width: 40,show: true,align: 'center'},
          {title: '列1',show: true,align: 'left', key: 'id1', minWidth: 160},
          {title: '列2',show: true,align: 'left', key: 'id2', minWidth: 160},
          {title: '列3',show: true,align: 'left', key: 'id3', minWidth: 160},
          {title: '列4',show: false,align: 'left', key: 'id4', minWidth: 160},
          {title: '列5',show: true,align: 'left', key: 'id5', minWidth: 160},
          {title: '列6',show: true,align: 'left', key: 'id6', minWidth: 160},
          {title: '列7',show: true,align: 'left', key: 'id7', minWidth: 160},
          {title: '列8',show: false,align: 'left', key: 'id8', minWidth: 160},
          {title: '列9',show: true,align: 'left', key: 'id9', minWidth: 160},
          {title: '列10',show: false,align: 'left', key: 'id10', minWidth: 160},
          ]
      }
    },
    created() {
      this.$nextTick(() => {

      })
    },
    methods: {
      loadTable() {
        console.log('刷新列表。。。')
      }
    },
    components: {
      tableColumns,
    }
  }
</script>

<style scoped>

</style>
