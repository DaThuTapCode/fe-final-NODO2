<template>
  <h1 style="text-align: center;" v-if="viewMode === 'create'">Thêm sản phẩm mới
  </h1>
  <el-row :gutter="20">
    <el-col :span="16">
      <el-form ref="formProductRef" :rules="rules" :model="dataProduct" label-width="auto">

        <el-form-item prop="productCode" label="Mã sản phẩm">
          <el-input :disabled="viewMode === 'view'" v-model="dataProduct.productCode" />
        </el-form-item>

        <el-form-item prop="name" label="Tên sản phẩm">
          <el-input :disabled="viewMode === 'view'" v-model="dataProduct.name" />
        </el-form-item>

        <el-form-item prop="description" label="Mô tả">
          <el-input type="textarea" v-model="dataProduct.description" :disabled="viewMode === 'view'" />
        </el-form-item>

        <el-form-item label="Danh mục">
          <el-select v-model="categoriesIsSelected" multiple placeholder="Select" style="width: 240px">
            <el-option :disabled="viewMode === 'view'" v-for="item in dataProduct.categories" :key="item.id"
              :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>

        <el-form-item prop="price" label="Giá">
          <el-input type="number" :disabled="viewMode === 'view'" v-model="dataProduct.price" />
        </el-form-item>

        <el-form-item prop="quantity" label="Số lượng">
          <el-input type="number" :disabled="viewMode === 'view'" v-model="dataProduct.quantity" />
        </el-form-item>

        <el-form-item v-if="viewMode === 'view'" label="Người sửa cuối">
          <el-input :disabled="viewMode === 'view'" v-model="dataProduct.modifiedBy" />
        </el-form-item>

        <el-form-item v-if="viewMode === 'view'" label="Ngày sửa cuối">
          <el-input :disabled="viewMode === 'view'" v-model="dataProduct.modifiedDate" />
        </el-form-item>

        <el-form-item v-if="viewMode === 'view'" label="Người tạo">
          <el-input :disabled="viewMode === 'view'" v-model="dataProduct.createdBy" />
        </el-form-item>

        <el-form-item v-if="viewMode === 'view'" label="Ngày tạo">
          <el-input :disabled="viewMode === 'view'" v-model="dataProduct.createdDate" />
        </el-form-item>

        <el-form-item style="float: right;">
          <el-button type="primary" @click="onSubmit">Create</el-button>
        </el-form-item>

      </el-form>
    </el-col>

    <el-col :span="8">
      <!-- Ảnh -->
      <div style="display: flex; justify-content: center;">
        <img :src="previewImage"
          style="max-width: 100%; height: 150px; min-width: 60%; border-radius: 5px; border: solid 1px lightgray; padding: 5px;" />
      </div>
      <!-- Nút chọn ảnh -->
      <div style="display: flex; justify-content: center; padding: 10px"
        v-if="viewMode === 'update' || viewMode === 'create'">
        <el-form-item prop="fileImg">
          <el-upload class="upload-demo" v-model="fileIsSelected" action="#" :show-file-list="false"
            :auto-upload="false" :before-upload="handleBeforeUpload" :on-change="handleFileChange" ref="uploadRef">
            <el-button type="primary">Chọn ảnh</el-button>
          </el-upload>
          <!-- Nút xóa ảnh nếu đã chọn -->
          <el-button style="align-items: normal;" @click="handleDeleteFileSelected"
            :disabled="!fileIsSelected">X</el-button>
        </el-form-item>
      </div>
    </el-col>
  </el-row>

</template>

<script lang="ts" setup>
import { NotificationUtil } from '@/util/Notification';
import { reactive, defineProps, ref, watch, onMounted, inject } from 'vue'


/// Xử lý ảnh 
const previewImage = ref<any>(); // Lưu trữ hình ảnh xem trước
const fileIsSelected = ref<File | null>(null); // Lưu trữ file đã chọn

