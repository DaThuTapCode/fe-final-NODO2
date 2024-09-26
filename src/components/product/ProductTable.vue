<script lang="ts" setup>
import { ProductService } from '@/services/admin/product/ProductService';
import { ProductSearchResponse } from '@/type/product/response/ProductSearchResponse';
import { PaginationObject } from '@/type/util/PaginationObject';
import { nextTick, onMounted, provide, ref, watch } from 'vue';
import ProductAction from './ProductAction.vue';
import ProductFormSearch from './ProductFormSearch.vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { NotificationUtil } from '@/util/Notification';
const { t } = useI18n();

//Service
const productService = new ProductService();


//Variable
const products = ref<ProductSearchResponse[]>([]); //Hứng dữ liệu mảng product
const pager = ref<any>({}); // Hứng dữ liệu phân trang

//Chứa dữ liệu phân trang
const pagination = ref<PaginationObject>({
  page: 0,
  size: 5,
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
   const response =  await productService.deleteProduct(id);
   if(response.status === 204){
    NotificationUtil.openMessageSuccess(t('success'), t('deleteSuccessfully'))
    fetchProduct(pagination.value, paramsSearch.value);
   } 
    
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

//tăng só phần tử trên 1 trang
const handleSizeChange = (newSize: any) => {
  pagination.value.size = newSize;
  fetchProduct(pagination.value, paramsSearchQuery.value);
}

onMounted(() => {
  fetchProduct(pagination.value, paramsSearchQuery.value);
})

</script>

<template>
  <ProductFormSearch @search="handleSearchFetchProduct" />
  <p>{{ t('productList') }}</p>

  <!-- Bảng -->
  <el-table
    v-if="products"
    :data="products"
    height="410"
    style="width: 100%; font-size: x-small; font-weight: 400;"
    :row-key="(row: ProductSearchResponse) => row.id"
    stripe
    border
    highlight-current-row
  >
    <!-- Ảnh -->
    <el-table-column align="center" fixed prop="img" :label="t('image')" width="120">
      <template #default="{ row }">
        <img
          v-if="row.img !== null"
          
          :src="row.img"
          :alt="row.name"
          style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px"
        />
        <img
          v-if="row.img === null"
          src="/noimage.png"
          :alt="row.name"
          style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px"
        />
      </template>
    </el-table-column>

    <!-- Mã -->
    <el-table-column prop="productCode" :label="t('code')" width="120" />

    <!-- Tên -->
    <el-table-column prop="name" :label="t('name')" width="180" />

    <!-- Mô tả -->
    <el-table-column prop="description" :label="t('description')" width="200" />

    <!-- Danh mục -->
    <el-table-column prop="categories" :label="t('category')" width="150" />

    <!-- Giá -->
    <el-table-column prop="price" :label="t('price')" width="120" />

    <!-- Ngày sửa -->
    <!-- <el-table-column prop="modifiedDate" :label="t('modifiedDate')" width="160" /> -->

    <!-- Người sửa -->
    <!-- <el-table-column prop="modifiedBy" :label="t('modifiedBy')" width="120" /> -->

    <!-- Ngày tạo -->
    <!-- <el-table-column prop="createdDate" :label="t('createdDate')" width="160" /> -->

    <!-- Người tạo -->
    <!-- <el-table-column prop="createdBy" :label="t('createdBy')" width="120" /> -->

    <!-- Trạng thái -->
    <el-table-column prop="status" :label="t('status')" width="120">
      <template v-slot="{ row }">
        <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
          {{ t(row.status) }}
        </el-tag>
      </template>
    </el-table-column>

    <!-- Hành động -->
    <el-table-column fixed="right" :label="t('action')" min-width="150">
      <template #default="{ row }">
        <ProductAction :product="row" @delete="deleteProduct" />
      </template>
    </el-table-column>
  </el-table>

  <!-- Phân trang -->
  <div class="demo-pagination-block" style="float: right; margin: 10px;">
    <el-pagination
      v-model:current-page="pager.page"
      v-model:page-size="pager.size"
      :page-sizes="[5, 10, 20, 50]"
      :size="'default'"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pager.totalElements"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style scoped>
.el-table {
  background-color: #f5f7fa;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-table th {
  background-color: #2a3650;
  color: white;
  font-weight: bold;
}

.el-table td {
  padding: 12px;
  color: #333;
}

.el-table__body-wrapper {
  border-radius: 8px;
}

.demo-pagination-block {
  display: flex;
  justify-content: flex-end;
}
</style>
