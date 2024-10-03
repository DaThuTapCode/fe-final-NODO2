<script lang="ts" setup>
import CategoryTable from '@/components/category/CategoryTable.vue';
import CategoryFormSearch from '@/components/category/CategoryFormSearch.vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import { CategoryResponse } from '@/type/category/response/CategoryResponse';
import { CategoryService } from '@/services/admin/category/CategoryService';
import { PaginationObject } from '@/type/util/PaginationObject';
import { NotificationUtil } from '@/util/Notification';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t, locale } = useI18n();
// Service lấy dữ liệu
const categoryService = new CategoryService();
// let tabIndex = 1;

const editableTabsValue = ref('1'); // Giá trị mặc định là tab đầu tiên
const editableTabs = ref<any[]>([]);

// Dữ liệu cung cấp cho Component CategoryTable
const categories = ref<CategoryResponse[]>([]);

const route = useRoute();

const pager = ref<any>({});

const pagination: PaginationObject = {
    page: 0,
    size: 5,
    sortBy: null,
    direction: null
};

const paramString = ref('');

const handleSearchCategory = async (queryString: string) => {
    await nextTick(); // Chờ đến khi Vue cập nhật DOM và route.query kịp thay đổi
    console.log('Query', queryString);
    paramString.value = queryString;
    fetchCategories();
}


const handlePageChange = (newPage: number) => {
    pagination.page = newPage;
    fetchCategories();
}
const handleSizeChange = (newSize: number) => {
    pagination.size = newSize;
    fetchCategories();
}

// const data = ref<any>({});
const handleOpenTab = (tabData: any, categoryId: number) => {
    console.log('TabData: ', tabData)
    addTab(tabData);
}

const handleCreateCategory = (data: FormData) => {
    createCategory(data);
}

const handleDeleted = (id: number) => {
    deleteCategory(id);
}

const handleUpdateCategory = (dataUp: any) => {
    updateCategory(dataUp);
}

const handleLoadData = () => {
    fetchCategories();
}


// Thêm tab đầu tiên vào mảng editableTabs
editableTabs.value.push({
    title: t('list'),
    name: '1',
    components: [
        {
            component: CategoryFormSearch,
            props: {},
            emits: [''],
        },
        {
            component: CategoryTable,
            props: { categories, pager, },
            emits: ['sizeChange', 'pageChange', 'openTab'],
        },
    ],
});
watch(locale, () => {
    editableTabs.value[0].title = t('list');
    editableTabs.value.forEach(tab => {
        console.log(tab.name)
        if (tab.name === '2') {
            tab.title = t('createNewCategory'); 
        }
        if (tab.title === 'Update' + ' ' + tab.name  || tab.title === 'Chỉnh sửa' + ' ' + tab.name) {
            tab.title = t('update') + ' ' + tab.name;
        }
        if (tab.title === 'Chi tiết' + ' ' + tab.name || tab.title === 'Detail' + ' ' + tab.name) {
            tab.title = t('detail') + ' ' + tab.name;
        }
    });
});
// Hàm thêm tab mới
const addTab = (tabData: { title: string; name: string; components: any[] }) => {
    // Kiểm tra xem tab với tên đã tồn tại hay chưa
    const existingTabIndex = editableTabs.value.findIndex(tab => tab.name === tabData.name);

    if (existingTabIndex !== -1) {
        // Nếu tồn tại tab, thì xóa tab cũ trước khi thêm tab mới
        removeTab(tabData.name);
    }

    let title = '';
    if(tabData.name === '2'){
        title = tabData.title;
    }else{
        title =  tabData.title + ' ' + tabData.name;
    }
    editableTabs.value.push({
        title: title,
        name: tabData.name, // Tên tab duy nhất
        components: tabData.components, // Mảng chứa nhiều component
    });

    // Chuyển đến tab mới tạo
    editableTabsValue.value = tabData.name;
};


//Back
const backTabOne = () => {
    editableTabsValue.value = '1';
}

