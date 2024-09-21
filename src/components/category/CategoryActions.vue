<script lang="ts" setup>
import { Edit, Delete, View } from '@element-plus/icons-vue'
import CategoryDialog from './CategoryDialog.vue';
import { ref, defineProps, defineEmits, inject } from 'vue';
import { CategoryResponse } from '@/type/category/response/CategoryResponse';
import { CategoryService } from '@/services/admin/category/CategoryService';
import { NotificationUtil } from '@/util/Notification';
const props = defineProps<{
    idCategory: number
}>();


const isModalVisible = ref(false);
const modalTitle = ref('');
const modalAction = ref('');
const category = ref<CategoryResponse>();
const categoryService = new CategoryService();

const handleView = () => {
    fetchCategoryById(props.idCategory);
    modalTitle.value = 'Chi tiết danh mục';
    isModalVisible.value = true;
    modalAction.value = 'view';
    console.log('Handle View');
}

const handleUpdate = () => {
    fetchCategoryById(props.idCategory);
    modalTitle.value = 'Chỉnh sửa danh mục';
    isModalVisible.value = true;
    modalAction.value = 'update';
    console.log('Handle Update');
}

const handleDelete = () => {
    modalTitle.value = 'Xác nhận xóa danh mục';
    isModalVisible.value = true;
    modalAction.value = 'delete';
}

const emit = defineEmits<{
    (e: 'deleted'): void
}>();

const handleConfirmDelete = async () => {
    try {
        const response = await categoryService.deleteCategory(props.idCategory);
        if (response?.status === 204) {
            NotificationUtil.openMessageSuccess('Xóa thành công loại sản phẩm!');
            emit('deleted');
        }
    } catch (error) {
        console.error('Lỗi xóa category: ', error);
    }
}
const fetchCategories = inject<() => void>('fetchCategories');

// Gọi api update category
const callUpdateCategory = async (data: any) => {
    try {
        await categoryService.updateCategory(data.id, data.value);
        if (fetchCategories) {
            fetchCategories(); // Gọi hàm fetchCategories để tải lại danh sách danh mục
        }
    } catch (error) {
        console.error('Lỗi update category: ', error);
    }
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
            @update:visibleD="isModalVisible = $event" @delete="handleConfirmDelete"
            @updateCategory="callUpdateCategory">
        </CategoryDialog>
    </teleport>
    <div>
        <el-button type="primary" :icon="View" circle size="normal" @click="handleView" />
        <el-button type="success" :icon="Edit" circle size="normal" @click="handleUpdate" />
        <el-button type="danger" :icon="Delete" circle size="normal" @click="handleDelete" />
    </div>
</template>
<style></style>