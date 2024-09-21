<template>
  <el-form :model="paramSearch">

    <div class="search-form">
      <span style="font-size: larger; font-weight: bold; color: green;">Bộ lọc</span>
      <hr>
      <el-row :gutter="20">
        <el-col :span="6">
          <span>Tên</span>
          <el-form-item>
            <el-input v-model="paramSearch.name" placeholder="Nhập tên cần tìm" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <span>Mã</span>
          <el-form-item>
            <el-input v-model="paramSearch.categoryCode" placeholder="Nhập mã cần tìm" />
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <span>Ngày bắt đầu</span>
          <el-form-item>
            <el-date-picker v-model="paramSearch.startDate" type="date" placeholder="Chọn ngày bắt đầu" />
          </el-form-item>
        </el-col>

        <el-col :span="3">
          <span>Ngày kết thúc</span>
          <el-form-item>
            <el-date-picker v-model="paramSearch.endDate" type="date" placeholder="Chọn ngày bắt đầu" />
          </el-form-item>
        </el-col>
        <el-col :span="3" >
          <span>z</span>
          <el-form-item>
            <div>
              <el-button type="success" :icon="Search" round @click="handleSearch">
                Tìm kiếm
              </el-button>
            </div>
          </el-form-item>
        </el-col>

      </el-row>



    </div>

  </el-form>

</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
const handleSearch = () => {
  // Thực hiện tìm kiếm
  console.log('Tìm kiếm: ', paramSearch);
};

const paramSearch = reactive({
  categoryCode: null,
  name: null,
  startDate: null,
  endDate: null,
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
