<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { setLanguage } from '../services/api'; // Import hàm setLanguage

const { t, locale } = useI18n();

const changeLanguage = (lang: string) => {

  if(lang === localStorage.getItem('language')){
    return;
  }

  let check = confirm(t('confirmChangeLanguage'));
  if(!check){
    return;
  }
  locale.value = lang;
  localStorage.setItem('language', lang); // Lưu ngôn ngữ vào localStorage
  setLanguage(lang); // Cập nhật ngôn ngữ trong apiClient
  window.location.reload();
};

</script>

<template>
  <h1 style="float: right;">
    <el-button @click="changeLanguage('vi')" :class="locale === 'vi' ? 'lang-button' : ''">VN</el-button>
    <el-button @click="changeLanguage('en')" :class="locale === 'en' ? 'lang-button' : ''">EN</el-button>
  </h1>
</template>

<style scoped>
header {
  background-color: #f8f9fa;
  padding: 20px;

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
}

.lang-button {
  min-width: 100px;
  background-color: #79BBFF;
  color: white;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 4px;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
