<template>
    <el-row class="tac">
        <el-col>
            <el-menu style="min-height: 98vh;" active-text-color="#ffd04b" background-color="#2A3650"
                class="el-menu-vertical-demo" 
                :default-active="activeMenu" 
                text-color="#fff" @open="handleOpen" @close="handleClose" @select="handleSelect">
                
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <Box />
                        </el-icon>
                        <span>{{ t('productManagement') }}</span>
                    </template>
                    <router-link :to="{ name: 'CreateProductForm' }">
                        <el-menu-item index="1-1">{{ t('createNewProduct') }}</el-menu-item>
                    </router-link>
                    <router-link :to="{ name: 'ListProduct' }">
                        <el-menu-item index="1-2">{{ t('productList') }}</el-menu-item>
                    </router-link>
                </el-sub-menu>
                <router-link :to="{ name: 'CategoryView' }">
                    <el-menu-item index="2">
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>{{ t('categoryManagement') }}</span>
                    </el-menu-item>
                </router-link>

            </el-menu>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
const { t } = useI18n();
import { ref, onMounted } from 'vue';
import { Box, List } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

// Khởi tạo activeMenu để lưu trữ trạng thái của menu
const activeMenu = ref(localStorage.getItem('activeMenu') || '2'); // Lấy từ localStorage hoặc mặc định là '2'

// Hàm xử lý khi người dùng chọn 1 menu
const handleSelect = (index: string) => {
    activeMenu.value = index;
    localStorage.setItem('activeMenu', index); // Lưu trạng thái menu vào localStorage
};

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
</script>

<style>
.tac {
    min-width: 250px;
}
</style>
