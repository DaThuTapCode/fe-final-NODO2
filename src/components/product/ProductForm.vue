<script lang="ts" setup>
import { CategoryService } from '@/services/admin/category/CategoryService';
import { PaginationObject } from '@/type/util/PaginationObject';
import { NotificationUtil } from '@/util/Notification';
import { defineProps, ref, onMounted, inject, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n';

//props
const props = defineProps<{
  dataProduct: any,
  viewMode: 'update' | 'create' | 'view',
}>();

const { t } = useI18n();

const formProductRef = ref();

const dataProduct = ref(props.dataProduct);

const categoriesIsSelected = ref([]);
// Inject
const createProduct = inject<(data: FormData) => Promise<void>>('createProduct');
const updateProduct = inject<(data: FormData) => Promise<void>>('updateProduct');

/// Xử lý ảnh 
const previewImage = ref<any>(null); // Lưu trữ hình ảnh xem trước
const fileIsSelected = ref<File | null>(null); // Lưu trữ file đã chọn
const urlImageU = ref<any>('');

// Hàm xử lý thay đổi file
const handleFileChange = (file: any) => {
  const maxSize = 2 * 1024 * 1024; // Giới hạn kích thước 2MB
  const allowedFormats = ['image/jpeg', 'image/png']; // Định dạng cho phép
  if (file) {
    const selectedFile = file.raw;

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



    previewImage.value = URL.createObjectURL(file.raw); // Tạo URL xem trước cho file đã chọn
    fileIsSelected.value = file;
    dataProduct.value.fileImg = file.raw;
    console.log(previewImage.value)
  } else {
    previewImage.value = null; // Đặt lại nếu không có file
  }
};


const rules = computed(() => ({
  productCode: [
    { required: true, message: t('codeRequired'), trigger: 'blur' },
    { min: 10, max: 10, message: t('codeLengthIs10'), trigger: 'change' },
    { pattern: /^[a-zA-Z0-9]+$/, message: t('codeNumbersOnly'), trigger: 'change' }
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
    { min: 3, max: 255, message: t('descriptionLength3to255'), trigger: 'change' },
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
  ],
  price: [
    { required: true, message: t('priceRequired'), trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        const numericValue = Number(value); // Chuyển đổi thành số

        if (isNaN(numericValue)) {
          callback(new Error(t('priceMustBeANumber')));
        } else if (numericValue <= 0 || !Number.isFinite(numericValue)) {
          callback(new Error(t('priceIsIntegerAndGreaterThan0')));
        } else if (Math.floor(numericValue) !== numericValue) {
          callback(new Error(t('priceIsIntegerAndGreaterThan0')));
        } else if (numericValue > 2000000000) {
          callback(new Error(t('priceIsIntegerAndLessThan2000000000')));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change']
    }
  ],

  quantity: [
    { required: true, message: t('quantityRequired'), trigger: 'blur' },
    {
      validator: (rule: any, value: number, callback: any) => {
        const numericValue = Number(value); // Chuyển đổi thành số
        if (!Number.isInteger(numericValue) || numericValue <= 0) {
          callback(new Error(t('quantityIsIntegerAndGreaterThan0')));
        } else if (numericValue > 2000000000) {
          callback(new Error(t('quantityIsIntegerAndLessThan2000000000')));
        }
        else {
          callback();
        }
      },
      trigger: ['blur', 'change']
    }
  ]
}));


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
    NotificationUtil.openMessageError(t('error'), 'Bạn chỉ có thể tải lên hình ảnh!');
  }
  return isImage; // Trả về true nếu hợp lệ
};




// Chứa dữ liệu phân trang
const pagination: PaginationObject = {
  page: 0,
  size: 1000000,
  sortBy: null,
  direction: null
};
const categoryService = new CategoryService();
const categories = ref<any>([]);

// Load dữ liệu danh sách category
const fetchCategories = async () => {
  try {
    const response = await categoryService.getPageCategory(pagination, '');
    categories.value = response.content;
  } catch (error) {
    console.error('Lỗi fetchCategories trong ProductTable', error);
  }
};

onMounted(() => {

  fetchCategories();
  // Kiểm tra nếu viewMode là 'update' hoặc 'view'
  if (props.viewMode === 'update' || props.viewMode === 'view') {

    // Kiểm tra nếu dataProduct.value.categories tồn tại
    if (dataProduct.value.categories) {

      // Kiểm tra xem categories có phải là chuỗi hay không
      if (typeof dataProduct.value.categories === 'string') {
        console.log(dataProduct.value.categories);
      } else {
        // Nếu categories không phải là chuỗi, giả định là mảng và map lấy category.name
        categoriesIsSelected.value = dataProduct.value.categories.map((category: any) => category.id);
      }

    }
  }
});




