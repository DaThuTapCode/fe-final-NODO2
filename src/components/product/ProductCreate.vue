<script lang="ts" setup>
import { provide, ref } from 'vue';
import ProductForm from './ProductForm.vue';
import { ProductService } from '@/services/admin/product/ProductService';
const productService = new ProductService;

const createProduct = async (data: FormData) => {
    try {
        productService.createNewProduct(data);
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm mới', error);
    }
}


provide('createProduct', createProduct);

const productD = ref<any>({})

</script>

<template>
    <div class="container">
        <div class="form-zone">
            <ProductForm :data-product="productD" :view-mode="'create'" />
        </div>
    </div>

</template>

<style scoped>
.container {
    /* display: flex; */
    justify-content: center;
}
.form-zone {
    max-width: 800px
}
</style>