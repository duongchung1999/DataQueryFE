import Layout from "@/layout/index.vue";
import { createNameComponent } from "../createNode";
const route = [
  {
    path: "",
    component: Layout,
    redirect: "/dashboard",
    // meta: { title: 'message.menu.dashboard.name', icon: 'el-icon-menu' },
    children: [
      {
        path: "dashboard",
        component: createNameComponent(() =>
          import("@/views/main/dashboard/index.vue")
        ),
        meta: {
          title: "message.menu.dashboard.index",
          icon: "el-icon-s-home",
          hideClose: true,
        },
      },
    ],
  },
  {
    path: "",
    component: Layout,
    redirect: "/DataQuery",
    // meta: { title: 'message.menu.dashboard.name', icon: 'el-icon-menu' },
    children: [
      {
        path: "DataQuery",
        component: createNameComponent(() =>
          import("@/views/main/pages/TestDataQuery/index.vue")
        ),
        meta: {
          title: "message.menu.page.TestDataQuery",
          icon: "el-icon-search",
          hideClose: true,
        },
      },
    ],
  },
  {
    path: "",
    component: Layout,
    redirect: "/SNDataQuery",
    // meta: { title: 'message.menu.dashboard.name', icon: 'el-icon-menu' },
    children: [
      {
        path: "SNDataQuery",
        component: createNameComponent(() =>
          import("@/views/main/pages/SNDataQuery/index.vue")
        ),
        meta: {
          title: "message.menu.page.SNDataQuery",
          icon: "el-icon-tickets",
          hideClose: true,
        },
      },
    ],
  },
  {
    path: "",
    component: Layout,
    redirect: "/DataDaily",
    // meta: { title: 'message.menu.dashboard.name', icon: 'el-icon-menu' },
    children: [
      {
        path: "DataDaily",
        component: createNameComponent(() =>
          import("@/views/main/pages/DataDailyQuery/index.vue")
        ),
        meta: {
          title: "message.menu.page.DataDailyQuery",
          icon: "el-icon-s-data",
          hideClose: true,
        },
      },
    ],
  },
  {
    path: "",
    component: Layout,
    redirect: "/LogiData",
    // meta: { title: 'message.menu.dashboard.name', icon: 'el-icon-menu' },
    children: [
      {
        path: "LogiData",
        component: createNameComponent(() =>
          import("@/views/main/pages/LogiTestDataQuery/index.vue")
        ),
        meta: {
          title: "message.menu.page.LogiTestDataQuery",
          icon: "el-icon-document",
          hideClose: true,
        },
      },
    ],
  },
  {
    path: "",
    component: Layout,
    redirect: "/LogiAcousticDataQuery",
    // meta: { title: 'message.menu.dashboard.name', icon: 'el-icon-menu' },
    children: [
      {
        path: "LogiAcousticDataQuery",
        component: createNameComponent(() =>
          import("@/views/main/pages/LogiAcousticDataQuery/index.vue")
        ),
        meta: {
          title: "message.menu.page.LogiAcousticDataQuery",
          icon: "el-icon-download",
          hideClose: true,
        },
      },
    ],
  },
  {
    path: "",
    component: Layout,
    redirect: "/WebPageView",
    meta: {
      title: "message.menu.page.WebPageView",
      icon: "el-icon-picture-outline",
    },
    children: [
      {
        path: "Background",
        component: createNameComponent(() =>
          import("@/views/main/pages/WebPageView/Background.vue")
        ),
        meta: {
          title: "message.menu.page.BackgroundName",
          hideClose: true,
        },
      },
      {
        path: "Versioning",
        component: createNameComponent(() =>
          import("@/views/main/pages/WebPageView/Versioning.vue")
        ),
        meta: {
          title: "message.menu.page.VersioningName",
          hideClose: true,
        },
      }
    ],
  },
];

export default route;
