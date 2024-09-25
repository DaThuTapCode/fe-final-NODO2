<script lang="ts" setup>
import { provide, ref } from 'vue';
import ProductForm from './ProductForm.vue';
import { ProductService } from '@/services/admin/product/ProductService';
import { NotificationUtil } from '@/util/Notification';
import { useI18n } from 'vue-i18n';
const productService = new ProductService;

const {t } = useI18n(); 
const createProduct = async (data: FormData) => {
    try {
    const response =  await  productService.createNewProduct(data);
    if(response?.status === 200) {
        NotificationUtil.openMessageSuccess(t('success'),t ('createSuccessfully'));
    }
    } catch (error: any) {
        NotificationUtil.openMessageError(t('error'), error.response.data.message);
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