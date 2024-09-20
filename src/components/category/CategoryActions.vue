<script lang="ts" setup>
import { Edit, Delete, View } from '@element-plus/icons-vue'
import CategoryDialog from './CategoryDialog.vue';
import { ref, defineProps } from 'vue';
import { CategoryResponse } from '@/type/category/response/CategoryResponse';
import { CategoryService } from '@/services/admin/category/CategoryService';
const props = defineProps<{
    idCategory: number
}>();

const idC = ref(props.idCategory);


const isModalVisible = ref(false);
const modalTitle = ref('');
const modalAction = ref('');
const category = ref<CategoryResponse>();
const categoryService = new CategoryService();

const handleView = () => {
    // TODO: Add logic for view action
    fetchCategoryById(props.idCategory);
    modalTitle.value = 'Chi tiết danh mục';
    isModalVisible.value = true;
    modalAction.value = 'view';
    console.log('Handle View');
}

const handleUpdate = () => {
    // TODO: Add logic for view action
    fetchCategoryById(props.idCategory);
    modalTitle.value = 'Chỉnh sửa danh mục';
    isModalVisible.value = true;
    modalAction.value = 'update';
    console.log('Handle Update');
}

const handleDelete = () => {
    // TODO: Add logic for view action
    modalTitle.value = 'Xác nhận xóa danh mục';
    isModalVisible.value = true;
    modalAction.value = 'delete';
}

const fetchCategoryById = async (id: number) => {
    try {
        const response = await categoryService.getCategoryById(id);
        category.value = response;
    } catch (error) {
        console.error('Lỗi khi lấy category với id: ', error);
    }
}

</script>

<template>
    <teleport to="body">
        <CategoryDialog :title="modalTitle" :visibleD="isModalVisible" :action="modalAction" :category="category"
            @update:visibleD="isModalVisible = $event">
        </CategoryDialog>
    </teleport>
    <div>
        <el-button type="primary" :icon="View" circle size="normal" @click="handleView" />
        <el-button type="success" :icon="Edit" circle size="normal" @click="handleUpdate" />
        <el-button type="danger" :icon="Delete" circle size="normal" @click="handleDelete" />
    </div>
</template>
<style></style>