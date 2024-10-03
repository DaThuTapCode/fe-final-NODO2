<script lang="ts" setup>
import { Search, Document, Close } from '@element-plus/icons-vue';
import { reactive, ref, defineEmits, watch, computed } from 'vue';
import CategoryForm from './CategoryForm.vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { dayjs } from 'element-plus';
import { NotificationUtil } from '@/util/Notification';
import en from "element-plus/es/locale/lang/en"; // Import ngôn ngữ tiếng Anh
import vi from "element-plus/es/locale/lang/vi";
const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const data = ref<any>({});

const paramSearch = reactive({
  categoryCode: '',
  name: '',
  startDate: '',
  endDate: '',
});

const emit = defineEmits<{
  (e: 'openTabAddCategory', dataTb: any): void,
  (e: 'searchCategory', queryParam: any): void,
  (e: 'exportExcelCategory', mode: number): void
}>();

const handleOpenTabAddCategory = () => {
  const viewMode = 'create'
  const dataTab = {
    title: t('createNewCategory'),
    name: '2',
    components: [
      {
        component: CategoryForm,
        props: { data, viewMode },
        emits: ['openTabAddCategory', 'searchCategory'],
      }
    ],
  };
  emit('openTabAddCategory', dataTab);
}

const handleExportExcel = (mode: number,) => {
  emit('exportExcelCategory', mode);
};

const handleSearch = () => {
  // Thực hiện tìm kiếm
  const startDateParsed = dayjs(paramSearch.startDate, 'DD-MM-YYYY');
  const endDateParsed = dayjs(paramSearch.endDate, 'DD-MM-YYYY');

  if (startDateParsed.isAfter(endDateParsed)) {
    NotificationUtil.openMessageError(t('error'), t('startDateIsBeforeEndDate'));
    return;
  }

  const queryParams = {
    categoryCode: paramSearch.categoryCode.trim() || undefined,
    name: paramSearch.name.trim() || undefined,
    startDate: paramSearch.startDate || undefined,
    endDate: paramSearch.endDate || undefined
  }
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, v]) => v !== undefined)
  );
  const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();

  router.push({
    path: '/admin/category',
    query: filteredParams
  });

  emit('searchCategory', queryString);
};

const handleReset = () => {
  paramSearch.name = '';
  paramSearch.categoryCode = '';
  paramSearch.startDate = '';
  paramSearch.endDate = '';
  handleSearch(); // Đẩy route với query rỗng
};

watch(
  () => route.query,
  (newQuery) => {
    // Chỉ gán giá trị cho paramSearch nếu không rỗng và không phải là null
    if (newQuery.startDate && typeof newQuery.startDate === 'string') {
      paramSearch.startDate = newQuery.startDate;
    }
    if (newQuery.endDate && typeof newQuery.endDate === 'string') {
      paramSearch.endDate = newQuery.endDate;
    }
    if (newQuery.name && typeof newQuery.name === 'string') {
      paramSearch.name = newQuery.name;
    }
    if (newQuery.categoryCode && typeof newQuery.categoryCode === 'string') {
      paramSearch.categoryCode = newQuery.categoryCode;
    }
  },
  { immediate: true }
);
const currentLanguage = localStorage.getItem('language') || 'en';

const locale = computed(() => {
  return currentLanguage === 'vi' ? vi : en;
});

</script>

<template>
  <el-form :model="paramSearch">
    <div class="search-form">
      <el-row :gutter="20">

        <el-row>
          <el-col :span="11" style="margin-left: 10px;">
            <el-form-item>
              <el-input maxlength="255" class="input-control" v-model="paramSearch.name"
                :placeholder="t('enterNameToSearch')" />
            </el-form-item>
          </el-col>

          <el-col :span="1">

          </el-col>

          <el-col :span="11">
            <el-form-item>
              <el-input maxlength="20" class="input-control" v-model="paramSearch.categoryCode"
                :placeholder="t('enterCodeToSearch')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="11">
            <el-config-provider :locale="locale">
              <el-form-item>
                <el-date-picker style="margin-left: 10px; width: 170px" class="input-control" v-model="paramSearch.startDate" format="DD-MM-YYYY"
                  value-format="DD-MM-YYYY" type="date" :placeholder="t('enterStartDate')" />
              </el-form-item>
            </el-config-provider>
          </el-col>
          <el-col :span="1">

          </el-col>
          <el-col :span="11">
            <el-config-provider :locale="locale">
              <el-form-item>
                <el-date-picker style="width: 170px" class="input-control" v-model="paramSearch.endDate" format="DD-MM-YYYY"
                  value-format="DD-MM-YYYY" type="date" :placeholder="t('enterEndDate')" />
              </el-form-item>
            </el-config-provider>
          </el-col>
        </el-row>


        <e-row>
          <el-col :span="4">
            <el-form-item>
              <el-button class="input-control" type="success" :icon="Search" @click="handleSearch">
                {{ t('search') }}
              </el-button>
              <el-button type="info" v-if="Object.keys(route.query).length > 0" :icon="Close" size="small"
                @click="handleReset">
                {{ t('cancelFilter') }}
              </el-button>
            </el-form-item>
          </el-col>
        </e-row>

        <e-row>
          <el-col :span="5">
            <el-form-item>
              <el-dropdown>
                <el-button class="input-control" :icon="Document" type="primary">
                  {{ t('exportExcel') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleExportExcel(1)" :icon="Document">
                      {{ t('exportAll') }}
                    </el-dropdown-item>
                    <el-dropdown-item :disabled="Object.keys(route.query).length === 0" @click="handleExportExcel(2)">
                      {{ t('exportToSearch') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form-item>
          </el-col>
        </e-row>

        <e-row>
          <el-col :span="4">
            <el-form-item>
              <el-button class="input-control" @click="handleOpenTabAddCategory" type="primary"> + {{
                t('createNewCategory') }}</el-button>
            </el-form-item>
          </el-col>
        </e-row>
      </el-row>
    </div>
  </el-form>
</template>



<style>
.input-control {
  font-size: smaller;

}

/* .search-form {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
} */
/* .el-input__inner{
  font-size: smaller;

} */
</style>
