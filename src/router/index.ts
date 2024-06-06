import {createRouter,createWebHistory} from 'vue-router'

// @ts-ignore
import  Login from '../view/login/Login.vue'
// @ts-ignore
import  Index from '../view/index/Index.vue'
// @ts-ignore
import  Ability from '../view/ability/Ability.vue'
// @ts-ignore
import  Community from '../view/community/Community.vue'
// @ts-ignore
import  Public from '../view/public/Public.vue'
// @ts-ignore
import  Center from '../view/center/Center.vue'
// @ts-ignore
import  Note from '../components/center/Note.vue'
// @ts-ignore
import Admin from "../view/Admin.vue";
// @ts-ignore
import ArticleAdd from "../components/admin/ArticleAdd.vue";

// @ts-ignore
import Article from "../components/admin/article/Article.vue";
// @ts-ignore
import AddArticle from "../components/admin/article/AddArticle.vue";
// @ts-ignore
import EditArticle from "../components/admin/article/EditArticle.vue";
// @ts-ignore
import Lesson from "../components/admin/lesson/Lesson.vue";
// @ts-ignore
import EditLesson from "../components/admin/lesson/EditLesson.vue";
// @ts-ignore
import AddLesson from "../components/admin/lesson/AddLesson.vue";
// @ts-ignore
import Carousel from "../components/admin/carousel/Carousel.vue";
// @ts-ignore
import AddCarousel from "../components/admin/carousel/AddCarousel.vue";
// @ts-ignore
import EditCarousel from "../components/admin/carousel/EditCarousel.vue";
// @ts-ignore
import All from "../view/index/All.vue";
// @ts-ignore
import AllArticle from "../view/index/AllArticle.vue";
// @ts-ignore
import ArticleDetail from "../components/index/ArticleDetail.vue";
// @ts-ignore
import LessonDetail from "../components/index/LessonDetail.vue";
// @ts-ignore
import Bank from "../components/admin/exam/bank/Bank.vue";
// @ts-ignore
import EditBank from "../components/admin/exam/bank/EditBank.vue";
// @ts-ignore
import AddBank from "../components/admin/exam/bank/AddBank.vue";
// @ts-ignore
import Question from "../components/admin/exam/question/Question.vue";
// @ts-ignore
import AddQuestion from "../components/admin/exam/question/AddQuestion.vue";
// @ts-ignore
import EditQuestion from "../components/admin/exam/question/EditQuestion.vue";
// @ts-ignore
import Examination from "../components/ability/Examination.vue";
export const routes = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path:'/login',
        name:'login',
        component: Login
    },
    {
        path:'/index',
        name:'index',
        component: Index
    },
    {
        path:'/all',
        name:'all',
        component: All
    },
    {
        path:'/all-article',
        name:'all-article',
        component: AllArticle
    },
    {
        path:'/article-detail',
        name:'article-detail',
        component: ArticleDetail
    },
    {
        path:'/lesson-detail',
        name:'lesson-detail',
        component: LessonDetail
    },
    {
        path:'/ability',
        name:'ability',
        component: Ability
    },
    {
        path:'/community',
        name:'community',
        component: Community
    },
    {
        path:'/public',
        name:'public',
        component: Public
    },
    {
        path:'/center',
        name:'center',
        component: Center
    },
    {
        path:'/note',
        name:'note',
        component: Note
    },
    {
        path:'/exam',
        name:'exam',
        component: Examination
    },
    {
        path:'/admin',
        name:'admin',
        component: Admin,
        children: [
            {
                path: 'system-management/menu-1', // 默认子路由路径，即 '/admin'
                name: 'system-management',
                component: Index,
            },
            {
                path: 'system-management/sub-1',
                name: 'adminDirectory-1',
                component: Lesson,
            },
            {
                path: 'system-management/sub-1/edit/',
                name: 'EditLesson',
                component: EditLesson,
            },
            {
                path: 'system-management/sub-1/add/',
                name: 'AddLesson',
                component: AddLesson,
            },
            {
                path: 'system-management/sub-2',
                name: 'adminDirectory-2',
                component: Article,
            },
            {
                path: 'system-management/sub-2/edit/',
                name: 'EditArticle',
                component: EditArticle,
            },
            {
                path: 'system-management/sub-2/add/',
                name: 'AddArticle',
                component: AddArticle,
            },
            {
                path: 'system-management/sub-3',
                name: 'adminDirectory-3',
                component: Carousel,
            },
            {
                path: 'system-management/sub-3/add/',
                name: 'AddCarousel',
                component: AddCarousel,
            },
            {
                path: 'system-management/sub-3/edit/',
                name: 'EditCarousel',
                component: EditCarousel,
            },
            {
                path: 'system-management/menu-2',
                name: 'adminMenu-1',
                component: Center,
            },
            {
                path: 'system-management/menu-3',
                name: 'adminMenu-2',
                component: Index,
            },

            {
                path: 'system-management/menu-4',
                name: 'adminMenu-4',
                component: Bank,
            },
            {
                path: 'system-management/menu-4/edit/',
                name: 'EditBank',
                component: EditBank,
            },
            {
                path: 'system-management/menu-4/add/',
                name: 'AddBank',
                component: AddBank,
            },
            {
                path: 'system-management/menu-5',
                name: 'adminMenu-5',
                component: Question,
            },
            {
                path: 'system-management/menu-5/add/',
                name: 'AddQuestion',
                component: AddQuestion,
            },
            {
                path: 'system-management/menu-5/edit/',
                name: 'EditQuestion',
                component: EditQuestion,
            },
        ],
    }


]
export const router = createRouter({
    history:createWebHistory(),
    routes
})

