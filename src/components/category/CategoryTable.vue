<template>
  <!-- Form search Category -->
  <CategoryFormSearch />
  <!-- /Form search Category -->
  <div>
    <h1>DANH SÁCH LOẠI SẢN PHẨM</h1>
  </div>
  <!-- Phân trang -->
  <div v-if="pager.totalPages > 1" style="margin-bottom: 20px;">
    <el-pagination background layout="pager" :total="pager.totalElements" :page-size="pager.size" />
  </div>
  <!-- /Phân trang -->

  <!-- Bảng -->
  <el-table v-if="categories.length" :data="categories"
    style="width: 100%; border-radius: 15px; border: solid lightgray 1px ;">
    <el-table-column prop="img" label="" width="120">
      <template #default="{ row }">
        <img :src="row.img" alt="Ảnh" style="width: 50%; height: auto; border-radius: 10px">
      </template>
    </el-table-column>
    <el-table-column prop="categoryCode" label="Mã danh mục" width="150" />
    <el-table-column prop="name" label="Tên" width="120" />
    <el-table-column prop="createdDate" label="Ngày tạo" width="180" />
    <el-table-column prop="modifiedDate" label="Ngày sửa cuối" width="180" />
    <el-table-column prop="createdBy" label="Người tạo" width="180" />
    <el-table-column prop="modifiedBy" label="Người sửa cuối" width="180" />
    <el-table-column prop="status" label="Trạng thái" width="300">
      <template v-slot="scope">
        <el-tag type="success">{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Hành động" min-width="150">
      <template #default="row">
        <CategoryActions :idCategory="row.row.id" />
      </template>
    </el-table-column>
  </el-table>
  <!-- /Bảng -->
</template>

<script lang="ts" setup>
import { CategoryService } from '@/services/admin/category/CategoryService';
import { CategoryResponse } from '@/type/category/response/CategoryResponse';
import { PaginationObject } from '@/type/util/PaginationObject';
import CategoryFormSearch from './CategoryFormSearch.vue';
import CategoryActions from './CategoryActions.vue';
import { onMounted, ref } from 'vue';

const categories = ref<CategoryResponse[]>([]);
const pager = ref<any>({});
const categoryService = new CategoryService();
const pagination: PaginationObject = {
  page: 0,
  size: 10,
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
onMounted(() => {
  fetchCategories()
})


</script>

<style scoped></style>