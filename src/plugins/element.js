import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  MessageBox,
  Header,
  Container,
  Aside,
  Main,
  Footer,
  Menu,
  MenuItem,
  DropdownMenu,
  Submenu,
  Radio,
  RadioButton,
  RadioGroup
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(DropdownMenu)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)

Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox
