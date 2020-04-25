/*
 * @Author: robert zhang
 * @Date: 2020-04-23 06:53:58
 * @LastEditTime: 2020-04-25 11:37:55
 * @LastEditors: robert zhang
 * @Description: 
 * @
 */
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
  RadioGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog
} from 'element-ui'

Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
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
// 挂载消息确认框
Vue.prototype.$confirm = MessageBox.confirm
