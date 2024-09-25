import CategoryCreate from "@/components/category/CategoryCreate.vue";
import CategoryTable from "@/components/category/CategoryTable.vue";
import ProductCreate from "@/components/product/ProductCreate.vue";
import ProductForm from "@/components/product/ProductForm.vue";
import ProductTable from "@/components/product/ProductTable.vue";
import ProductUpdate from "@/components/product/ProductUpdate.vue";
import AdminView from "@/views/AdminView.vue";
import CategoryView from "@/views/Category/CategoryView.vue";
import ProductView from "@/views/Product/ProductView.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/admin',
        component: AdminView,
        children: [
            {
                path: 'product',
                component: ProductView,
                children: [
                    {path: 'list', component: ProductTable, name: 'ListProduct'},
                    {path: 'create', component: ProductCreate, name: 'CreateProductForm'},
                    {path: 'update/:id', component: ProductUpdate},
                ]
            },
            {
                path: 'category',component: CategoryView, name: 'CategoryView'
            }
        ]
    }
];
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router;