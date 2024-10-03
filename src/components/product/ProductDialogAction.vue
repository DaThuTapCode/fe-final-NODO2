<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits, inject } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  type: string;
  visible: boolean;
  titleDialog: string;
  product: any;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'close'): void;
}>();

// Tạo một biến ref để giữ giá trị của visible
const isVisible = ref(props.visible);

// Đồng bộ hóa giữa props và isVisible
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal;
});

// Inject hàm deleteProduct từ component cha
const deleteProduct = inject<(id: number) => Promise<void>>('deleteProduct');

const handleClose = () => {
  isVisible.value = false; 
  emit('close');
};

//Bắt sự kiện xóa
const handleAction = () => {
  if (props.type === 'delete') {
    if (deleteProduct) {
      deleteProduct(props.product.id);
    }
  }
  handleClose;
}
</script>

<template>
  <el-dialog v-model="isVisible" width="500" @close="handleClose">
    <div>
      <el-alert :closable="false" :title="t('deleteProduct')" type="warning"
        :description="t('doYouWantDeleteProduct', {productName: props.product.name})" show-icon />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="handleAction">
          {{ t('confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>