<script lang="ts" setup>
import { NotificationUtil } from '@/util/Notification';
import { ref, defineProps, defineEmits, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n';
import { Edit } from '@element-plus/icons-vue'
const { t } = useI18n();
const props = defineProps<{
    viewMode: string;
    data: any;
}>();

const previewImage = ref<any>(); // Lưu trữ hình ảnh xem trước
const fileIsSelected = ref<File | null>(null); // Lưu trữ file đã chọn

// Hàm xử lý thay đổi file
const handleFileChange = (file: any) => {
    const maxSize = 2 * 1024 * 1024; // Giới hạn kích thước 2MB
    const allowedFormats = ['image/jpeg', 'image/png']; // Định dạng cho phép

    if (file) {
        const selectedFile = file.raw;

        // Kiểm tra kích thước file
        if (selectedFile.size > maxSize) {
            console.error('Kích thước file quá lớn');
            alert('Kích thước file không được vượt quá 2MB');
            return;
        }

        // Kiểm tra định dạng file
        if (!allowedFormats.includes(selectedFile.type)) {
            console.error('Định dạng file không hợp lệ');
            NotificationUtil.openMessageError(t('error'), t('upLoadImage'));
            return;
        }

        // Nếu kiểm tra thành công, xử lý file
        previewImage.value = URL.createObjectURL(selectedFile); // Tạo URL xem trước
        fileIsSelected.value = selectedFile;
        console.log('File đã chọn:', previewImage.value);
    } else {
        fileIsSelected.value = null;
        previewImage.value = null; // Xóa xem trước nếu không có file
    }
};

onMounted(() => {
    previewImage.value = null; 
})

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
        NotificationUtil.openMessageError(t('error'), t('uploadImage'));
    }
    return isImage; // Trả về true nếu hợp lệ
};

const rules = computed(() => ({
    categoryCode: [
        { required: true, message: t('codeRequired'), trigger: 'change' },
        { min: 10, max: 10, message: t('codeLengthIs10'), trigger: 'change' },
        {
            pattern: /^[a-zA-Z0-9]+$/, message: t('codeNumbersOnly'), trigger: 'change'
        }
    ],
    name: [
        { required: true, message: t('nameRequired'), trigger: 'change' },
        { min: 3, max: 255, message: t('nameLength3to255'), trigger: 'change' }
    ],
    description: [
        { required: true, message: t('descriptionRequired'), trigger: 'change' },
        { min: 3, max: 255, message: t('descriptionLength3to255'), trigger: 'change' }
    ]
}));

const emit = defineEmits<{
    (e: 'createCategory', value: FormData): void,
    (e: 'backTabOne'): void,
    (e: 'updateCategory', value: any): void
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
            if (fileIsSelected.value !== null) {
                formData.append('imgFile', fileIsSelected.value);
            }

            formData.append('description', dataC.value.description);
            emit('createCategory', formData);
            console.log('Dữ liệu:', dataC.value);
        } else {
            console.log('Lỗi trong form thêm');
        }
    });
};

// Bắt sự kiện nút update;
const handleSubmitUpdate = () => {
    formRef.value?.validate((valid: boolean) => {
        if (valid) {
            const formData = new FormData;
            formData.append('categoryCode', dataC.value.categoryCode);
            formData.append('name', dataC.value.name);
            if (fileIsSelected.value !== null) {
                formData.append('imgFile', fileIsSelected.value);
            }
            formData.append('description', dataC.value.description);
            const dataee = {
                value: formData,
                id: dataC.value.id
            }
            emit('updateCategory', dataee);
        } else {
            console.log('Lỗi trong form update');
        }
    });
}

const getImageU = (img: any) => {
    if(previewImage.value !== null && previewImage.value !== undefined){
        return previewImage.value;
    }else if(img !== null) {
        return img;
    }else {
        return '/noimage.png';
    }
}
const handleBackTabOne =() => {
    emit('backTabOne');
}
const dataC = ref(props.data);
</script>


