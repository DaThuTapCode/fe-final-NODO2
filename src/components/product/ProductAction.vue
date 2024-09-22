<script lang="ts" setup>
import { Edit, Delete, View } from '@element-plus/icons-vue'
import { ref, defineProps, inject } from 'vue';
import ProductDialogAction from './ProductDialogAction.vue';

const props = defineProps<{
    product: any
}>(); 
const product = ref(props.product);

const getProductById = inject<(id: number) => Promise<any>>('getProductById');

const dialogVisible = ref(false);

const dialogType = ref<'view' | 'update' | 'delete'>('view');
const dialogTitle = ref('');

const handleAction = async (type: 'view' | 'update' | 'delete') => {
    dialogType.value = type;
    dialogVisible.value = true;
    if(type === 'view') {
        if(getProductById) {
        product.value = await  getProductById(product.value.id);
    }
        dialogTitle.value = 'Xem chi tiết sản phẩm';
    }else if(type === 'update') {
        dialogTitle.value = 'Update sản phẩm';
    }else {
        dialogTitle.value = 'Xóa sản phẩm';
    }
}

const handleCloseDialog = () => {
    dialogVisible.value = false;
}

</script>

<template>
    <div>
        <el-button type="primary" :icon="View" circle size="normal" @click="handleAction('view')" />
        <el-button type="success" :icon="Edit" circle size="normal" @click="handleAction('update')" />
        <el-button type="danger" :icon="Delete" circle size="normal" @click="handleAction('delete')" />
    </div>

    <teleport to="body">
            <ProductDialogAction :product="product" :type="dialogType" :visible="dialogVisible" :titleDialog="dialogTitle" @close="handleCloseDialog"/>
    </teleport>

</template>


<style></style>