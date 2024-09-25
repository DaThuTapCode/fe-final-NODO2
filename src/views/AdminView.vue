<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="auto"><SideBar /></el-aside>
            <el-container>
                <el-header><HeaderComponent/></el-header>
                <el-main><router-view></router-view></el-main>
                <el-footer><FooterComponent /></el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts" setup>
import SideBar from '@/layouts/SideBar.vue';
import FooterComponent from '@/layouts/FooterComponent.vue';
import HeaderComponent from '@/layouts/HeaderComponent.vue';
</script>

<style>
header.el-header{
    background-color: white ;
}


</style>