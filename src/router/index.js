import Vue from "vue";
import VueRouter from "vue-router";
import DiagramCanvas from "../views/designer/DiagramCanvas.vue"
import Designer from "../views/designer/Designer.vue"
import About from "../views/About.vue"
import Login from "../views/Login.vue";
import ForgetPW from "../views/ForgetPW.vue";
import Register from "../views/Register.vue";
import PersonalPage from "../views/PersonalPage.vue";
import ComponentsStoreSideBar from "../views/designer/ComponentsStoreSideBar.vue";
import Test from "../views/Test.vue";
import ToolTopBar from "../views/designer/ToolTopBar.vue";
import ProjectDetailPanel from "../views/mainpage/ProjectDetailPanel.vue";
import vueDemo from "../views/mainpage/vueDemo.vue";
import contentDemo from "../views/mainpage/contentDemo.vue";
import FileTree from "../views/mainpage/FileTree.vue"
import RequirementDetailPanel from "../views/mainpage/RequirementDetailPanel.vue"
import CodeFileDetailPanel from "../views/mainpage/CodeFileDetailPanel.vue"


Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/designer",
    name: "Designer",
    component: Designer
  },
  {
    path: "/about",
    name: "About",
    component: About
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () =>
    //  import( /* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/forgetpw",
    name: "ForgetPW",
    component: ForgetPW
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/personal",
    name: "PersonalPage",
    component: PersonalPage
  },
  {
    path: "/projectdetailpanel",
    name: "ProjectDetailPanel",
    component: ProjectDetailPanel
  },
  {
    path: "/c",
    name: "ComponentsStoreSideBar",
    component: ComponentsStoreSideBar
  },
  {
    path: "/test",
    name: "Test",
    component: Test
  },
  {
    path: "/tooltop",
    name: "ToolTopBar",
    component: ToolTopBar
  },
  {
    path: "/vueDemo",
    name: "vueDemo",
    component: vueDemo
  },
  {
    path: "/contentDemo",
    name: "contentDemo",
    component: contentDemo
  },
  {
    path:"/FileTree",
    name:"FileTree",
    component :FileTree
  },
  {
    path:"/RequirementDetailPanel",
    name:"RequirementDetailPanel",
    component : RequirementDetailPanel
  },
  {
    path:"/CodeFileDetailPanel",
    name:"CodeFileDetailPanel",
    component : CodeFileDetailPanel
  },
];

const router = new VueRouter({
  //mode: "history",
  routes
});

export default router;