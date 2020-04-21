import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox
