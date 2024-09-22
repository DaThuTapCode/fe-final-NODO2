<template>
  <!-- Form search Category -->
  <CategoryFormSearch />
  <!-- /Form search Category -->
  <div>
    <h1>DANH SÁCH LOẠI SẢN PHẨM</h1>
  </div>
  <!-- Phân trang -->
  <div v-if="pager.totalPages" style="margin-bottom: 20px;">
    <el-pagination background layout="pager" 
    :total="pager.totalElements"
    :page-size="pager.size"
     @current-change="handlePageChange"
     />
  </div>
  <!-- /Phân trang -->

 <!-- Bảng -->
 <el-table
    v-if="categories.length"
    :data="categories"
    :row-key="(row: CategoryResponse) => row.id"
    style="width: 100%; border-radius: 15px; "> 
    <!-- Cột ảnh -->
    <el-table-column prop="img" label="" width="120">
      <template v-slot="{ row }">
        <img
          v-if="row.img"
          :src="row.img"
          alt="Ảnh"
          style="width: 50%; max-height: 50px; border-radius: 10px" />
        <span v-else>Không có ảnh</span>
      </template>
    </el-table-column>

    <!-- Mã danh mục -->
    <el-table-column prop="categoryCode" label="Mã danh mục" width="150" />

    <!-- Tên danh mục -->
    <el-table-column prop="name" label="Tên" width="120" />

    <!-- Ngày tạo -->
    <el-table-column prop="createdDate" label="Ngày tạo" width="180" />

    <!-- Ngày sửa cuối -->
    <el-table-column prop="modifiedDate" label="Ngày sửa cuối" width="180" />

    <!-- Người tạo -->
    <el-table-column prop="createdBy" label="Người tạo" width="180" />

    <!-- Người sửa cuối -->
    <el-table-column prop="modifiedBy" label="Người sửa cuối" width="180" />

    <!-- Trạng thái -->
    <el-table-column prop="status" label="Trạng thái" width="300">
      <template v-slot="{ row }">
        <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">{{ row.status }}</el-tag>
      </template>
    </el-table-column>

    <!-- Hành động -->
    <el-table-column fixed="right" label="Hành động" min-width="150">
      <template v-slot="{ row }">
        <CategoryActions @deleted="fetchCategories" :idCategory="row.id" />
      </template>
    </el-table-column>
  </el-table>
 <!-- /Bảng -->
  <!-- Hiển thị nếu không có dữ liệu -->
  <div v-else>
    Không có dữ liệu
  </div>
 
</template>
 
<script lang="ts" setup>
import { CategoryService } from '@/services/admin/category/CategoryService';
import { CategoryResponse } from '@/type/category/response/CategoryResponse';
import { PaginationObject } from '@/type/util/PaginationObject';
import CategoryFormSearch from './CategoryFormSearch.vue';
import CategoryActions from './CategoryActions.vue';
import { onMounted, provide, ref } from 'vue';

const categories = ref<CategoryResponse[]>([]);
const pager = ref<any>({});
const categoryService = new CategoryService();
const pagination: PaginationObject = {
  page: 0,
  size: 8,
  sortBy: null,
  direction: null
}
const fetchCategories = async () => {
  try {
    const response = await categoryService.getPageCategory(pagination);
    categories.value = response.content;
    pager.value = response;
    console.log('pager', pager.value.totalPages);
  } catch (error) {
    console.error('Lỗi khi fetch category: ', error)
  }
}

//Provie
provide('fetchCategories', fetchCategories);

onMounted(() => {
  fetchCategories()
})

const handlePageChange = (newPage: any) =>{
  pagination.page = newPage -1;
  fetchCategories();
}


</script>

<style scoped></style>