// Hàm xử lý thay đổi file
const handleFileChange = (file: any) => {
  console.log('file da chon: ', file)
  if (file) {
    previewImage.value = URL.createObjectURL(file.raw); // Tạo URL xem trước cho file đã chọn
    fileIsSelected.value = file;
    dataProduct.value.fileImg = file.raw;
    console.log(previewImage.value)
  } else {
    previewImage.value = null; // Đặt lại nếu không có file
  }
};

//
const rules = {
  productCode: [
    { required: true, message: 'Vui lòng nhập mã sản phẩm', trigger: 'blur' },
    { min: 10, max: 10, message: 'Mã sản phẩm phải chính xác 10 ký tự', trigger: 'change' }
  ],
  name: [
    { required: true, message: 'Vui lòng nhập tên sản phẩm', trigger: 'blur' },
    { min: 3, max: 255, message: 'Tên sản phẩm từ 3 - 255 ký tự', trigger: 'change' }
  ],
  description: [
    { required: true, message: 'Vui lòng nhập mô tả sản phẩm', trigger: 'blur' },
    { min: 3, max: 255, message: 'Mô tả sản phẩm từ 3 - 255 ký tự', trigger: 'change' }
  ],
  price: [
    { required: true, message: 'Vui lòng nhập giá sản phẩm', trigger: 'blur' },
    {
      validator: (rule: any, value: number, callback: any) => {
        const numericValue = Number(value); // Chuyển đổi thành số

        if (!Number.isInteger(numericValue) || numericValue <= 0) {
          callback(new Error('Giá sản phẩm phải là số nguyên lớn hơn 0'));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change']
    }
  ],
  quantity: [
    { required: true, message: 'Vui lòng nhập số lượng', trigger: 'blur' },
    {
      validator: (rule: any, value: number, callback: any) => {
        const numericValue = Number(value); // Chuyển đổi thành số

        if (!Number.isInteger(numericValue) || numericValue <= 0) {
          callback(new Error('Số lượng phải là số nguyên lớn hơn 0' + value));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change']
    }
  ]
};


// Hàm xử lý xóa file đã chọn
const handleDeleteFileSelected = () => {
  previewImage.value = null; // Đặt lại hình ảnh xem trước
  fileIsSelected.value = null; // Đặt lại file đã chọn
};

// Hàm kiểm tra file trước khi tải lên
const handleBeforeUpload = (file: File) => {
  // Kiểm tra kiểu file hoặc kích thước nếu cần
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    NotificationUtil.openMessageError('Bạn chỉ có thể tải lên hình ảnh!');
  }
  return isImage; // Trả về true nếu hợp lệ
};

const createProduct = inject<(data: FormData) => Promise<void>>('createProduct');

const createPr = (data: FormData) => {
  if (createProduct) {
    createProduct(data);
  }
}



//props
const props = defineProps<{
  dataProduct: any,
  viewMode: 'update' | 'create' | 'view',
}>();
const dataProduct = ref(props.dataProduct);
watch(() => props.dataProduct, (newVal) => {
  dataProduct.value = newVal;
  categoriesIsSelected.value = newVal.categories.map((category: any) => category.name);
});


onMounted(() => {
  // categoriesIsSelected.value = dataProduct.value.categories.map((category: any) => category.name);
})

const formProductRef = ref();

const onSubmit = () => {
  formProductRef.value?.validate((valid: boolean) => {
    if (valid) {
      const formData = new FormData
      formData.append('productCode', dataProduct.value.productCode);
      formData.append('name', dataProduct.value.name);
      formData.append('price', dataProduct.value.price);
      formData.append('quantity', dataProduct.value.quantity);
      formData.append('description', dataProduct.value.quantity);
      if (fileIsSelected.value) {
        formData.append('imgFile', dataProduct.value.fileImg);

      }
      // formData.append('categoryIds', dataProduct.value.categoryIds);
      console.log('data form create', dataProduct.value);
      createPr(formData);
    } else {
      console.log('Lỗi trong form thêm');
    }
  })

}
const categoriesIsSelected = ref([]);

</script>