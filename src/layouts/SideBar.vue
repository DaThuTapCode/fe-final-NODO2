<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Box, List } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Trạng thái collapse của menu
const isCollapsed = ref(false);

// Hàm xử lý khi màn hình thay đổi kích thước
const handleResize = () => {
  if (window.innerWidth <= 1000) {
    isCollapsed.value = true; // Tự động thu gọn khi màn hình nhỏ hơn 768px
  } else {
    isCollapsed.value = false; // Mở rộng menu khi màn hình lớn hơn 768px
  }
};

// Lắng nghe sự kiện thay đổi kích thước màn hình
onMounted(() => {
  handleResize(); // Kiểm tra kích thước màn hình khi component được mount
  window.addEventListener('resize', handleResize); // Lắng nghe sự kiện resize
});

// Hủy bỏ sự kiện lắng nghe khi component bị hủy
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize); // Gỡ bỏ sự kiện khi không cần nữa
});

// Khởi tạo activeMenu để lưu trữ trạng thái của menu
const activeMenu = ref(localStorage.getItem('activeMenu') || '2');

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

<template>
  <el-row class="tac">
    <el-col :span="1">
      <el-menu style="height: 100vh; width: fit-content; overflow-y: auto;" :collapse="isCollapsed"
        active-text-color="#ffd04b" background-color="#2A3650" class="el-menu-vertical-demo"
        :default-active="activeMenu" text-color="#fff" @open="handleOpen" @close="handleClose" @select="handleSelect">
        <router-link :to="{ name: 'ListProduct' }">
          <el-menu-item index="1">
            <el-icon>
              <Box />
            </el-icon>
            <span v-if="!isCollapsed">{{ t('productManagement') }}</span>
          </el-menu-item>
        </router-link>
        <router-link :to="{ name: 'CategoryView' }">
          <el-menu-item index="2">
            <el-icon>
              <List />
            </el-icon>
            <span v-if="!isCollapsed">{{ t('categoryManagement') }}</span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-col>
  </el-row>
</template>

<style>
.brand {
  color: white;
  text-align: center;
  font-size: x-large;
  /* width: 200px; */
  margin-top: 10px;
  padding-left: 70px
}

@media (max-width: 1000px) {
  .brand {
    width: 10px;
  }
}
</style>