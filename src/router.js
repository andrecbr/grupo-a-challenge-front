import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/Students/list",
    },
    {
      path: "/students/list",
      name: "students-list",
      component: () => import("./components/StudentsList"),
    },
    {
      path: "/students/edit/:ra",
      name: "student-detail",
      component: () => import("./components/StudentsForm"),
    },
    {
      path: "/students/new",
      name: "student-new",
      component: () => import("./components/StudentsForm"),
    },
  ],
});
