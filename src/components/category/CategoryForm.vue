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
const dataC = ref(props.data);
const previewImage = ref<any>(); // Lưu trữ hình ảnh xem trước
const fileIsSelected = ref<File | null>(null); // Lưu trữ file đã chọn

const emit = defineEmits<{
    (e: 'createCategory', value: FormData): void,
    (e: 'backTabOne'): void,
    (e: 'updateCategory', value: any): void
}>();

const formRef = ref();  // Tham chiếu đến el-form


// Hàm xử lý thay đổi file
const handleFileChange = (file: any) => {
    const maxSize = 2 * 1024 * 1024; // Giới hạn kích thước 2MB
    const allowedFormats = ['image/jpeg', 'image/png']; // Định dạng cho phép

    if (file) {
        const selectedFile = file.raw;

        // Kiểm tra định dạng file
        if (!allowedFormats.includes(selectedFile.type)) {
            console.error('Định dạng file không hợp lệ');
            NotificationUtil.openMessageError(t('error'), t('upLoadImage'));
            return;
        }

        // Kiểm tra kích thước file
        if (selectedFile.size > maxSize) {
            console.error('Kích thước file quá lớn');
            alert('Kích thước file không được vượt quá 2MB');
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
        { required: true, message: t('codeRequired'), trigger: 'blur' },
        { min: 10, max: 10, message: t('codeLengthIs10'), trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]+$/, message: t('codeNumbersOnly'), trigger: 'blur' },

    ],
    name: [
        { required: true, message: t('nameRequired'), trigger: 'blur' },
        { min: 3, max: 255, message: t('nameLength3to255'), trigger: 'change' },
        {
            validator: (rule: any, value: string, callback: any) => {
                const trimmedValue = value.trim();

                // Biểu thức chính quy để chỉ cho phép chữ cái, số và khoảng trắng
                const regex = /^[\p{L}\p{N}\s]*$/u;

                if (trimmedValue.length < 3 || trimmedValue.length > 255) {
                    callback(new Error(t('nameLength3to255')));
                } else if (!regex.test(trimmedValue)) {
                    callback(new Error(t('nameNoSpecialCharacters')));
                } else {
                    callback();
                }
            },
            trigger: ['blur', 'change']
        }
    ],

    description: [
        { required: true, message: t('descriptionRequired'), trigger: 'blur' },
        { min: 3, max: 255, message: t('descriptionLength3to255'), trigger: 'blur' },
        {
            validator: (rule: any, value: string, callback: any) => {

                if (value.trim().length < 3) {
                    callback(new Error(t('descriptionLength3to255')));
                } else {
                    callback();
                }
            },
            trigger: ['blur', 'change']
        }
    ]
}));


