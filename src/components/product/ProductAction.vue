<script lang="ts" setup>
import { Edit, Delete, View } from '@element-plus/icons-vue'
</script>
<template>
    <div>
        <el-button type="primary" :icon="View" circle size="normal" @click="null" />
        <el-button type="success" :icon="Edit" circle size="normal" @click="null" />
        <el-button type="danger" :icon="Delete" circle size="normal" @click="null" />
    </div>
</template>
<style></style>