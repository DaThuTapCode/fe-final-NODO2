<template>
    <el-form :model="paramSearch">
        <div class="search-form">
            <span style="font-size: larger; font-weight: bold; color: green;">Bộ lọc</span>
            <hr>
            <el-row :gutter="20">
                <el-col :span="3">
                    <span>Tên</span>
                    <el-form-item>
                        <el-input v-model="paramSearch.name" placeholder="Nhập tên cần tìm" />
                    </el-form-item>
                </el-col>

                <el-col :span="3">
                    <span>Mã</span>
                    <el-form-item>
                        <el-input v-model="paramSearch.productCode" placeholder="Nhập mã cần tìm" />
                    </el-form-item>
                </el-col>

                <el-col :span="3">
                    <span>Ngày bắt đầu</span>
                    <el-form-item>
                        <el-date-picker format="DD-MM-YYYY" value-format="DD-MM-YYYY" v-model="paramSearch.startDate"
                            type="date" placeholder="Chọn ngày bắt đầu" />
                    </el-form-item>
                </el-col>

                <el-col :span="3">
                    <span>Ngày kết thúc</span>
                    <el-form-item>
                        <el-date-picker format="DD-MM-YYYY" value-format="DD-MM-YYYY" v-model="paramSearch.endDate"
                            type="date" placeholder="Chọn ngày kết thúc" />
                    </el-form-item>
                </el-col>

                <el-col :span="3">
                    <span>Loại sản phẩm</span>
                    <el-select v-model="paramSearch.categoryID" placeholder="Chọn danh mục" filterable>
                        <el-option v-for="category in categories" :key="category.id" :label="category.name"
                            :value="category.id">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :span="3">
                    <el-form-item>
                        <div>
                            <el-button type="success" :icon="Search" round @click="handleSearch">
                                Tìm kiếm
                            </el-button>
                            <el-button type="info"
                                v-if="paramSearch.name || paramSearch.productCode || paramSearch.categoryID"
                                :icon="Close" size="small" @click="handleReset">
                                Hủy lọc
                            </el-button>
                        </div>
                    </el-form-item>
                </el-col>

                <el-col :span="3">
                    <el-form-item>
                        <div>
                            <el-dropdown>
                                <el-button :icon="Document" type="primary">
                                    Xuất excel<el-icon class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handleExportExcelAll" :icon="Document">Xuất toàn
                                            bộ</el-dropdown-item>
                                        <el-dropdown-item @click="handleExportExcelBySearch">Xuất theo tìm
                                            kiếm</el-dropdown-item>

                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
import { ref, defineEmits, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, Close, Document } from '@element-plus/icons-vue';
import { CategoryService } from '@/services/admin/category/CategoryService';
import { CategoryResponse } from '@/type/category/response/CategoryResponse';
import { PaginationObject } from '@/type/util/PaginationObject';
import { dayjs } from 'element-plus';
import { NotificationUtil } from '@/util/Notification';

const categories = ref<CategoryResponse[]>([]); // Hứng dữ liệu danh sách category
const categoryService = new CategoryService();

// Variable
const paramSearch = reactive({
    productCode: '',
    name: '',
    startDate: '',
    endDate: '',
    categoryID: ''
});

// Chứa dữ liệu phân trang
const pagination: PaginationObject = {
    page: 0,
    size: 1000000,
    sortBy: null,
    direction: null
};


// Router và Route
const route = useRoute();
const router = useRouter();

// Theo dõi query params từ route để cập nhật paramSearch
// Cập nhật paramSearch từ query params
watch(
    () => route.query,
    (newQuery) => {
        // Chỉ gán giá trị cho paramSearch nếu không rỗng và không phải là null
        if (newQuery.startDate && typeof newQuery.startDate === 'string') {
            paramSearch.startDate = newQuery.startDate;
        } 
        if (newQuery.endDate && typeof newQuery.endDate === 'string') {
            paramSearch.endDate = newQuery.endDate;
        }
        if (newQuery.name && typeof newQuery.name === 'string') {
            paramSearch.name = newQuery.name;
        } 
        if (newQuery.productCode && typeof newQuery.productCode === 'string') {
            paramSearch.productCode = newQuery.productCode;
        } 
        if (newQuery.categoryID && typeof newQuery.categoryID === 'string') {
            paramSearch.categoryID = newQuery.categoryID;
        } 
    },
    { immediate: true }
);



// Sự kiện tìm kiếm, đẩy tham số tìm kiếm lên route
const handleSearch = () => {
    // Kiểm tra xem startDate có trước endDate không
    const startDateParsed = dayjs(paramSearch.startDate, 'DD-MM-YYYY');
    const endDateParsed = dayjs(paramSearch.endDate, 'DD-MM-YYYY');

    if (startDateParsed.isAfter(endDateParsed)) {
        NotificationUtil.openMessageError('Ngày bắt đầu phải trước ngày kết thúc');
        return; // Ngừng thực hiện nếu kiểm tra không thành công
    }

    // Tạo đối tượng query params
    const queryParams = {
        name: paramSearch.name || undefined,
        productCode: paramSearch.productCode || undefined,
        startDate: paramSearch.startDate ? startDateParsed.format('DD-MM-YYYY') : undefined,
        endDate: paramSearch.endDate ? endDateParsed.format('DD-MM-YYYY') : undefined,
        categoryID: paramSearch.categoryID || undefined
    };

    // Lọc bỏ các tham số không có giá trị
    const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v !== undefined)
    );
    // Chuyển đối tượng `filteredParams` thành chuỗi query
    const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();
    // Đẩy tham số tìm kiếm lên route
    router.push({
        path: '/admin/product/list',
        query: filteredParams
    });

    console.log('ehe', queryString);
    emit('search', queryString);
};


// Hủy lọc
const handleReset = () => {
    paramSearch.name = '';
    paramSearch.productCode = '';
    paramSearch.startDate = '';
    paramSearch.endDate = '';
    paramSearch.categoryID = '';
    handleSearch(); // Đẩy route với query rỗng
};

// Sự kiện xuất excel
const handleExportExcelAll = () => {
    // Xử lý xuất Excel
    alert('Xuất all');
};
const handleExportExcelBySearch = () => {
    // Xử lý xuất Excel
    alert('Xuất search');
};

// Load dữ liệu danh sách category
const fetchCategories = async () => {
    try {
        const response = await categoryService.getPageCategory(pagination);
        categories.value = response.content;
    } catch (error) {
        console.error('Lỗi fetchCategories trong ProductTable', error);
    }
};
//Emit
const emit = defineEmits<{
    (e: 'search', value: any): void
}>();
onMounted(() => {
    fetchCategories();
});
</script>

<style scoped>
.search-form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
