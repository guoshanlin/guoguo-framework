import store from 'store'
import {setIsLogin, setUserInfo} from 'common/js/cache'

export default {
  install(Vue, options) {
    Vue.directive("drag", function (el) {
      el.onmousedown = function (e) {
        var _left = e.clientX - el.offsetLeft, _top = e.clientY - el.offsetTop
        var maxW = window.innerWidth - el.offsetWidth, maxH = window.innerHeight - el.offsetHeight
        document.onmousemove = function (e) {
          var l = e.clientX - _left, t = e.clientY - _top
          if (l <= 0) l = 0
          if (t <= 0) t = 0
          if (l >= maxW) l = maxW
          if (t >= maxH) t = maxH
          el.style.left = l + "px"
          el.style.top = t + "px"
        }
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    })

    // Vue.prototype.commonUrl =  process.env.EVENT_FILE +  '/files/down?path='
    Vue.prototype.rootPath = process.env.URL
    Vue.prototype.commonUrl = process.env.EVENT_FILE + '/wfFile?path='
    Vue.prototype.fileUrl = process.env.REST_URL   //'http://39.108.70.238:8230'
    Vue.prototype.fileUrlDown = process.env.EVENT_FILE + '/wfFile?path='
    Vue.prototype.fileUrlSplitString = '(Replace:_File_Path_Specific_Characters_file:url=+,)'
    // Vue.prototype.fileUrlDown = process.env.REST_URL
    Vue.prototype.platformType = process.env.SYSTEM_TYPE
    Vue.prototype.$ssoUrl =process.env.REST_API +  "/gxSso" +    (process.env.SYSTEM_TYPE == 'by' ? '?isBy=true': '')
    Vue.prototype.tableAlign = 'left'
    Vue.prototype.tableSortable = 'custom'
    Vue.prototype.optionsUeditor = true
    Vue.prototype.$jump_mode_link = '_blank'
    Vue.prototype.$publicFormKey = 'random_form_key_verification'

    //分页默认参数
    Vue.prototype.$pageSizeOpts= [10, 20, 30, 40]  // $pageSizeOpts $pageSize
    Vue.prototype.$pageSize= 40

    /**
     * 公用请求方法 以params形式提交参数
     * @param type
     * @param url
     * @param params
     * @param urlId
     * @returns {Promise<any>}
     */
    Vue.prototype.requestAjax = function (type, url, params, urlId) {
      // 分页开始
      let newParams = {}
      Object.assign(newParams, params)
      let dataParams = new FormData()
      // 添加rr时间戳参数值清除缓存用
      if (type != 'post' && type != 'POST') {
        newParams.rr = parseInt(new Date().getTime())
      } else {
        for (let key in newParams) {
          if (newParams[key] && key != this.$publicFormKey) dataParams.append(key, newParams[key])
          if (newParams[key] === 0 && key != this.$publicFormKey) dataParams.append(key, newParams[key])
        }
      }
      // 分页计算开始
      if (newParams.offset && newParams.offset > 0) {
        newParams.offset = parseInt(newParams.offset - 1) * newParams.limit
      }
      if (type == 'post' || type == 'POST') console.log('formKey========' + newParams[this.$publicFormKey])
      // 分页计算结束
      return new Promise((resolve, reject) => {
        this.axios({
          method: type,
          url: this.Api(url, urlId),
          params: type == 'post' || type == 'POST' ? undefined : newParams,  //参数会拼接到url上
          data: type == 'post' || type == 'POST' ? dataParams : undefined, //参数不拼接到url上
          withCredentials: true,
          headers: { //06269
            // 'memberId': store.state.memberId || '',
            'sessionId': store.state.userData ? store.state.userData.sessionId : '',
            // 'userType': store.state.userData ? store.state.userData.userType : '',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          }
        }).then((data) => {
          if (this.isOvertime(data.data)) {
            resolve(data.data)
          } else {
            reject(false)
          }
        }).catch((error) => {
          console.log('error...')
          reject(error)
        })
      })
    }
    /**
     * 公用请求方法 以params形式提交参数
     * @param type
     * @param url
     * @param params
     * @param urlId
     * @returns {Promise<any>}
     */
    Vue.prototype.requestAjaxPut = function (url, params,urlId) {
      // 分页开始
      let newParams =  Object.assign({}, params)
     console.log('formKey========' + newParams[this.$publicFormKey])
      return new Promise((resolve, reject) => {
        this.axios({
          method: 'post',
          url: this.Api(url, urlId),
          data: JSON.stringify(newParams), //参数不拼接到url上
          withCredentials: true,
          headers: { //06269
            // 'memberId': store.state.memberId || '',
            'sessionId': store.state.userData ? store.state.userData.sessionId : '',
            // 'userType': store.state.userData ? store.state.userData.userType : '',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=utf-8',
            'Cache-Control': 'no-cache',
          }
        }).then((data) => {
          if (this.isOvertime(data.data)) {
            resolve(data.data)
          } else {
            reject(false)
          }
        }).catch((error) => {
          console.log('error...')
          reject(error)
        })
      })
    }
    /**
     * 公用请求方法以data方式提交参数
     * @param type
     * @param url
     * @param data
     * @param urlId
     * @returns {Promise<any>}
     */
    Vue.prototype.requestFile = function (type, url, data, urlId, formKey) {
      return new Promise((resolve, reject) => {
        this.axios({
          method: type,
          url: this.Api(url, urlId),
          data: data,
          withCredentials: true,
          headers: {
            'sessionId': store.state.userData ? store.state.userData.sessionId : '',
            'Cache-Control': 'no-cache',
          }
        }).then((data) => {
          if (this.isOvertime(data.data)) {
            resolve(data.data)
          } else {
            reject(false)
          }
        }).catch((error) => {
          console.log('error...')
          reject(error)
        })
      })
    }
    /**
     * 超出部分隐藏
     * @param h
     * @param params
     * @returns {*}
     */
    Vue.prototype.tdRender = function (h, params) {
      return h('div', {
        'class': 'td-render',
        domProps: {
          title: params.row[params.column.key]
        },
        style: {
          //  cursor: 'pointer'
        }
      }, params.row[params.column.key])
    }
    Vue.prototype.toNoticeDetails = function (h, params) {
      return h('div', {
        'class': 'td-render',
        domProps: {
          title: params.row[params.column.key]
        },
        style: {
          cursor: 'pointer'
        }
      }, [h('a', {
        /*domProps: {
          href: process.env.URL + 'noticeSeeDetails?id='+ params.row.id+'&type=1',
          target: '_blank'
        },*/
        on: {
          click: () => {
            let _url = process.env.URL + 'noticeSeeDetails?id=' + params.row.id + '&type=1'
            openNewPage(_url)
          }
        }
      }, params.row[params.column.key])])
    }

    Vue.prototype.toNoticeDetails2 = function (h, params) {
      return h('div', {
        'class': 'td-render',
        domProps: {
          title: params.row[params.column.key]
        },
        style: {
          cursor: 'pointer'
        }
      }, [h('a', {
        /*domProps: {
          href: process.env.URL + 'noticeSeeDetails?id='+ params.row.id+'&type=2',
          target: '_blank'
        },*/
        on: {
          click: () => {
            let _url = process.env.URL + 'noticeSeeDetails?id=' + params.row.id + '&type=2'
            openNewPage(_url)
          }
        }
      }, params.row[params.column.key])])
    }

    /**
     * 设置定时器
     * @param func
     * @param delay
     * @returns {Function}
     */
    Vue.prototype.debounce = function (func, delay) {
      let timer
      return function (...args) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    }

    /**
     * 设置定时器
     * @param func
     * @param delay
     * @returns {Function}
     */
    let __timer
    Vue.prototype._debounce = function (func, delay) {
      if (__timer) {
        clearTimeout(__timer)
      }
      __timer = setTimeout(() => {
        func.apply(this)
      }, delay)
    }

    /**
     * 公用页面跳转
     * @param url
     */
    Vue.prototype.routePush = function (url, id, type, obj) {
      this.delEditorInit()
      let newParams = {t: new Date().getTime()}
      if (obj) {
        Object.assign(newParams, obj)
      }
      if (id) {
        Object.assign(newParams, {id: id})
      }
      if (type) {
        Object.assign(newParams, {type: type})
      }
      this.$router.push({path: url, query: newParams})
    }

    /**
     * 登入超时验证
     * @param data
     * @returns {boolean}
     */
    Vue.prototype.isOvertime = function (data) {
      if (data.desc == 'TimeOut') {
        store.state.userData = null
        setUserInfo(null)
        setIsLogin(false)
        store.state.isLogin = false
        // this.$Message.warning({content: '登录超时, 请重新登录！', duration: 10, closable: true})
       // this.routePush('/login', '', '', {oldPath: this.$route.path})
        return false
      } else {
        return true
      }
    }

    Vue.prototype._getFileName = function (name) {
      if(name.indexOf('&fileName=') != -1)  return name ? name.substring(name.indexOf('&fileName=') + 10) : ''
      return name ? name.substring(name.lastIndexOf('/') + 1) : ''
    },
      /**
       * 创建用户渠道转义
       * @param number
       * @returns {string}
       */
      Vue.prototype.getActiveStatus = function (number) {
        /*    【-2：草稿】【-1：审核不通过】【0：未审核】【1：未开始】【2：执行中】【3：暂停】【99：结束】*/
        switch ('' + number) {
          case '-2':
            return '草稿'
          case '-1':
            return '审核未通过'
          case '0':
            return '待审核'
          case '1':
            return '未开始'
          case '2':
            return '进行中'
          case '3':
            return '已取消'
          case '99':
            return '结束'
          default:
            return number
        }
      }



    Vue.prototype._getTextArr = (key, val, arr) => {
      let text = val
      arr.forEach(item => {
        if (item.value == val) text = item.label
      })
      return text
    }

    Vue.prototype.weekIndexInYear = (date) => {
      var nowDate = new Date(date ? date : new Date()),
        initTime = new Date(date ? date : new Date())
      initTime.setMonth(0)
      initTime.setDate(1)
      var differenceVal = nowDate - initTime,
        todayYear = Math.ceil(differenceVal / (24 * 60 * 60 * 1000)),
        index = Math.ceil(todayYear / 7)
      return index
    }
    /**
     * 去除Html标签
     * @param str
     */
    Vue.prototype.delHtmlTag = (str) => {
      return str.replace(/<[^>]+>/g, "")
    }
    /**
     * 转义时间戳
     * @param time
     * @returns {*}
     */
    Vue.prototype.formatterObjTime = function (time, type) {
      if (time && time.time) return Date.formatByTimes(time.time, type || 'yyyy-MM-dd hh:mm:ss')
      if (time) return Date.formatByTimes(time, type || 'yyyy-MM-dd hh:mm:ss')
      return ''
    }
    /**
     * table展示时间转义
     * @param time
     * @returns {*}
     */
    Vue.prototype.formatterTableTime = function (h, params, type) {
      let time = params.row[params.column.key]
      let _t = ''
      if (time) _t = Date.formatByTimes(time, type || 'yyyy-MM-dd hh:mm')
      if (time && time.time) _t = Date.formatByTimes(time.time, type || 'yyyy-MM-dd hh:mm')
      return h('div', {
        'class': 'td-render',
        domProps: {title: _t},
        //style: {cursor: 'pointer'}
      }, _t)
    }
    //获取动态限制string
    Vue.prototype._getSearchTimeString = function (str, type) {
      if (!str && type == 'false') return ''
      if (!str && type == 'true') return '%y-%M-%d %H:%m:%s'
      let _arr = str.split(',')
      let newStr = '#F{'
      for (let i = 0; i < _arr.length; i++) {
        if (i != 0) {
          newStr = newStr + '||$dp.$D(\'' + _arr[i] + '\')'
        } else {
          newStr = newStr + '$dp.$D(\'' + _arr[i] + '\')'
        }
      }
      if (type == 'true') {
        newStr = newStr + '||\'%y-%M-%d %H:%m:%s\'}'
      } else {
        newStr = newStr + '}'
      }
      return newStr
    }
    Vue.prototype.regFileName = function (name) {
      let fileName = name.trim()
      let reg = new RegExp('[\\\\/:*?\"&<>|]')
      if (reg.test(fileName)) {
        this.$Message.error('上传的文件名或图片名不能包含[/:*?"&<>|]这些非法字符,请修改后重新上传!')
        return false
      }
      return true
    }
    Vue.prototype.replaceFileUrl = function (htmlStr, url, notXss) {
      if (!htmlStr) return htmlStr
      let content = htmlStr
      let _this = this
      let splitStr = this.fileUrlSplitString
      content = content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, href) => {
        let str = match + "";
        if (str.indexOf(splitStr) != -1) return this.getEncodeURIISrc(str, splitStr, url ? url : _this.fileUrlDown)
        if (href.indexOf('/ems/files/xheditor/') != -1) return '<img src="' + _this.fileUrlDown + this.getEncodeURI(href.replace('/ems/files/xheditor', '/uploads')) + '" alt="" />'
        return match
      })
      content = content.replace(/<a [^>]*href=['"]([^'"]+)[^>]*>/gi, (match, href) => {
        let str = match + "";
        if (str.indexOf(splitStr) != -1) return this.getEncodeURIHref(str, splitStr, url ? url : _this.fileUrlDown)
        if (href.indexOf('/ems/files/xheditor/') != -1) return '<a href="' + _this.fileUrlDown + this.getEncodeURI(href.replace('/ems/files/xheditor', '/uploads')) + '" target="_blank">'
        return match
      })
      if (notXss) return content
      let allow_attribute = [
        'class', 'style', 'id', 'title', 'width', 'height', 'alt', 'contenteditable',
        'download', 'border', 'bgcolor', 'name', 'align', 'target'
      ]
      return this.$xss(content, {
        onTagAttr: (tag, name, value, isWhiteAttr) => {
          if (tag == "img" && name == "src") return name + '="' + value + '"';
          if (tag == "a" && name == "href") return name + '="' + value + '"';
          if (allow_attribute.indexOf(name) != -1 || name.substr(0, 5) == "data-") return name + '="' + value + '"';
        }
      })
    }
    Vue.prototype.reductionFileUrl = function (htmlStr, url) {
      if (!htmlStr) return htmlStr
      let content = htmlStr
      let _this = this
      let splitStr = url ? url : _this.fileUrlDown
      content = content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, href) => {
        let str = match + "";
        if (str.indexOf(splitStr) != -1) return this.getDecodeURISrc(str, splitStr, _this.fileUrlSplitString)
        return match
      })
      content = content.replace(/<a [^>]*href=['"]([^'"]+)[^>]*>/gi, (match, href) => {
        let str = match + "";
        if (str.indexOf(splitStr) != -1) return this.getDecodeURIHref(str, splitStr, _this.fileUrlSplitString)
        return match
      })
      return content
    }
    Vue.prototype.getEncodeURI = function (url) {
      if (!url) return ''
      if (!!window.ActiveXObject || "ActiveXObject" in window) return encodeURI(url)
      return url
    }
    Vue.prototype.getDecodeURISrc = function (str, sp, url) {
      str = str.replace(/[^\S]src=['"]([^'"]+)['"]/gi, (match, src) => {
        let _src = src.replace(sp, '')
        if (!!window.ActiveXObject || "ActiveXObject" in window) return ' src="' + url + decodeURI(_src) + '"'
        return match.replace(sp, url)
      })
      return str
    }
    Vue.prototype.getDecodeURIHref = function (str, sp, url) {
      str = str.replace(/[^\S]href=['"]([^'"]+)['"]/gi, (match, href) => {
        let _href = href.replace(sp, '')
        if (!!window.ActiveXObject || "ActiveXObject" in window) return ' href="' + url + decodeURI(_href) + '"'
        return match.replace(sp, url)
      })
      return str
    }
    Vue.prototype.getEncodeURIISrc = function (str, sp, url) {
      str = str.replace(/[^\S]src=['"]([^'"]+)['"]/gi, (match, src) => {
        let _src = src.replace(sp, '')
        if (!!window.ActiveXObject || "ActiveXObject" in window) return ' src="' + url + encodeURI(_src) + '"'
        return match.replace(sp, url)
      })
      return str
    }
    Vue.prototype.getEncodeURIHref = function (str, sp, url) {
      //  str =  str.replace(/[^\S]href=\"(.+)\"/gi, (match,href)=> {
      str = str.replace(/[^\S]href=['"]([^'"]+)['"]/gi, (match, href) => {
        let _href = href.replace(sp, '')
        if (!!window.ActiveXObject || "ActiveXObject" in window) return ' href="' + url + encodeURI(_href) + '"'
        return match.replace(sp, url)
      })
      return str
    }

    function openNewPage(url) {
      let w = screen.availWidth - 200, h = screen.availHeight - 160
      if (w < 400) w = 400
      if (h < 200) h = 200
      window.open(url + '&t=' + new Date().getTime(), '', 'left=100,top=50,height=' + h + ',width=' + w + ',scrollbars=yes,status=yes,location=no,toolbar=no,menubar=no,resizable=yes')
    }

    Vue.prototype.openNewPage = openNewPage

    Vue.prototype.closeWindow = function () {
      window.opener = null;
      window.open('', '_self')
      window.close()
    }
    Vue.prototype.enlargementWindow = function () {
      if (window.screen) {
        let myw = screen.availWidth;
        let myh = screen.availHeight;
        window.moveTo(0, 0);
        window.resizeTo(myw, myh);
      }
    }
    /**
     * 验证两个obj参数是否相同
     * @param h
     * @param params
     * @returns {*}
     */
    Vue.prototype.searchObjectVerification = function (param, changeParam) {
      let isDif = false
      for (let key in changeParam) {
         let _cp = changeParam[key] +  ''
         let _p = param[key] +  ''
        if (_cp && _p && (_cp != _p)) isDif = true
        if (_cp && !_p) isDif = true
      }
      for (let key in param) {
        let _cp = changeParam[key] +  ''
        let _p = param[key] +  ''
        if (!_cp && _p) isDif = true
      }
      return isDif
    }
    /**
     * 删除富文本
     */
    Vue.prototype.delEditorInit = function (rules) {
      let ueditorDamo = document.getElementById('ueditor')
      if(ueditorDamo) UE.delEditor('ueditor')
    }
    /**
     * 时间验证
     * @param time
     * @returns {*}
     */
    Vue.prototype.timeIsLessNow = function (time,val) {
      let _time = time.replace(/-/g, "/")
      let nTime = new Date().getTime(),oTime = new Date(_time).getTime()
      if(nTime > oTime) return ''
      return val? val:time
    }
    Vue.prototype.getTimeKeys=()=>{
      return (new Date().getTime()) + ''
    }
    Vue.prototype.isIE=()=>{
      const _ua = navigator.userAgent.toLowerCase(),_IE = _ua.indexOf('msie') > -1 && _ua.indexOf('opera') == -1
      return  _IE
    }
    Vue.prototype.isBase64=(str)=>{
      if (str ==='' || str.trim() ==='')  return false
      try {
        return btoa(atob(str)) == str;
      } catch (err) {
        return false;
      }
    }
    Vue.prototype.dialogDragDamo=(el)=>{
      const dialogHeaderEl = el.querySelector('.ivu-modal-header');
      const dragDom = el.querySelector('.ivu-modal');
      dialogHeaderEl.style.cursor = 'move';

      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

      dialogHeaderEl.onmousedown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;

        // 获取到的值带px 正则匹配替换
        let styL, styT;

        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (sty.left.includes('%')) {
          styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
        } else {
          styL = +sty.left.replace(/\px/g, '');
          styT = +sty.top.replace(/\px/g, '');
        };

        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离
          const l = e.clientX - disX;
          const t = e.clientY - disY;

          // 移动当前元素
          dragDom.style.left = `${l + styL}px`;
          dragDom.style.top = `${t + styT}px`;

          //将此时的位置传出去
          //binding.value({x:e.pageX,y:e.pageY})
        };

        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    }
  }
}