<template>
    <el-form label-position="top" :model="dataC" label-width="auto" ref="formRef" :rules="rules">
        <el-row :gutter="20">
            <el-col :span="8" style=" background-color: white">
                <div>
                    <!-- Ảnh mode update | view-->
                    <div v-if="viewMode != 'create'" style="display: flex; justify-content: center; ">
                        <img :src="getImageU(dataC.img)" class="image-view" />
                    </div>

                    <!-- Ảnh mode tạo mới-->
                    <div v-else style="display: flex; justify-content: center; ">
                        <img v-if="previewImage" :src="previewImage" class="image-view" />
                        <img v-else src="/noimage.png" class="image-view" />
                    </div>

                    <!-- Nút chọn ảnh -->
                    <div style="display: flex; justify-content: center; padding: 10px"
                        v-if="viewMode === 'update' || viewMode === 'create'">
                        <el-form-item prop="fileImg">
                            <el-upload class="upload-demo" v-model="fileIsSelected" action="#" :show-file-list="false"
                                :auto-upload="false" :before-upload="handleBeforeUpload" :on-change="handleFileChange"
                                ref="uploadRef">
                                <el-button :icon="Edit">{{ t('selectImage') }}</el-button>
                            </el-upload>
                            <!-- Nút xóa ảnh nếu đã chọn -->
                            <el-button style="align-items: normal;" @click="handleDeleteFileSelected"
                                :disabled="!fileIsSelected">X</el-button>
                        </el-form-item>
                    </div>
                </div>
                <div class="zone-info">
                    <p class="if" style="text-align: center;"> <el-tag type="success">{{ t('ACTIVE') }}</el-tag></p>
                    <p class="if">{{ t('categoryCode') }}: {{ dataC.categoryCode }}</p>
                    <p class="if">{{ t('name') }}: {{ dataC.name }}</p>
                    <p class="if">{{ t('description') }}: {{ dataC.description }}</p>
                </div>
            </el-col>
            <el-col :span="0.5" style="background-color: none; padding: 20px;">

            </el-col>
            <el-col :span="14" style="background-color: white; padding: 20px;">

                <el-row>
                    <el-col :span="11">
                        <el-form-item prop="categoryCode" :label="t('categoryCode')">
                            <el-input size="small" maxlength="10" show-word-limit v-model="dataC.categoryCode" limit="10"
                                :disabled="viewMode === 'view' || viewMode === 'update'" />
                        </el-form-item>

                    </el-col>
                    <el-col :span="1">

                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="name" :label="t('name')">
                            <el-input size="small" maxlength="255" show-word-limit v-model="dataC.name"
                                :disabled="viewMode === 'view'" />
                        </el-form-item>
                    </el-col>
                </el-row>



                <el-form-item prop="description" :label="t('description')">
                    <el-input size="small" maxlength="255" show-word-limit type="textarea" v-model="dataC.description"
                        :disabled="viewMode === 'view'" />
                </el-form-item>

                <el-row>

                    <el-col :span="11">
                        <el-form-item v-if="viewMode === 'view'" :label="t('createdDate')">
                            <el-input size="small" v-model="dataC.createdDate" :disabled="viewMode === 'view'" />
                        </el-form-item>

                    </el-col>
                    <el-col :span="1">

                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="viewMode === 'view'" :label="t('modifiedDate')">
                            <el-input size="small" v-model="dataC.modifiedDate" :disabled="viewMode === 'view'" />
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>

                    <el-col :span="11">
                        <el-form-item v-if="viewMode === 'view'" :label="t('createdBy')">
                            <el-input size="small" v-model="dataC.createdBy" :disabled="viewMode === 'view'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">

                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="viewMode === 'view'" :label="t('modifiedBy')">
                            <el-input size="small" v-model="dataC.modifiedBy" :disabled="viewMode === 'view'" />
                        </el-form-item>
                    </el-col>

                </el-row>


                <!-- Nút mode update -->
                <div v-if="viewMode === 'update'" style="display: flex; justify-content: right;">
                    <el-button type="success" @click="handleSubmitUpdate">{{ t('update') }}</el-button>
                    <!-- <el-button type="info" @click="hand">Hủy</el-button> -->
                </div>
                <!-- Nút mode create -->
                <div v-if="viewMode === 'create'" style="display: flex; justify-content: right;">
                    <!-- <el-button  @click="handleSubmitCreate" type="info">{{ t('back') }}</el-button> -->
                    <el-button @click="handleSubmitCreate" type="primary">{{ t('save') }}</el-button>
                </div>
                <el-button style="float: right; margin-top: 5px" @click="handleBackTabOne" size="small" type="info">{{ t('back') }}</el-button>
            </el-col>
        </el-row>
    </el-form>
</template>
<style scoped>
.image-view {
  border-radius: 50%;
  border: solid 1px lightgray;
  width: 100px; /* Kích thước cố định cho chiều rộng */
  height: 100px; /* Kích thước cố định cho chiều cao */
  margin: 30px;
  cursor: pointer;
}

.zone-info p {
    font-size: x-small;
}
</style>