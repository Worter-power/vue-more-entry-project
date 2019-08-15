const _import = require('@/router/' + process.env.NODE_ENV)
import config from "@/config.js";
import Vue from 'vue';
import Router from 'vue-router';
import store from '@/vuex/index.js';
import api from '@/api/index.js';
Vue.use(Router);
let router = new Router({
    mode: 'history',
    history: true,
    hashbang: false, //将路径格式化为#!开头
    transitionOnLoad: true, //初次加载是否启用场景切换
    saveScrollPosition: false, //在启用html5 history模式的时候生效，用于后退操作的时候记住之前的滚动条位置
    routes: [
        {
            path: "/home",
            name: "home",
            component: _import("page/index/Index"),
            children: [
                // 欢迎
                {
                    path: 'hello',
                    name: 'hello',
                    component: {
                        template: '<el-page-hello :name="name"></el-page-hello>',
                        data() {
                            return {
                                name: ''
                            }
                        },
                        created() {
                            this.name = this.$store.state.realName
                        }
                    },
                    meta: {
                        keepAlive: false
                    }
                },
                // 权限日志
                {
                    path: "auth",
                    name: "auth",
                    component: {
                        template: '<el-page-auth code="'+config.app+'" :unit-id="$store.state.unitId"></el-page-auth>',
                        created() {
                            this.$parent.$emit("currentPage", this.$route.path);
                        }
                    }
                },
                {
                    path: "log",
                    name: "log",
                    component: {
                        template: '<el-page-log code="' + config.app + '"></el-page-log>',
                        created() {
                            this.$parent.$emit("currentPage", this.$route.path);
                        }
                    }
                },
                // -----
                // 项目路由
                // -----
                // 重定向
                { path: "/", redirect: "/home/hello" }
            ]
        },
        { path: "/", redirect: "/home" },
        {
            path: '*',
            component: {
                template: '<el-not-find></el-not-find>'
            },
            meta: {
                keepAlive: true
            }
        }
    ],
    scrollBehavior(to, from, savedPosition) { //这个功能只在 HTML5 history 模式下可用
        if (savedPosition) {
            // return savedPosition
            return {
                x: 0,
                y: 0
            }
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    }
});

// 路由导航钩子
router.beforeEach((to, from, next) => {
    // 刷新用户信息
    let user = localStorage.getItem("user");
    if (user) {
        store.commit("getUserInfo");
        next();
    } else {
        api('get', '/api/uaa/oauth/me', {
            noIntercept: true
        }).then(res => {
            if (res.status == 200 && res.code == 'ok') {
                localStorage.setItem("user", JSON.stringify(res));
                location.reload();
            } else {
                if (!store.state.isShowLoginBox) {
                    if (process.env.NODE_ENV == 'development') {
                        store.commit('SHOW_LOGIN_DIALOG', true);
                    } else {
                        location.href = "/login?redirect_uri=" + encodeURIComponent(location.href);
                    }
                }
            }
        }).catch(err => {
            if (!store.state.isShowLoginBox) {
                if (process.env.NODE_ENV == 'development') {
                    store.commit('SHOW_LOGIN_DIALOG', true);
                } else {
                    location.href = "/login?redirect_uri=" + encodeURIComponent(location.href);
                }
            }
        })
    }
})

export default router
// export default routes