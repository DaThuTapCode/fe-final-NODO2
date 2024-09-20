import { apiClient } from "@/services/api";
import { CategoryResponse } from "@/type/category/response/CategoryResponse";
import { PaginationObject } from "@/type/util/PaginationObject";


export class CategoryService {

    private uriGetPageCategory = '/api/category/search-page';
    private uriGetCategoryById = '/api/category';
    private uriDeleteCategory = '/api/category';

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
            if (response.status === 204) {
                alert('Xóa thành công loại sản phẩm');
            }
        } catch (error) {
            console.error('Lỗi khi xóa category: ', error);
        }
    }

}