<template>
  <ProductFormSearch @search="handleSearchFetchProduct"/>
  <h1>Danh sách sản phẩm</h1>
  <!-- Phân trang -->
  <div v-if="pager.totalPages" style="margin-bottom: 20px;">
    <el-pagination background layout="pager" :total="pager.totalElements" :page-size="pager.size"
      @current-change="handlePageChange" />
  </div>
  <!-- Bảng -->
  <el-table v-if="products" :data="products" style="width: 100%" :row-key="(row: ProductSearchResponse) => row.id">
    <el-table-column fixed prop="img" label="Ảnh" width="120">
      <template #default="{ row }">
        <img :src="row.img" :alt="row.name" style="width: 50%; max-height: 50px; border-radius: 10px">
      </template>
    </el-table-column>
    <el-table-column prop="productCode" label="Mã sản phẩm" width="120" />
    <el-table-column prop="name" label="Name" width="160" />
    <el-table-column prop="description" label="Mô tả" width="120" />
    <el-table-column prop="categories" label="Loại sản phẩm" width="120" />
    <el-table-column prop="price" label="Giá" width="120" />
    <el-table-column prop="createdDate" label="Ngày tạo" width="160" />
    <el-table-column prop="createdBy" label="Người tạo" width="120" />
    <el-table-column prop="modifiedDate" label="Ngày sửa cuối" width="160" />
    <el-table-column prop="modifiedBy" label="Người sửa cuối" width="120" />
    <el-table-column fixed="right" label="Operations" min-width="150">
      <template #default="{ row }">
        <ProductAction :product="row" @delete="deleteProduct"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ProductService } from '@/services/admin/product/ProductService';
import { ProductSearchResponse } from '@/type/product/response/ProductSearchResponse';
import { PaginationObject } from '@/type/util/PaginationObject';
import { nextTick, onMounted, provide, ref, watch } from 'vue';
import ProductAction from './ProductAction.vue';
import ProductFormSearch from './ProductFormSearch.vue';
import { useRoute } from 'vue-router';
//Service
const productService = new ProductService();


//Variable
const products = ref<ProductSearchResponse[]>([]); //Hứng dữ liệu mảng product
const pager = ref<any>({}); // Hứng dữ liệu phân trang

//Chứa dữ liệu phân trang
const pagination = ref<PaginationObject>({
  page: 0,
  size: 2,
  sortBy: null,
  direction: null
});

const paramsSearch = ref({});
//Hứng dữ liệu params search Product
const paramsSearchQuery = ref(null);

//Load dữ liệu danh sách product
const fetchProduct = async (paginationF: any, paramsSearchF: any) => {
  try {
    const response = await productService.getProductList(paginationF, paramsSearchF);
    paramsSearch.value = paginationF;
    products.value = response.content;
    pager.value = response;
  } catch (error) {
    console.error('Loi khi lay danh sach san pham: ', error);
  }
}

// XÓa sản phẩm
const deleteProduct = async (id: number) => {
  try {
    await productService.deleteProduct(id);
    fetchProduct(pagination.value, paramsSearch.value);
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm');
  }
}

//Lấy sản phẩm theo id
const getProductById = async(id: number) => {
  try {
    const response = await productService.getProductById(id);
    return response;
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm theo id: ', error);
  }
}

//provide
provide('deleteProduct', deleteProduct);
provide('getProductById', getProductById);

const route = useRoute();
const queryString = ref('');

// Theo dõi sự thay đổi của query params
watch(
  () => route.query,
  (newQuery) => {
    queryString.value = new URLSearchParams(newQuery as Record<string, string>).toString();
    console.log('Query string updated:', queryString.value);
  },
  { immediate: true } // Đảm bảo lấy giá trị ngay khi khởi tạo
);

const handleSearchFetchProduct = async (dataSearch: any) => {
  await nextTick(); // Chờ đến khi Vue cập nhật DOM và route.query kịp thay đổi

  console.log('Current Query string:', queryString.value);
  console.log('dataSearch:', dataSearch);
  paramsSearchQuery.value = dataSearch;
  fetchProduct(pagination.value, dataSearch);
};



//Đổi trang
const handlePageChange = (newPage: any) => {
  pagination.value.page = newPage - 1;
  fetchProduct(pagination.value, paramsSearchQuery.value);
}

onMounted(() => {
  fetchProduct(pagination.value, paramsSearchQuery.value);
})

</script>