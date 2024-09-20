<template>
  <el-form style="max-width: 800px">
    <div class="search-form">
      <el-row>
        <el-col :span="6">
          <span>Tên</span>

          <el-form-item>
            <el-input placeholder="Nhập tên cần tìm" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <span>Mã</span>
          <el-form-item>
            <el-input placeholder="Nhập mã cần tìm" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <span>Ngày bắt đầu</span>

          <el-form-item>
            <el-date-picker type="date" placeholder="Chọn ngày bắt đầu" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <span>Ngày kết thúc</span>

          <el-form-item>
            <el-date-picker type="date" placeholder="Chọn ngày bắt đầu" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
          <div>
            <el-button type="success" :icon="Search" round @click="handleSearch">
              Tìm kiếm
            </el-button>
          </div>
        </el-form-item>
    </div>
  </el-form>

</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
const handleSearch = () => {
  // Thực hiện tìm kiếm
  console.log('Tìm kiếm');
};
</script>

<style scoped>
.search-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