// Hàm xóa tab
const removeTab = (targetName: string) => {
    if (targetName === '1') {
        return;
    }
    const tabs = editableTabs.value;
    let activeName = editableTabsValue.value;
    if (activeName === targetName) {
        tabs.forEach((tab: any, index: number) => {
            if (tab.name === targetName) {
                const nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                    activeName = nextTab.name;
                }
            }
        });
    }
    editableTabsValue.value = activeName;
    editableTabs.value = tabs.filter((tab: any) => tab.name !== targetName);
};

// Fetch dữ liệu cho danh sách Categories
const fetchCategories = async () => {
    try {
        const response = await categoryService.getPageCategory(pagination, paramString.value);
        categories.value = response.content;
        pager.value = response;
    } catch (error) {
        console.error('Lỗi khi fetch category: ', error);
    }
};

// Thêm category mới 
const createCategory = async (data: FormData) => {
    try {
        await categoryService.createCategory(data);
        fetchCategories();
        NotificationUtil.openMessageSuccess(t('success'), t('createCategorySuccessfully'));
    } catch (error: any) {
        NotificationUtil.openMessageError(t('error'), error.response.data.message);
    }
}


//Xóa category
const deleteCategory = async (id: number) => {
    try {
        const response = await categoryService.deleteCategory(id);
        if (response.status === 204) {
            fetchCategories();
            NotificationUtil.openMessageSuccess(t('success'), t('deleteSuccessfully'));
        }
    } catch (error: any) {
        NotificationUtil.openMessageError(t('error'), error.response.data.message);
        fetchCategories();
    }
}

//Update Category
const updateCategory = async (dataUp: any) => {
    try {
        await categoryService.updateCategory(dataUp.id, dataUp.value);
        fetchCategories();
        let activeName = editableTabsValue.value;
        removeTab(activeName);
        NotificationUtil.openMessageSuccess(t('success'), t('updateSuccesfully'));
    } catch (error: any) {
        console.error('Lỗi update category: ', error);
        NotificationUtil.openMessageError(t('error'), error.response.data.message);
    }
}

//Xuất excel 
const handleExportExcel = async (mode: number) => {
    try {
        if (mode === 2) {
            if (!paramString.value.length) {
                NotificationUtil.openMessageError(t('error'), '');
                return;
            }
        }
        await categoryService.exportExcel(mode, paramString.value);
        NotificationUtil.openMessageSuccess(t('success'), '');
    } catch (error: any) {
        NotificationUtil.openMessageError(t('error'), error.response.data.message);
        console.error(error);
    }
}


// Theo dõi sự thay đổi của query params
watch(
    () => route.query,
    (newQuery) => {
        paramString.value = new URLSearchParams(newQuery as Record<string, string>).toString();
        console.log('Query string updated:', paramString.value);
    },
    { immediate: true } // Đảm bảo lấy giá trị ngay khi khởi tạo
);

const hehe = (dataTab: any) => {
    addTab(dataTab);
}

onMounted(() => {
    fetchCategories();
});
</script>

<template>
    <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" @tab-remove="removeTab">
        <el-tab-pane :closable="item.name !== '1'" v-for="item in editableTabs" :key="item.name" :label="item.title"
            :name="item.name">
            <div v-for="(component, index) in item.components" :key="index">
                <component :is="component.component" v-bind="component.props" v-on="{
                    'pageChange': handlePageChange,
                    'sizeChange': handleSizeChange,
                    'openTab': handleOpenTab,
                    'openTabAddCategory': hehe,
                    'createCategory': handleCreateCategory,
                    'searchCategory': handleSearchCategory,
                    'deleted': handleDeleted,
                    'updateCategory': handleUpdateCategory,
                    'exportExcelCategory': handleExportExcel,
                    'backTabOne': backTabOne,
                    'loadData': handleLoadData
                }" />
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<style>
.el-tabs__item{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.demo-tabs>.el-tabs__content {
    /* padding: 32px; */
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
</style>
