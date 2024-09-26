<script lang="ts" setup>
import { ref } from 'vue';
import CategoryForm from './CategoryForm.vue';
import { CategoryService } from '@/services/admin/category/CategoryService';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const categoryService = new CategoryService();

//Gọi api để thêm category mới
const callCreateCategory = async(data: FormData) =>{
    try {
        categoryService.createCategory(data);
    } catch (error) {
        console.error('Lỗi thêm category: ', error)
    }
}




const categoryNew = ref({
})
</script>

<template>
    <div class="container">
        <div class="form-zone">
            <CategoryForm 
            :data="categoryNew" 
            :view-mode="'create'"
            @createCategory="callCreateCategory"
             />
        </div>
    </div>
</template>

<style scope>
.container {
    width: 800px;
    margin: auto;
}

.form-zone {
    padding: 30px;
    background-color: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>