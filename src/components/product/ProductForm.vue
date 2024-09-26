<script lang="ts" setup>
import { CategoryService } from '@/services/admin/category/CategoryService';
import { PaginationObject } from '@/type/util/PaginationObject';
import { NotificationUtil } from '@/util/Notification';
import { reactive, defineProps, ref, watch, onMounted, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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


    // Kiểm tra kích thước file
    if (selectedFile.size > maxSize) {
      console.error('Kích thước file quá lớn');
      alert('Kích thước file không được vượt quá 2MB');
      return;
    }

    if (!allowedFormats.includes(selectedFile.type)) {
      console.error('Định dạng file không hợp lệ');
      NotificationUtil.openMessageError(t('error'), t('upLoadImage'));
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
    { min: 3, max: 255, message: t('nameLength3to255'), trigger: 'change' }
  ],
  description: [
    { required: true, message: t('descriptionRequired'), trigger: 'blur' },
    { min: 3, max: 255, message: t('descriptionLength3to255'), trigger: 'change' }
  ],
  category: [
    { required: true, message: t('descriptionRequired'), trigger: 'blur' },

  ],
  price: [
    { required: true, message: t('priceRequired'), trigger: 'blur' },
    {
      validator: (rule: any, value: number, callback: any) => {
        const numericValue = Number(value); // Chuyển đổi thành số

        if (!Number.isInteger(numericValue) || numericValue <= 0) {
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

const createProduct = inject<(data: FormData) => Promise<void>>('createProduct');
const updateProduct = inject<(data: FormData) => Promise<void>>('updateProduct');


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

//props
const props = defineProps<{
  dataProduct: any,
  viewMode: 'update' | 'create' | 'view',
}>();
const dataProduct = ref(props.dataProduct);
// watch(() => props.dataProduct, (newVal) => {
//   dataProduct.value = newVal;
//   categoriesIsSelected.value = newVal.categories.map((category: any) => category.id);
// });


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


const formProductRef = ref();

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
const categoriesIsSelected = ref([]);

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
  <!-- <p style="text-align: center;" v-if="viewMode === 'create'">{{ t('createNewProduct') }}
  </p> -->
  <div class="container-form">
    <div class="form-zone">
      <el-form v-if="dataProduct" label-position="top" ref="formProductRef" :rules="rules" :model="dataProduct"
        label-width="auto">
        <el-row :gutter="20">
          <el-col :span="3" style="background-color: transparent">

          </el-col>
          <el-col :span="7" style="background-color: white; padding: 30px;">
            <div>
              <!-- Ảnh -->
              <div style="display: flex; justify-content: center;">
                <img class="image-view" v-if="viewMode === 'create'" :src="getImageCreate()" />

                <img class="image-view" v-else-if="viewMode === 'view'" :src="dataProduct.img" />

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
            </div>
            <div class="zone-info">
              <p class="if" style="text-align: center;"> <el-tag type="success">{{ t('ACTIVE') }}</el-tag></p>
              <p class="if">{{ t('code') }}: {{ dataProduct.productCode }}</p>
              <p class="if">{{ t('name') }}: {{ dataProduct.name }}</p>
              <p class="if">{{ t('description') }}: {{ dataProduct.description }}</p>
              <!-- <p class="if"> {{ t('category') }}: {{ categoriesIsSelected?.join(', ') }} </p> -->
              <p class="if">{{ t('price') }}: {{ dataProduct.price }}</p>
              <p class="if">{{ t('quantity') }}: {{ dataProduct.quantity }}</p>
            </div>
          </el-col>
          <el-col :span="1" style="background-color: transparent">

          </el-col>

          <el-col :span="10" style="background-color: white; padding: 50px;">

            <el-row>
              <el-col :span="11">
                <el-form-item prop="productCode" :label="t('code')">
                  <el-input size="small" maxlength="10" show-word-limit
                    :disabled="viewMode === 'view' || viewMode === 'update'" v-model="dataProduct.productCode" />
                </el-form-item>
              </el-col>
              <el-col :span="1">

              </el-col>
              <el-col :span="11">
                <el-form-item prop="name" :label="t('name')">
                  <el-input size="small" maxlength="255" show-word-limit :disabled="viewMode === 'view'"
                    v-model="dataProduct.name" />
                </el-form-item>

              </el-col>
            </el-row>


            <el-form-item prop="description" :label="t('description')">
              <el-input size="small" maxlength="255" show-word-limit type="textarea" v-model="dataProduct.description"
                :disabled="viewMode === 'view'" />
            </el-form-item>

            <!-- Danh mục -->
            <el-form-item v-if="viewMode === 'update' || viewMode === 'view'" :label="t('category')">
              <el-select size="small" v-model="categoriesIsSelected" multiple placeholder="Select" style="width: 240px">
                <el-option :disabled="viewMode === 'view'" v-for="item in categories" :key="item.id" :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item v-else :label="t('category')">
              <el-select size="small" v-model="categoriesIsSelected" multiple placeholder="Select" style="width: 240px">
                <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>

            <el-row>
              <el-col :span="10">
                <el-form-item prop="price" :label="t('price')">
                  <el-input size="small" type="number" :disabled="viewMode === 'view'" v-model="dataProduct.price" />
                </el-form-item>
              </el-col>
              <el-col :span="4">

              </el-col>
              <el-col :span="10">
                <el-form-item prop="quantity" :label="t('quantity')">
                  <el-input size="small" type="number" :disabled="viewMode === 'view'" v-model="dataProduct.quantity" />
                </el-form-item>
              </el-col>
            </el-row>


            <el-form-item v-if="viewMode === 'view'" :label="t('modifiedBy')">
              <el-input size="small" :disabled="viewMode === 'view'" v-model="dataProduct.modifiedBy" />
            </el-form-item>

            <el-form-item v-if="viewMode === 'view'" :label="t('modifiedDate')">
              <el-input size="small" :disabled="viewMode === 'view'" v-model="dataProduct.modifiedDate" />
            </el-form-item>

            <el-form-item v-if="viewMode === 'view'" :label="t('createdBy')">
              <el-input size="small" :disabled="viewMode === 'view'" v-model="dataProduct.createdBy" />
            </el-form-item>

            <el-form-item v-if="viewMode === 'view'" :label="t('createdDate')">
              <el-input size="small" :disabled="viewMode === 'view'" v-model="dataProduct.createdDate" />
            </el-form-item>

            <el-form-item style="float: right;">
              <router-link style="margin-right: 10px;" :to="{ name: 'ListProduct' }">
                <el-button type="info">{{ t('back') }}</el-button>
              </router-link>
              <el-button type="primary" @click="onSubmit" v-if="viewMode === 'create'">{{ t('create') }}</el-button>
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
  width: 100px; /* Kích thước cố định cho chiều rộng */
  height: 100px; /* Kích thước cố định cho chiều cao */
  margin: 30px;
  cursor: pointer;
}


.zone-info p {
  font-size: small;
}
</style>
