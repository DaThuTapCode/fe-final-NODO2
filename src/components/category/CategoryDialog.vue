<template>
    <el-dialog v-model="dialogVisible" :title="title" @close="handleClose" width="600">
        <hr>
        <div v-if="(actionContent === 'update' || actionContent === 'view') && categoryUpdate">
            <CategoryForm :data="category"  :view-mode="actionContent" />
        </div>
        <div v-else-if="actionContent === 'delete'">
            delete
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { CategoryResponse } from '@/type/category/response/CategoryResponse';
import CategoryForm from './CategoryForm.vue';
import { ref, defineProps, defineEmits, watch } from 'vue';

// Khai báo các props
const props = defineProps<{
    title: string;
    visibleD: boolean;
    action: string;
    category?: CategoryResponse;
}>();

// Định nghĩa biến reactive cho dialog
const dialogVisible = ref(props.visibleD);
const actionContent = ref(props.action);
const categoryUpdate = ref<CategoryResponse | undefined>(props.category);

// Theo dõi sự thay đổi của props.visibleD
watch(() => props.visibleD, (newVisible) => {
    dialogVisible.value = newVisible;
});

// Theo dõi sự thay đổi của props.action
watch(() => props.action, (newAction) => {
    actionContent.value = newAction;
});

// Theo dõi sự thay đổi của props.category
watch(() => props.category, (newCategory) => {
    categoryUpdate.value = newCategory || undefined;
});

// Định nghĩa emits
const emit = defineEmits<{
    (e: 'update:visibleD', value: boolean): void;
    (e: 'update:action', value: string): void;
}>();

const handleClose = () => {
    emit('update:visibleD', false);
};
</script>
