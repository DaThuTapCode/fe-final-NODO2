<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue';
import ProductForm from './ProductForm.vue';
import { ProductService } from '@/services/admin/product/ProductService';
import { useRoute } from 'vue-router';
import { NotificationUtil } from '@/util/Notification';
import { useI18n } from 'vue-i18n';
import router from '@/routers/router';
const productService = new ProductService;
const { t } = useI18n();
const productD = ref<any>(null); // Khởi tạo giá trị null để biểu thị dữ liệu chưa được tải
const route = useRoute();
const id = route.params.id;

// Lấy sản phẩm theo id
const getProductById = async () => {
  try {
    const response = await productService.getProductById(id);
    productD.value = response.data; // Cập nhật productD với dữ liệu từ API
  } catch (error: any) {
    NotificationUtil.openMessageError(t('error'), error.response.data.message);
    router.push({name: "ListProduct"})
    console.error('Lỗi khi lấy sản phẩm theo id: ', error);
  }
}

// Chỉnh sửa sản phẩm 
const updateProduct = async(data: FormData) => {
  try {
    const response = await productService.updateProduct(id, data);
    productD.value = response; // Cập nhật productD với dữ liệu từ API
    if(response.status === 200 ) {
      NotificationUtil.openMessageSuccess(t('success'), t('updateSuccesfully'));
    }
  } catch (error: any) {
    NotificationUtil.openMessageError(t('error'), error.response.data.message);
  }
}

provide('updateProduct', updateProduct);


onMounted( () => {
  getProductById();
});
</script>

<template>
  <div class="container">
    <div class="form-zone">
      <ProductForm v-if="productD" :data-product="productD" :view-mode="'update'" />
    </div>
  </div>
</template>

<style scoped>
.container {
  justify-content: center;
}
.form-zone {
  max-width: 800px;
}
</style>
