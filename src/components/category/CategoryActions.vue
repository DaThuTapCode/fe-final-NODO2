<script lang="ts" setup>
import { Edit, Delete, View } from '@element-plus/icons-vue'
import CategoryDialog from './CategoryDialog.vue';
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { CategoryResponse } from '@/type/category/response/CategoryResponse';
import { CategoryService } from '@/services/admin/category/CategoryService';
import CategoryForm from './CategoryForm.vue';
import { useI18n } from 'vue-i18n';
const { t }  = useI18n();
const props = defineProps<{
    idCategory: number
}>();

const isModalVisible = ref(false);
const modalTitle = ref('');
const modalAction = ref('');
const category = ref<CategoryResponse>();
const categoryService = new CategoryService();

const emit = defineEmits<{
    (e: 'deleted', id: any): void,
    (e: 'openTab', dataTab: any, categoryId: number): void
}>();

const handleView = async () => {
   await fetchCategoryById(props.idCategory);
    const data = category.value;
    const viewMode = 'view'
    const dataTab = {
        title: t('detail'),
        name: '3',
        components: [
            {
                component: CategoryForm,
                props: { data, viewMode },
                emits: [],
            }
        ],
    };
    emit('openTab', dataTab, props.idCategory);
}

const handleUpdate = async () => {
    await  fetchCategoryById(props.idCategory);
    const data = category.value;
    const viewMode = 'update'
    const dataTab = {
        title: t('update'),
        name: '4',
        components: [
            {
                component: CategoryForm,
                props: { data, viewMode },
                emits: [],
            }
        ],
    };
    emit('openTab', dataTab, props.idCategory);
}

const handleDelete = () => {
    modalTitle.value = 'Xác nhận xóa danh mục';
    isModalVisible.value = true;
    modalAction.value = 'delete';
}



const handleConfirmDelete = async () => {
    emit('deleted', props.idCategory);
}


const fetchCategoryById = async (id: number) => {
    try {
        const response = await categoryService.getCategoryById(id);
        category.value = response;
    } catch (error) {
        console.error('Lỗi khi lấy category với id: ', error);
    }
}

onMounted(() => {
    // fetchCategoryById(props.idCategory);
})

</script>

<template>
    <teleport to="body">
        <CategoryDialog :title="modalTitle" :visibleD="isModalVisible" :action="modalAction" :category="category"
            @update:visibleD="isModalVisible = $event" @delete="handleConfirmDelete"
            >
        </CategoryDialog>
    </teleport>
    <div>
        <el-button type="primary" :icon="View" circle size="normal" @click="handleView" />
        <el-button type="success" :icon="Edit" circle size="normal" @click="handleUpdate" />
        <el-button type="" :icon="Delete" circle size="normal" @click="handleDelete" />
    </div>
</template>
<style></style>