const createPr = (data: FormData) => {
  if (createProduct) {
    createProduct(data);
  }
}
const updatePr = (formData: FormData) => {
  if (updateProduct) {
    console.log('DATA UPDATE:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    updateProduct(formData);
  }
}
const onSubmit = () => {
  formProductRef.value?.validate((valid: boolean) => {
    if (valid) {
      const formData = new FormData
      formData.append('productCode', dataProduct.value.productCode);
      formData.append('name', dataProduct.value.name);
      formData.append('price', dataProduct.value.price);
      formData.append('quantity', dataProduct.value.quantity);
      formData.append('description', dataProduct.value.description);
      if (fileIsSelected.value) {
        formData.append('imgFile', dataProduct.value.fileImg);
      }
      categoriesIsSelected.value.forEach(categoryId => {
        formData.append('categoryIds', categoryId); // Thêm từng categoryId vào FormData
      });
      console.log('data form create', dataProduct.value);
      if (props.viewMode === 'create') {
        createPr(formData);
      } else {
        updatePr(formData);
      }

    } else {
      console.log('Lỗi trong form thêm');
    }
  })

}

const getImageUpdate = (img: any) => {
  if (previewImage.value !== null && previewImage.value !== undefined) {

    return previewImage.value;
  } else {
    if (img !== null && img !== undefined && img !== '') {
      return urlImageU.value = img;
    } else {
      return '/noimage.png'
    }
  }
}

const getImageCreate = () => {
  if (previewImage.value !== null) {
    return previewImage.value;
  } else {
    return '/noimage.png'
  }
}


</script>

<template>

  <div class="container-form">
    <div class="form-zone">
      <el-form v-if="dataProduct" label-position="top" ref="formProductRef" :rules="rules" :model="dataProduct"
        label-width="auto">
        <el-row :gutter="20">
          <el-col :span="1" style="background-color: transparent">

          </el-col>
          <el-col :xs="24" :sm="24" :md="8"
            style="background-color: white;   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
            <div>
              <!-- Ảnh -->
              <div style="display: flex; justify-content: center;">
                <img class="image-view" v-if="viewMode === 'create'" :src="getImageCreate()" />

                <img class="image-view" v-else-if="viewMode === 'view'" :src="getImageUpdate(dataProduct.img)" />

                <img class="image-view" v-else :src="getImageUpdate(dataProduct.img)" />
              </div>

              <!-- Nút chọn ảnh -->
              <div style="display: flex; justify-content: center; padding: 10px"
                v-if="viewMode === 'update' || viewMode === 'create'">
                <el-form-item prop="fileImg">
                  <el-upload class="upload-demo" v-model="fileIsSelected" action="#" :show-file-list="false"
                    :auto-upload="false" :before-upload="handleBeforeUpload" :on-change="handleFileChange"
                    ref="uploadRef">
                    <el-button size="small" type="primary">{{ t('selectImage') }}</el-button>
                  </el-upload>
                  <!-- Nút xóa ảnh nếu đã chọn -->
                  <el-button size="small" style="align-items: normal;" @click="handleDeleteFileSelected"
                    v-if="fileIsSelected !== null">X</el-button>
                </el-form-item>
              </div>
              <div class="zone-info">
                <p class="if" style="text-align: center;"> <el-tag type="success">{{ t('ACTIVE') }}</el-tag></p>

                <div class="info-item">
                  <p class="title">{{ t('code') }}:</p>
                  <p class="content"> {{ dataProduct.productCode }}</p>
                </div>

                <div class="info-item">
                  <p class="title">{{ t('name') }}:</p>
                  <p class="content">{{ dataProduct.name }}</p>
                </div>

                <div class="info-item">
                  <p class="title">{{ t('description') }}:</p>
                  <p class="content">{{ dataProduct.description }}</p>
                </div>

                <div class="info-item">
                  <p class="title">{{ t('price') }}:</p>
                  <p class="content">{{ dataProduct.price }}</p>
                </div>

                <div class="info-item">
                  <p class="title">{{ t('quantity') }}:</p>
                  <p class="content">{{ dataProduct.quantity }}</p>
                </div>

              </div>
            </div>

          </el-col>
          <el-col :span="1" style="background-color: transparent">

          </el-col>
          <el-col :xs="24" :sm="24" :md="12"
            style="background-color: white;   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);" class="view-zone">
            <h1 style="text-align: center; display: block" v-if="viewMode === 'create'">{{ t('createNewProduct') }}
            </h1>
            <h1 style="text-align: center; display: block" v-else-if="viewMode === 'update'">{{ t('updateProduct') }}
            </h1>
            <h1 style="text-align: center; display: block" v-else-if="viewMode === 'view'">{{ t('detailProduct') }}
            </h1>
            <el-row>
              <el-col :span="11">
                <el-form-item prop="productCode" :label="t('code')">
                  <el-input maxlength="10" show-word-limit :disabled="viewMode === 'view' || viewMode === 'update'"
                    v-model="dataProduct.productCode" />
                </el-form-item>
              </el-col>
              <el-col :span="1">

              </el-col>
              <el-col :span="12">
                <el-form-item prop="name" :label="t('name')">
                  <el-input maxlength="255" show-word-limit :disabled="viewMode === 'view'"
                    v-model="dataProduct.name" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item prop="description" :label="t('description')">
              <el-input maxlength="255" show-word-limit v-model="dataProduct.description"
                :disabled="viewMode === 'view'" />
            </el-form-item>

            <!-- Danh mục -->
            <el-form-item v-if="viewMode === 'update' || viewMode === 'view'" :label="t('category')">
              <el-select v-model="categoriesIsSelected" multiple placeholder="Select" style="width: 240px">
                <el-option :disabled="viewMode === 'view'" v-for="item in categories" :key="item.id" :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item v-else :label="t('category')">
              <el-select v-model="categoriesIsSelected" multiple placeholder="Select" style="width: 240px">
                <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>

            <el-row>
              <el-col :span="11">
                <el-form-item prop="price" :label="t('price')">
                  <el-input type="number" :disabled="viewMode === 'view'" v-model="dataProduct.price" />
                </el-form-item>
              </el-col>
              <el-col :span="1">

              </el-col>
              <el-col :span="12">
                <el-form-item prop="quantity" :label="t('quantity')">
                  <el-input type="number" :disabled="viewMode === 'view'" v-model="dataProduct.quantity" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="11">
                <el-form-item v-if="viewMode === 'view'" :label="t('modifiedBy')">
                  <el-input :disabled="viewMode === 'view'" v-model="dataProduct.modifiedBy" />
                </el-form-item>
              </el-col>
              <el-col :span="1">

              </el-col>
              <el-col :span="12">
                <el-form-item v-if="viewMode === 'view'" :label="t('modifiedDate')">
                  <el-input :disabled="viewMode === 'view'" v-model="dataProduct.modifiedDate" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="11">
                <el-form-item v-if="viewMode === 'view'" :label="t('createdBy')">
                  <el-input :disabled="viewMode === 'view'" v-model="dataProduct.createdBy" />
                </el-form-item>

              </el-col>
              <el-col :span="1">

              </el-col>
              <el-col :span="12">
                <el-form-item v-if="viewMode === 'view'" :label="t('createdDate')">
                  <el-input :disabled="viewMode === 'view'" v-model="dataProduct.createdDate" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item style="float: right;">
              <router-link style="margin-right: 10px;" :to="{ name: 'ListProduct' }">
                <el-button type="info">{{ t('back') }}</el-button>
              </router-link>
              <el-button type="primary" @click="onSubmit" v-if="viewMode === 'create'">{{ t('save') }}</el-button>
              <el-button type="primary" @click="onSubmit" v-if="viewMode === 'update'">{{ t('update') }}</el-button>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>

</template>

<style>
.container-form {
  display: flex;
  justify-content: center;
}

.form-zone {
  width: fit-content;
  height: fit-content;
  min-width: 100%;
  /* max-height: fit-content; */
}


.form-zone .image-view {
  border-radius: 50%;
  border: solid 1px lightgray;
  width: 130px;
  /* Kích thước cố định cho chiều rộng */
  height: 130px;
  /* Kích thước cố định cho chiều cao */
  margin: 30px;
  cursor: pointer;
}

.view-zone {
  background-color: white;
  /* border-radius: 10px; */
  padding: 40px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.zone-info {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  justify-content: flex-start;
  /* margin-bottom: 10px; */
}

.title {
  width: 150px;
  /* Điều chỉnh chiều rộng */
  text-align: right;
  /* Căn title sang lề phải */
  padding-right: 10px;
  /* Khoảng cách giữa title và content */
  font-weight: bold;
  font-size: small;
}

.content {
  flex-grow: 1;
  font-weight: 100;
  font-size: small;

  word-wrap: break-word;
  /* Tự động ngắt dòng khi nội dung quá dài */
  white-space: normal;
  /* Cho phép xuống dòng nếu cần */
  overflow-wrap: break-word;
  /* Thêm hỗ trợ cho trình duyệt khác */
}
</style>
