<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits, inject } from 'vue';
import ProductForm from './ProductForm.vue';
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



//Bắt sự kiện xóa
const handleAction = () => {
  if(props.type === 'delete') {
    if(deleteProduct){
      deleteProduct(props.product.id);
    }
  }else if (props.type === 'update') {
    // 
  }else if (props.type === 'view'){
    // 
   
  }
  handleClose;
}

const handleClose = () => {
  isVisible.value = false; // Cập nhật biến local
  // emit('update:visible', false); // Thông báo về component cha
  emit('close');
};
</script>

<template>
  <el-dialog
    v-model="isVisible"
    :title="titleDialog"
    width="1500"
    @close="handleClose"
  >
  <hr>
    <div v-if="props.type === 'view'"> 
        <ProductForm :view-mode="props.type" :dataProduct="product"/>
    </div>
    <span v-else-if="props.type === 'update'">This is an update</span>
    <div v-else>
       <el-alert title="Xóa sản phẩm" type="warning" :description="`Bạn có chắc muốn xóa ${props.product.name} ?`"
      show-icon />
    </div>
    <template v-if="props.type === 'delete'" #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleAction">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
