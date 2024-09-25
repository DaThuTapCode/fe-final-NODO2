<template>
  <h1>
    <!-- {{ t('titleHeaderAdmin') }}  -->
    <el-button @click="changeLanguage('vi')"  :class="locale === 'vi' ? 'lang-button' : ''">Check VN</el-button>
    <el-button @click="changeLanguage('en')"  :class="locale === 'en' ? 'lang-button' : ''">Check EN</el-button>
  </h1>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { setLanguage } from '../services/api'; // Import hàm setLanguage

const { t, locale } = useI18n();

const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('language', lang); // Lưu ngôn ngữ vào localStorage
  setLanguage(lang); // Cập nhật ngôn ngữ trong apiClient
};
</script>

<style scoped>
header {
  background-color: #f8f9fa;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2A3650;
  text-align: center;
  margin-bottom: 10px;
}

.language-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  /* Khoảng cách giữa các nút */
}

.lang-button {
  min-width: 100px; /* Chiều rộng tối thiểu cho các nút */
  background-color: #79BBFF; /* Màu nền ban đầu */
  color: white; /* Màu chữ */
  transition: background-color 0.3s ease, color 0.3s ease; /* Thêm chuyển đổi cho màu nền và màu chữ */
  border-radius: 4px; /* Bo tròn góc */
  border: none; /* Bỏ viền */
  padding: 10px 20px; /* Thêm khoảng đệm */
  cursor: pointer; /* Hiển thị con trỏ khi hover */
}



</style>
