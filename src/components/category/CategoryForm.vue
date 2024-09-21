<template>
    <el-form :model="dataC" label-width="auto" ref="formRef" :rules="rules">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-form-item prop="categoryCode" label="Mã danh mục">
                    <el-input v-model="dataC.categoryCode" :disabled="viewMode === 'view' || viewMode === 'update'" />
                </el-form-item>

                <el-form-item prop="name" label="Tên">
                    <el-input v-model="dataC.name" :disabled="viewMode === 'view'" />
                </el-form-item>

                <el-form-item prop="description" label="Mô tả">
                    <el-input type="textarea" v-model="dataC.description" :disabled="viewMode === 'view'" />
                </el-form-item>

                <el-form-item v-if="viewMode === 'view'" label="Ngày tạo">
                    <el-input v-model="dataC.createdDate" :disabled="viewMode === 'view'" />
                </el-form-item>

                <el-form-item v-if="viewMode === 'view'" label="Ngày sửa cuối">
                    <el-input v-model="dataC.modifiedDate" :disabled="viewMode === 'view'" />
                </el-form-item>

                <el-form-item v-if="viewMode === 'view'" label="Người tạo">
                    <el-input v-model="dataC.createdBy" :disabled="viewMode === 'view'" />
                </el-form-item>

                <el-form-item v-if="viewMode === 'view'" label="Người sửa cuối">
                    <el-input v-model="dataC.modifiedBy" :disabled="viewMode === 'view'" />
                </el-form-item>

                <!-- Nút mode update -->
                <div v-if="viewMode === 'update'" style="display: flex; justify-content: right;">
                    <el-button type="success" @click="handleSubmitUpdate">Sửa</el-button>
                    <!-- <el-button type="info" @click="hand">Hủy</el-button> -->
                </div>

                <!-- Nút mode create -->
                <div v-if="viewMode === 'create'" style="display: flex; justify-content: right;">
                    <el-button @click="handleSubmitCreate" type="success">Thêm</el-button>
                </div>
            </el-col>
            <el-col :span="8">
                <!-- Ảnh -->
                <div style="display: flex; justify-content: center;">
                    <img
        :src="previewImage || dataC.img"
        style="max-width: 100%; height: 150px; min-width: 60%; border-radius: 5px; border: solid 1px lightgray; padding: 5px;"
      />
                </div>
                <!-- Nút chọn ảnh -->
                <div style="display: flex; justify-content: center; padding: 10px"
                    v-if="viewMode === 'update' || viewMode === 'create'">
                    <el-form-item prop="fileImg">
                        <el-upload class="upload-demo" 
                            v-model="fileIsSelected" 
                            action="#" 
                            :limit="1"
                            :show-file-list="true" 
                            :auto-upload="false" 
                            :before-upload="handleBeforeUpload"
                            :on-change="handleFileChange" 
                            ref="uploadRef">
                            <el-button type="primary">Chọn ảnh</el-button>
                        </el-upload>
                        <!-- Nút xóa ảnh nếu đã chọn -->
                        <el-button style="align-items: normal;" @click="handleDeleteFileSelected"
                            v-if="fileIsSelected">X</el-button>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script lang="ts" setup>
import { NotificationUtil } from '@/util/Notification';
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps<{
    viewMode: string;
    data: any;
}>();





const previewImage = ref<string | null>(null); // Lưu trữ hình ảnh xem trước
const fileIsSelected = ref<File | null>(null); // Lưu trữ file đã chọn

// Hàm xử lý thay đổi file
const handleFileChange = (fileList: any) => {
  if (fileList.length) {
    const file = fileList[0].raw; // Lấy file từ danh sách
    previewImage.value = URL.createObjectURL(file); // Tạo URL xem trước cho file đã chọn
  } else {
    previewImage.value = null; // Đặt lại nếu không có file
  }
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











const rules = {
    categoryCode: [
        { required: true, message: 'Vui lòng nhập mã danh mục', trigger: 'change' },
        { min: 10, max: 10, message: 'Mã phải chính xác 10 ký tự', trigger: 'change' }
    ],
    name: [
        { required: true, message: 'Vui lòng nhập tên', trigger: 'change' },
        { min: 3, max: 255, message: 'Tên từ 3 đến 255 ký tự', trigger: 'change' }
    ],
    description: [
        { required: true, message: 'Vui lòng nhập mô tả', trigger: 'change' },
        { min: 3, max: 255, message: 'Mô tả từ 3 đến 255 ký tự', trigger: 'change' }
    ]
};



const emit = defineEmits<{
    (e: 'createCategory', value: FormData): void,
    (e: 'updateCategory',value: any): void
}>();


const formRef = ref();  // Tham chiếu đến el-form

//Bắt sự kiện nút thêm mới
const handleSubmitCreate = () => {
    // Gọi validate form
    formRef.value?.validate((valid: boolean) => {
        if (valid) {
            const formData = new FormData;
            formData.append('categoryCode', dataC.value.categoryCode);
            formData.append('name', dataC.value.name);
            // formData.append('imgFile', dataC.value.img);
            formData.append('description', dataC.value.description);
            emit('createCategory', formData);
            console.log('Dữ liệu:', dataC.value);
        } else {
            console.log('Lỗi trong form thêm');
        }
    });
};

// Bắt sự kiện nút update;
const handleSubmitUpdate = () =>{
    formRef.value?.validate((valid: boolean) => {
        if(valid) {
            const formData = new FormData;
            formData.append('categoryCode', dataC.value.categoryCode);
            formData.append('name', dataC.value.name);
            // formData.append('imgFile', dataC.value.img);
            formData.append('description', dataC.value.description);
            const dataee = {
               value: formData,
               id: dataC.value.id
            }
            emit('updateCategory', dataee);
        }else {
            console.log('Lỗi trong form update');
        }
    });
}

const dataC = ref(props.data);

</script>