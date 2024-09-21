import { apiClient } from "@/services/api";
import { CategoryResponse } from "@/type/category/response/CategoryResponse";
import { PaginationObject } from "@/type/util/PaginationObject";
import { LoadingUtil } from "@/util/Loading";
import { NotificationUtil } from "@/util/Notification";


export class CategoryService {

    private uriGetPageCategory = '/api/category/search-page';
    private uriGetCategoryById = '/api/category';
    private uriDeleteCategory = '/api/category/delete';

    private uriUpdateCategory = '/api/category/update';
    private uriCreateCategory = '/api/category/create';

    async getCategoryById(id: number): Promise<CategoryResponse> {
        try {
            const response = await apiClient.get(`${this.uriGetCategoryById}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy category với id: ' + id);
            throw error;
        }
    }

    async getPageCategory(pagination: PaginationObject) {
        try {
            const response = await apiClient.post(`${this.uriGetPageCategory}`, pagination);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy category');
            throw error;
        }
    }

    async deleteCategory(id: number) {
        try {
            const response = await apiClient.put(`${this.uriDeleteCategory}/${id}`);
            return response;
        } catch (error) {
            console.error('Lỗi khi xóa category: ', error);
        }
    }

    async updateCategory(id: number, data: FormData) {
        try {
            const response = await apiClient.put(`${this.uriUpdateCategory}/${id}`, data);
            return response;
        } catch (error) {
            console.error('Lỗi khi update category: ', error);
            throw error;
        }
    }

    async createCategory(data: FormData) {
        try {
            LoadingUtil.openLoading(true);
            const response = await apiClient.post(`${this.uriCreateCategory}`, data);
            if(response.status === 200) {
                NotificationUtil.openMessageSuccess('Thêm thành công loại sản phẩm mới!');
                LoadingUtil.openLoading(false);
            }
            return response;
        } catch (error: any) {
            NotificationUtil.openMessageError(error.response.data.message);
            console.error('Lỗi khi thêm category: ', error);
            LoadingUtil.openLoading(false);
            // throw error;
        }
    }

}