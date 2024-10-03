<script lang="ts" setup>
import { CategoryResponse } from '@/type/category/response/CategoryResponse';
import CategoryActions from './CategoryActions.vue';
import { defineProps, computed, defineEmits} from 'vue';
import en from "element-plus/es/locale/lang/en"; // Import ngôn ngữ tiếng Anh
import vi from "element-plus/es/locale/lang/vi";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// Tạo biến trung gian cho props
const categories = computed(() => props.categories);
const pager = computed(() => props.pager);

// Props
const props = defineProps<{
  categories: CategoryResponse[],
  pager: any
}>();
//Emit
const emit = defineEmits<{
  (e: 'pageChange', newPage: number): void,
  (e: 'sizeChange', newSize: number): void,
  (e: 'openTab', dataTab: any, categoryId: number): void
  (e: 'deleted', id: number): void
  (e: 'loadData'): void
}>();

const currentLanguage = localStorage.getItem('language') || 'en'; 

const locale = computed(() => {
  return currentLanguage === 'vi' ? vi : en; 
});

const handleOpenTab = (dataTab: any, categoryId: number) => {
  emit('openTab', dataTab, categoryId);
}

const onPageChange = (newPage: number) => {
  emit('pageChange', newPage - 1);
}
const onSizeChange = (newSize: number) => {
  emit('sizeChange', newSize);
}
const handleDeleted = (id: number) => {
  emit('deleted', id);
}

const handleLoadData = () => {
  emit('loadData');
}

</script>

<template>
    <el-config-provider :locale="locale"> 
  <!-- Bảng -->
  <el-table style="font-size: x-small; font-weight: 400;" border  
    :data="categories" :row-key="(row: CategoryResponse) => row.id">
    <el-table-column align="center" prop="img" :label="t('image')" width="100">
      <template v-slot="{ row }">
        <img v-if="row.img !== null" :src="row.img" alt="Ảnh"
          style="width: 50%; max-height: 50px; border-radius: 10px" />
        <img v-if="row.img === null" src="/noimage.png" alt="Ảnh ko có"
          style="width: 50%; max-height: 50px; border-radius: 10px" />
      </template>
    </el-table-column>
    <el-table-column prop="categoryCode" :label="t('categoryCode')" width="100" />
    <el-table-column prop="name" :label="t('name')" width="110" />
    <el-table-column prop="description" :label="t('description')" width="120" />
    <el-table-column prop="createdDate" :label="t('createdDate')" width="130" />
    <el-table-column prop="modifiedDate" :label="t('modifiedDate')" width="130" />
    <el-table-column prop="createdBy" :label="t('createdBy')" width="100" />
    <el-table-column prop="modifiedBy" :label="t('modifiedBy')" width="100" />
    <el-table-column prop="status" width="120" align="center" :label="t('status')">
      <template v-slot="{ row }">
        <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">{{ t(row.status) }}</el-tag>
      </template>
    </el-table-column>
    <!-- Hành động -->
    <el-table-column align="center" :label="t('action')" min-width="150">
      <template v-slot="{ row }">
        <CategoryActions @loadData="handleLoadData" @deleted="handleDeleted" @openTab="handleOpenTab" :idCategory="row.id" />
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
        :disabled="false" 
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pager.totalElements"
        @size-change="onSizeChange"
        @current-change="onPageChange" />
    </div>
  </el-config-provider>

</template>

<style scoped>



.demo-tabs>.el-tabs__content {
padding: 0 !important;

}
.el-table {
  background-color: #f5f7fa;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>