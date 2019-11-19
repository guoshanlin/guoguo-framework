export const drayTableMixin = {
  data() {
    return {
      isDown: false,
      isHindHeader: false,
      drayMinWidth: 50,
      headerObj: {start: 0,end: 0, index: 0 }
    }
  },
  methods: {
    drayHeaderRender (h,params){
      this.bindHeader()
      return [h('span',params.column.title), h('div', {
        class: 'table-dray-drop',
        on: {
          mousedown: (e) => {
            this.isDown = true
            this.headerObj = {
              start: e.clientX,
              end: 0,
              index: params.index
            }
            let lineNode = document.querySelector('.table-dray .ivu-table .ivu-table-header .global-fixed-line')
            let _style = 'left:'+ e.clientX + 'px; top:'+ (e.clientY -10)+'px; display: block;'
            lineNode.setAttribute("style", _style)
            lineNode = null
            _style = null
          }
        }
      })]
    },
    bindHeader () {
      if(this.isHindHeader) return
      this.isHindHeader = true
      let trNodeHead = document.querySelector('.ivu-table .ivu-table-header')
      let lineNode = document.createElement("div")
      lineNode.setAttribute("class","global-fixed-line")
      trNodeHead.appendChild(lineNode)
      trNodeHead.onmousemove = (e)=>{
        if(!this.isDown)  return
        lineNode.style.left = e.clientX + 'px'
        this.headerObj.end = e.clientX
      }
      trNodeHead.onmouseup = ()=>{
        this.setTableWidth(this.headerObj)
        this.isDown = false
        this.headerObj = {start: 0,end: 0,index: 0 }
        lineNode.style.display = 'none'
      }
      trNodeHead.onmouseleave = ()=>{
        if(this.isDown) {
          this.setTableWidth(this.headerObj)
          this.isDown = false
          this.headerObj = {start: 0,end: 0,index: 0 }
          lineNode.style.display = 'none'
        }
      }
    },
    /**
     * 设置列宽
     * @param obj
     */
    setTableWidth (obj) {
      let _headerDamoCol = document.querySelectorAll('.table-dray .ivu-table .ivu-table-header colgroup col')[obj.index]
      let _bodyDamoCol = document.querySelectorAll('.table-dray .ivu-table .ivu-table-body colgroup col')[obj.index]
      let n = +(_headerDamoCol.width) + obj.end - obj.start
      if(n < this.drayMinWidth) n = this.drayMinWidth
      _headerDamoCol.width = n
      _bodyDamoCol.width = n

      _bodyDamoCol = null
      _bodyDamoCol = null
      n = null
      this.setScrollClass()
    },

    /**
     * 判断宽度是否出现滚动条
     */
    setScrollClass () {
      let _bodyDamo = document.querySelector('.table-dray .ivu-table .ivu-table-body')
      let _tableDamo = document.querySelector('.table-dray .ivu-table .ivu-table-body table')
      if(_bodyDamo.offsetWidth < _tableDamo.offsetWidth) {
        _bodyDamo.classList.add('ivu-table-overflowX')
      } else {
        _bodyDamo.classList.remove('ivu-table-overflowX')
      }
      _bodyDamo = null
      _tableDamo = null
    }
  }
}