//Bắt sự kiện nút thêm mới
const handleSubmitCreate = () => {
    // Gọi validate form
    formRef.value?.validate((valid: boolean) => {
        if (valid) {
            const formData = new FormData;
            formData.append('categoryCode', dataC.value.categoryCode.trim());
            formData.append('name', dataC.value.name.trim());
            if (fileIsSelected.value !== null) {
                formData.append('imgFile', fileIsSelected.value);
            }

            formData.append('description', dataC.value.description.trim());
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
    if (previewImage.value !== null && previewImage.value !== undefined) {
        return previewImage.value;
    } else if (img !== null) {
        return img;
    } else {
        return '/noimage.png';
    }
}
const handleBackTabOne = () => {
    emit('backTabOne');
}


onMounted(() => {
    previewImage.value = null;
})
</script>


<template>
    <el-form class="form-zone" label-position="top" :model="dataC" label-width="auto" ref="formRef" :rules="rules">
        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="2" style="background-color: white">

            </el-col>
            <el-col :xs="24" :sm="24" :md="8" style="background-color: white;   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
                <div>
                    <!-- Ảnh mode update | view-->
                    <div v-if="viewMode != 'create'" class="image-container">
                        <img :src="getImageU(dataC.img)" class="image-view" />
                    </div>

                    <!-- Ảnh mode tạo mới-->
                    <div v-else class="image-container">
                        <img v-if="previewImage" :src="previewImage" class="image-view" />
                        <img v-else src="/noimage.png" class="image-view" />
                    </div>

                    <!-- Nút chọn ảnh -->
                    <div class="button-container" v-if="viewMode === 'update' || viewMode === 'create'">
                        <el-form-item prop="fileImg">
                            <el-upload class="upload-demo" v-model="fileIsSelected" action="#" :show-file-list="false"
                                :auto-upload="false" :before-upload="handleBeforeUpload" :on-change="handleFileChange"
                                ref="uploadRef">
                                <el-button :icon="Edit">{{ t('selectImage') }}</el-button>
                            </el-upload>
                            <!-- Nút xóa ảnh nếu đã chọn -->
                            <el-button @click="handleDeleteFileSelected" :disabled="!fileIsSelected">X</el-button>
                        </el-form-item>
                    </div>
                    <p style="text-align: center; margin: 0"><el-tag type="success">{{ t('ACTIVE') }}</el-tag></p>

                    <div class="zone-info">
                        <div class="info-item">
                            <p class="title">{{ t('categoryCode') }}:</p>
                            <p class="content">{{ dataC.categoryCode }}</p>
                        </div>
                        <div class="info-item">
                            <p class="title">{{ t('name') }}:</p>
                            <p class="content">{{ dataC.name }}</p>
                        </div>
                        <div class="info-item">
                            <p class="title">{{ t('description') }}:</p>
                            <p class="content">{{ dataC.description }}</p>
                        </div>
                    </div>

                </div>

            </el-col>

            <el-col :xs="24" :sm="24" :md="10" style="background-color: white; margin-left: 10px; box-shadow: 2px 2px 12px 2px rgba(0, 0, 0, 0.1);
 padding: 20px; display: block; align-content: center;">
                <h5 style="text-align: center;" v-if="viewMode === 'create'">{{ t('createNewCategory') }}</h5>
                <h5 style="text-align: center;" v-if="viewMode === 'update'">{{ t('updateCategory') }}</h5>
                <h5 style="text-align: center;" v-if="viewMode === 'view'">{{ t('detailCategory') }}</h5>
                <el-row :gutter="10">
                    <el-col :span="11">
                        <el-form-item prop="categoryCode" :label="t('categoryCode')">
                            <el-input maxlength="10" show-word-limit v-model="dataC.categoryCode"
                                :disabled="viewMode === 'view' || viewMode === 'update'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="1"></el-col>
                    <el-col :span="12">
                        <el-form-item prop="name" :label="t('name')">
                            <el-input maxlength="255" show-word-limit v-model="dataC.name"
                                :disabled="viewMode === 'view'" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item prop="description" :label="t('description')">
                    <el-input maxlength="255" show-word-limit v-model="dataC.description"
                        :disabled="viewMode === 'view'" />
                </el-form-item>

                <el-row :gutter="10">
                    <el-col :span="12" v-if="viewMode === 'view'">
                        <el-form-item :label="t('createdDate')">
                            <el-input v-model="dataC.createdDate" :disabled="viewMode === 'view'" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="viewMode === 'view'">
                        <el-form-item :label="t('modifiedDate')">
                            <el-input v-model="dataC.modifiedDate" :disabled="viewMode === 'view'" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- Nút mode update -->
                <div v-if="viewMode === 'update'" class="button-container">
                    <el-button type="success" @click="handleSubmitUpdate">{{ t('update') }}</el-button>
                </div>
                <!-- Nút mode create -->
                <div v-if="viewMode === 'create'" class="button-container">
                    <el-button @click="handleSubmitCreate" type="primary">{{ t('save') }}</el-button>
                </div>
                <el-button class="button-back" @click="handleBackTabOne" size="small" type="info">{{ t('back')
                    }}</el-button>
            </el-col>
        </el-row>
    </el-form>
</template>

<style scoped>
.image-view {
    border-radius: 50%;
    border: solid 1px lightgray;
    width: 100px;
    height: 100px;
    margin: 30px;
    cursor: pointer;
}

.image-container {
    display: flex;
    justify-content: center;
}

.button-container {
    display: flex;
    justify-content: center;
    padding: 10px;
}


.form-zone {
    border-radius: 10px;
}

.button-back {
    float: right;
    margin-top: 5px;
}

.zone-info {
    display: flex;
    flex-direction: column;
}

.info-item {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
}

.title {
    width: 150px;
    /* Điều chỉnh chiều rộng */
    text-align: right;
    /* Căn title sang lề phải */
    padding-right: 10px;
    /* Khoảng cách giữa title và content */
    font-weight: bold;
}

.content {
    flex-grow: 1;
    font-weight: 100;
    word-wrap: break-word;
    /* Tự động ngắt dòng khi nội dung quá dài */
    white-space: normal;
    /* Cho phép xuống dòng nếu cần */
    overflow-wrap: break-word;
    /* Thêm hỗ trợ cho trình duyệt khác */
}


@media (max-width: 768px) {
    .button-back {
        width: 100%;
        text-align: center;
    }
}
</style>
