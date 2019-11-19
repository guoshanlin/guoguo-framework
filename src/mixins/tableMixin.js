export const tableMixin = {
  data() {
    return {
      changeColumns: [],
      data:[
        {},
        {},
        {},
        {}
      ]
    }
  },
  created() {
  },
  destroyed() {
  },
  methods: {
    columnsChange(val, type) {
      for (let key in this.columns) {
        if (!this.columns[key].type) {
          this.columns[key].show = false
        }
      }
      this.changeColumns = []
      for (let key of val) {
        if (this.columns[key]) {
          this.columns[key].show = true   //drayTableMixin
          if (this.columns[key].type || this.columns[key].fixed) {
            this.changeColumns.push(Object.assign({}, this.columns[key]))
          } else {
            this.changeColumns.push(Object.assign({renderHeader: this.drayHeaderRender}, this.columns[key]))
          }
        }
      }
    }
  }
}
