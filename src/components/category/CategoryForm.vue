<template>
     <el-form :model="dataC" label-width="auto">
                <el-form-item label="Mã danh mục">
                    <el-input v-model="dataC.categoryCode" :disabled="viewMode === 'view' || viewMode === 'update'" />
                </el-form-item>
                <el-form-item label="Tên">
                    <el-input v-model="dataC.name" :disabled="viewMode === 'view'" />
                </el-form-item>
                <el-form-item label="Ngày tạo">
                    <el-input v-model="dataC.createdDate" :disabled="viewMode === 'view'" />
                </el-form-item>
                <el-form-item label="Người sửa cuối">
                    <el-input v-model="dataC.modifiedBy" :disabled="viewMode === 'view'" />
                </el-form-item>
            </el-form>
  </template>
  
  <script lang="ts" setup>
  import {ref, defineProps } from 'vue'

  const props = defineProps<{
    viewMode: string;
    data: any;
  }>();
  
  const dataC = ref(props.data);

  </script>
  