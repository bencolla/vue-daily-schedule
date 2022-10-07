//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import '../assets/style.css'
var script = {
  props: {
    value: {
      type: Object
    },
    steps: {
      type: Number,
      default: 60
    },
    bg: {
      type: String,
      default: '#223642'
    },
    bgHover: {
      type: String,
      default: '#84dafc7a'
    },
    bgActive: {
      type: String,
      default: '#84c9fc'
    },
    textColor: {
      type: String,
      default: '#000'
    },
    dayTable:{
      type: Array,
      default: ['So','Mo','Tu','We','Th','Fr','Sa'],
      // validator: val => val.length == 7
    },
    timeArray: {
      type: Array,
      default: [],
      validator: val => val.length > 0
    },
    strWeek:{
      type: String,
      default: 'Week'
    },
    strTime:{
      type: String,
      default: 'Time'
    },
    strDay:{
      type: String,
      default: 'Day'
    },
    disableDaySelect:{
      type: Boolean,
      default: false
    },
    disableWeekSelect:{
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      timeArrayLength: 24,
      timetable: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      },
      dragValue: false,
      dragging: false,
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      maxX: 0,
      maxY: 0,
      minX: 1000000,
      minY: 1000000,
      dragWeek: false,
      dragDay: false,
    }
  },
  methods: {
    startDrag(event) {
      this.dragging = true;
      this.x = this.y = 0;
      this.startX = this.startY = this.maxY = this.maxX  = 0;
      this.minY = this.minX = 1000000;
      let container = {
        height: this.$refs.draggableArea.clientHeight,
        width: this.$refs.draggableArea.clientWidth,
      };
      let item = {
        height: this.$refs.ruleTimeItem[0].clientHeight,
        width: this.$refs.ruleTimeItem[0].clientWidth,
      };
      let time = {
        height: this.$refs.ruleTimeTime[0].clientHeight,
        width: this.$refs.ruleTimeTime[0].clientWidth,
      };
      let week = {
        height: this.disableWeekSelect? 0 : this.$refs.ruleTimeWeek[0].clientHeight,
        width: this.disableWeekSelect? 0 : this.$refs.ruleTimeWeek[0].clientWidth,
      };
      this.data = {container, time, item, week};

      let firstItemX = this.data.time.width + this.data.week.width + 4 + 15;
      let day = 6;
      for (let i = 0; i < 8; i++) {
        let width = firstItemX + i * (this.data.item.width + 2);
        if (width > event.layerX && width  < event.layerX  + this.data.item.width) {
          day = i -1;
        }
      }

      let timeData = -1;
      let j = 1;
      this.$refs.ruleTime.map((one, timeIndex) => {
        if (!one.className.includes('hides')) {
          let height = 35 + (j + (this.disableDaySelect? 0 : 1) )* (this.data.item.height + 2);
          if (height > event.layerY && height  < event.layerY + this.data.item.height) {
            timeData = timeIndex;
          }
          j++;
        }
      });
      
      if(timeData == -1 && day == -1);else if(timeData == -1){
        this.dragValue = !this.checkFullDay(day);
        this.dragWeek = false;
        this.dragDay = true;
      }else if (day == -1) {
        this.dragValue = !this.checkFullWeek (timeData);
        this.dragWeek = true;
        this.dragDay = false;
      } else {
        this.dragValue = this.timetable[day].indexOf(timeData) == -1;
        this.dragWeek = false;
        this.dragDay = false;
      }
    },
    stopDrag() {
      this.dragging = false;
    },
    doDrag(event) {
      if (this.dragging ) {
        this.x = event.layerX;
        this.y = event.layerY;
        if (event.layerY > this.maxY) {
          this.maxY = event.layerY;
        }
        if (event.layerX > this.maxX) {
          this.maxX = event.layerX;
        }
        if (event.layerY < this.minY) {
          this.minY = event.layerY;
        }
        if (event.layerX < this.minX) {
          this.minX = event.layerX;
        }
        if (!this.startX) {
          this.startX = event.layerX;
          this.startY = event.layerY;
        }
        let firstItemX = this.data.time.width + this.data.week.width + 4 + 15;
        for (let i = 0; i < 8; i++) {
          let width = firstItemX + i * (this.data.item.width + 2);
          let isSetItem = false;
          if (this.startX < this.x) {
            if (width > this.startX && width  < event.layerX  + this.data.item.width ) {
              isSetItem = true;
            }
          } else {
            if (width < this.startX + this.data.item.width && width  > event.layerX   ) {
              isSetItem = true;
            }
          }
          
          if(this.dragDay){
            isSetItem && this.setFullDay(i-1, this.dragValue);
          }else {
            let j = 1;
            this.$refs.ruleTime.map((one, timeIndex) => {
              if (!one.className.includes('hides')) {
                let height = 35 + (j + (this.disableDaySelect? 0 : 1) )* (this.data.item.height + 2);
                if (this.startY < this.y) {
                  if (height > this.startY && height  < this.y + this.data.item.height) {
                    isSetItem && (this.dragWeek ? this.setWeek (timeIndex, this.dragValue) : this.setDay(i - 1, timeIndex, this.dragValue));
                  }
                  if ( height > this.startY && height  < this.maxY + this.data.item.height ) {
                    if (this.startX < this.x) {
                  if (this.x < this.maxX && width + this.data.item.width < this.maxX && width > this.x - this.data.item.width && i < 6) {
                        this.setDay(i + 1, timeIndex, !this.dragValue, '1');
                      }
                    } else {
                      if (this.x > this.minX && width  > this.minX - this.data.item.width && width < this.x - this.data.item.width && i < 6) {
                        this.setDay(i , timeIndex, !this.dragValue, '5');
                      }
                    }
                  }
                  if (this.y < this.maxY) {
                    if (height > this.y + this.data.item.height && height  < this.maxY + this.data.item.height) {
                      isSetItem && this.setDay(i - 1, timeIndex, !this.dragValue, '2');
                    }
                  }
                } else {
                  if (height - this.data.item.height  < this.startY    && height > this.y ) {
                    isSetItem && (this.dragWeek ? this.setWeek (timeIndex, this.dragValue) : this.setDay(i - 1, timeIndex, this.dragValue));
                
                  }
              
                  if ( height - this.data.item.height  < this.startY && height  > this.minY ) {
                    if (this.startX < this.x) {
                      if (this.x < this.maxX && width + this.data.item.width < this.maxX && width > this.x  - this.data.item.width ) {
                        this.setDay(i + 1, timeIndex, !this.dragValue, '3');
                      }
                    } else {
                      if (this.x > this.minX && width > this.minX - this.data.item.width  && width < this.x  - this.data.item.width ) {
                        this.setDay(i , timeIndex, !this.dragValue, '3');
                      }
                    }
                  }
                  if (this.y > this.minY) {
                    if (height   > this.minY    && height < this.y) {
                      isSetItem && this.setDay(i - 1, timeIndex, !this.dragValue, '4');
                    }
                  }
                }
                if (this.startX < this.x) {
                  if (this.x < this.maxX) ;
                }
                j++;
              }
            });
          }
        }

      }
    },
    toggleFullDay (day, status) {
      for(let t=0;t<(this.timeArrayLength/(this.steps/60));t++){
        let indexDay = this.timetable[day].findIndex(el => el == t);
        if (indexDay != -1) {
          if (status) {
            this.timetable[day].splice(indexDay, 1);
          }
        } else {
          this.timetable[day].push(t);
        }
      }
      this.$emit('input', this.timetable);
    },
    toggleWeek (time, status) {
      for (const key in [0,1,2,3,4,5,6]) {
        let indexDay = this.timetable[key].findIndex(el => el == time);
        if (indexDay != -1) {
          if (status) {
            this.timetable[key].splice(indexDay, 1);
          }
        } else {
          this.timetable[key].push(time);
        }
      }
      this.$emit('input', this.timetable);
    },
    setDay (day, time, value, num) {
      if (day < 0) {
        return
      }
      
      let indexDay = this.timetable[day].findIndex(el => el == time);
      // alert(indexDay)
      if (value) {
        if (indexDay != -1) ; else {
          this.timetable[day].push(time);
        }
      } else {
        if (indexDay != -1) {
          this.timetable[day].splice(indexDay, 1);
        }
      }
      this.$emit('input', this.timetable);
    },
    setFullDay(day, value){
      if (typeof this.timetable[day] !== 'undefined') {
        for(let t=0;t<(this.timeArrayLength/(this.steps/60));t++){  
          let indexDay = this.timetable[day].findIndex(el => el == t);
          if (value) {
            if (indexDay != -1) ; else {
              this.timetable[day].push(t);
            }
          } else {
            if (indexDay != -1) {
              this.timetable[day].splice(indexDay, 1);
            }
          }
        }
      }
    },
    setWeek (time, value) {
      for (const key in [0,1,2,3,4,5,6]) {
        let indexDay = this.timetable[key].findIndex(el => el == time);
        if (value) {
          if (indexDay != -1) ; else {
            this.timetable[key].push(time);
          }
        } else {
          if (indexDay != -1) {
            this.timetable[key].splice(indexDay, 1);
          }
        }

      }
      this.$emit('input', this.timetable);
    },
    // toggleDay (day, time) {
    //   let indexDay = this.timetable[day].findIndex(el => el == time);
    //   // alert(indexDay)
    //   if (indexDay != -1) {
    //     this.timetable[day].splice(indexDay, 1);
    //   } else {
    //     this.timetable[day].push(time);
    //   }
    //   this.$emit('input', this.timetable);
    // },
    toggleDay (day, time, t) {
      let indexDay = this.timetable[day].findIndex(el => el == time);
      // alert(indexDay)
      if (indexDay != -1) {
        this.timetable[day].splice(indexDay, 1);
      } else {
        this.timetable[day].push(t);
      }
      this.$emit('input', this.timetable);
    },
    checkFullWeek (time) {
      for (const key in this.timetable) {
        if (this.timetable[key].find(el => el == time) == undefined) {
          return false;
        }
      }
      return true;
    },
    checkFullDay (day) {
      for(let t=0;t<(this.timeArrayLength/(this.steps/60));t++){
        if (this.timetable[day].find(el => el == t) == undefined) {
          return false;
        }
      }
      return true;
    },
    setupCustom() {
      const vm = this;
      if (vm.timeArray.length > 0) {
        vm.steps = 60;
        vm.timeArrayLength = vm.timeArray.length;
      }
      if (vm.timeArray.length == 0) {
        var times = []; // time array
        var tt = 0; // start time
        //loop to increment the time and push results in array
        for (var i=0;tt<24*60; i++) {
          var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
          var mm = (tt%60); // getting minutes of the hour in 0-55 format
          times[i] = ("0" + (hh)).slice(-2) + "." + ("0" + (mm)).slice(-2); // pushing data in array
          tt = tt + vm.steps;
        }
        vm.timeArray = times;
      }
    },
  },
  mounted () {
    this.setupCustom();
    if (this.value) {
      this.timetable = this.value;
    }
    window.addEventListener('mouseup', this.stopDrag);
  },
  watch: {
    value (val) {
      if (val) {
        this.timetable = val;
      }      
    }
  },
  computed: {
    rootCssVar () {
      return {
        '--vws-bg': this.bg,
        '--vws-bgActive': this.bgActive,
        '--vws-bgHover': this.bgHover,
        '--vws-text': this.textColor
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"position":"relative"},style:(_vm.rootCssVar)},[_c('div',{staticClass:"vws-rule-custom",staticStyle:{"user-select":"none"}},[_c('div',{staticClass:"vws-rule-row"},[_c('div',{staticClass:"vws-table-rule"},[_c('div',{staticClass:"vws-table-rule-heading"},[_c('div',{staticClass:"vws-time-list vws-rule-time-time vws-time-rule opacity-0"},[_vm._v(_vm._s(_vm.strTime))]),_vm._v(" "),(!_vm.disableWeekSelect)?_c('div',{staticClass:"text-center week-rule"},[_vm._v(_vm._s(_vm.strWeek))]):_vm._e(),_vm._v(" "),_vm._l((_vm.dayTable),function(day,daynum){return _c('div',{key:daynum,staticClass:"text-center"},[_vm._v(_vm._s(day))])})],2),_vm._v(" "),_c('div',{ref:"draggableArea",staticClass:"vws-table-rule-body",attrs:{"id":"schelude"},on:{"mousedown":_vm.startDrag,"mousemove":_vm.doDrag}},[(!_vm.disableDaySelect)?_c('div',{key:"day",ref:"ruleTime",staticClass:"vws-rule-time"},[_c('div',{ref:"ruleTimeTime",staticClass:"vws-time-list vws-rule-time-time vws-time-rule"},[_vm._v(_vm._s(_vm.strDay))]),_vm._v(" "),(!_vm.disableWeekSelect)?_c('div',{ref:"ruleTimeWeek",staticClass:"vws-time-list"}):_vm._e(),_vm._v(" "),_vm._l((_vm.dayTable),function(day,daynum){return _c('div',{key:daynum,ref:"ruleTimeItem",refInFor:true,class:{'vws-time-list vws-rule-time-item': true, 'active': _vm.checkFullDay(daynum)},on:{"click":function($event){_vm.toggleFullDay(daynum, _vm.checkFullDay(daynum));}}})})],2):_vm._e(),_vm._v(" "),_vm._l((_vm.timeArray),function(t,idx){return _c('div',{key:idx,ref:"ruleTime",refInFor:true,staticClass:"vws-rule-time"},[_c('div',{ref:"ruleTimeTime",refInFor:true,staticClass:"vws-time-list vws-rule-time-time vws-time-rule",attrs:{"data-val":t}},[_vm._v("\n              "+_vm._s(t)+"\n            ")]),_vm._v(" "),(!_vm.disableWeekSelect)?_c('div',{ref:"ruleTimeWeek",refInFor:true,class:{
                'vws-time-list vws-rule-time-week': true, 
                'active': _vm.checkFullWeek(idx)
              },on:{"click":function($event){_vm.toggleWeek(idx, _vm.checkFullWeek(idx));}}}):_vm._e(),_vm._v(" "),_vm._l((_vm.dayTable),function(day,daynum){return _c('div',{key:daynum,ref:"ruleTimeItem",refInFor:true,class:{
                'vws-time-list vws-rule-time-item': true, 
                'active': _vm.timetable[daynum].find(function (el) { return el == idx; } ) != undefined ? true:false
              },on:{"click":function($event){return _vm.toggleDay(daynum, idx, t)}}},[_c('span',[_vm._v(_vm._s(t))])])})],2)})],2)])])])])};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = "data-v-57e00ed5";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Schedule = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("vue-schedule", Schedule);
}

const plugin = {
  install
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

Schedule.install = install;

export default Schedule;
