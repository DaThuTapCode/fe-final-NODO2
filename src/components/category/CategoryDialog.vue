<script lang="ts" setup>
import { CategoryResponse } from '@/type/category/response/CategoryResponse';
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// Khai báo các props
const props = defineProps<{
    title: string;
    visibleD: boolean;
    action: string;
    category?: CategoryResponse;
}>();
// Định nghĩa emits
const emit = defineEmits<{
    (e: 'update:visibleD', value: boolean): void;
    (e: 'update:action', value: string): void;
    (e: 'delete'): void;
    (e: 'updateCategory', value: any): void;
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

const handleClose = () => {
    emit('update:visibleD', false);
};

const confirmDelete = () => {
    handleClose();
    emit('delete');
}


</script>

<template>
    <el-dialog v-model="dialogVisible" @close="handleClose" width="600">
        <!-- <hr> -->
        <div v-if="actionContent === 'delete'">
            <el-alert :closable="false" :title="t('deleteCategory')" type="warning"
                :description="t('doYouWantDeleteCategory', { categoryName: props.category?.name })" show-icon />

            <div class="dialog-footer">
                <el-button @click="handleClose">{{ t('cancel') }}</el-button>
                <el-button type="primary" @click="confirmDelete">{{ t('confirm') }}</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<style>
.dialog-footer {
    margin: 10px;
    display: flex;
    justify-content: right;
}
</style>
