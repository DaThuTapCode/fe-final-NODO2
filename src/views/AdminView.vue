<template>
    <div class="common-layout">
        <el-container>
            <el-aside style="background-color: #2A3650;" width="auto"><SideBar /></el-aside>
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
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

}
.el-main {

    padding-top: 15px !important;
}

</style>