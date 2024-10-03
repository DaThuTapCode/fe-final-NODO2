<script lang="ts" setup>
import { Edit, Delete, View } from '@element-plus/icons-vue'
import { ref, defineProps } from 'vue';
import ProductDialogAction from './ProductDialogAction.vue';
import { useI18n } from 'vue-i18n';
import router from '@/routers/router';

const { t } = useI18n();
const props = defineProps<{
    product: any
}>();

const product = ref(props.product);

const dialogVisible = ref(false);

const dialogType = ref<'view' | 'update' | 'delete'>('view');

const dialogTitle = ref('');

const handleAction = async (type: 'view' | 'update' | 'delete') => {
    if (type === 'view') {
        router.push({ path: `/admin/product/view/${product.value.id}` });
    } else if (type === 'update') {
        router.push({ path: `/admin/product/update/${product.value.id}` });
    } else {
        dialogType.value = type;
        dialogVisible.value = true;
        dialogTitle.value = 'Xóa sản phẩm';
    }
}
const handleCloseDialog = () => {
    dialogVisible.value = false;
}
</script>

<template>
    <div>
        <el-button :title="t('view')" type="primary" :icon="View" circle size="normal" @click="handleAction('view')" />
        <el-button :title="t('update')" type="success" :icon="Edit" circle size="normal"
            @click="handleAction('update')" />
        <el-button :title="t('delete')"  :icon="Delete" circle size="normal" @click="handleAction('delete')" />
    </div>

    <teleport to="body">
        <ProductDialogAction :product="product" :type="dialogType" :visible="dialogVisible" :titleDialog="dialogTitle"
            @close="handleCloseDialog" />
    </teleport>
</template>


<style></style>