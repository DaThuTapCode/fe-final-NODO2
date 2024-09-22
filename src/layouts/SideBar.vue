<template>
    <el-row class="tac">
        <el-col>
            <el-menu style="min-height: 98vh;" active-text-color="#ffd04b" background-color="#2A3650"
                class="el-menu-vertical-demo" default-active="2" text-color="#fff" @open="handleOpen"
                @close="handleClose">
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <Box />
                        </el-icon>
                        <span>Quản lý sản phẩm</span>
                    </template>
                    <router-link :to="{ name: 'CreateProductForm' }">
                        <el-menu-item index="1-1">Thêm sản phẩm mới</el-menu-item>
                    </router-link>
                    <router-link :to="{ name: 'ListProduct' }">
                        <el-menu-item index="1-2">Danh sách sản phẩm</el-menu-item>
                    </router-link>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon>
                            <List />
                        </el-icon>
                        <span>Quản lý loại sản phẩm</span>
                    </template>
                    <router-link :to="{ name: 'CreateCategoryForm' }">
                        <el-menu-item index="2-1"> Thêm loại sản phẩm</el-menu-item>
                    </router-link>
                    <router-link :to="{name: 'ListCategory'}">
                        <el-menu-item index="2-2">Danh sách loại sản phẩm</el-menu-item>
                    </router-link>
                </el-sub-menu>

            </el-menu>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import {
    Box,
    List,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>
<style>

</style>