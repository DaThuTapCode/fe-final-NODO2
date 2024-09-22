import { apiClient } from "@/services/api";
import { PaginationObject } from "@/type/util/PaginationObject";
import { LoadingUtil } from "@/util/Loading";
import { NotificationUtil } from "@/util/Notification";

export class ProductService {
    private uriGetPageProduct = '/api/product/search';
    private uriGetProductById = '/api/product';
    private uriCreateProduct = '/api/product/create';
    private uriUpdateProduct = '/api/product/update';
    private uriDeleteProduct = '/api/product/delete';


    async getProductList(pagin: PaginationObject, paramSearch: any) {
        try {
            LoadingUtil.openLoading(true);
            if (paramSearch !== null && typeof paramSearch === 'string' && paramSearch !== '') {
                const response = await apiClient.post(`${this.uriGetPageProduct}?${paramSearch}`, pagin);
                if(response.data.empty === true){
                    NotificationUtil.openMessageError('Không có sản phẩm nào được tìm thấy!');
                    LoadingUtil.openLoading(false);
                    return response.data;
                }
                LoadingUtil.openLoading(false);
                // alert(paramSearch)
                NotificationUtil.openMessageSuccess('Tìm thấy sản phẩm');
                return response.data;

            }
            // Nếu không có tham số tìm kiếm, chỉ gửi phân trang
            const response = await apiClient.post(this.uriGetPageProduct, pagin);
            LoadingUtil.openLoading(false);
            return response.data;
        } catch (error) {
            LoadingUtil.openLoading(false);
            NotificationUtil.openMessageError('Lỗi khi lấy danh sách sản phẩm');
        }
    }




    async getProductById(id: number) {
        try {
            const response = await apiClient.get(`${this.uriGetProductById}/${id}`);
            return response.data;
        } catch (error: any) {
            NotificationUtil.openMessageError(error.response.data.message);
        }
    }

    async createNewProduct(data: FormData) {
        try {
            const response = await apiClient.post(`${this.uriCreateProduct}`, data);
            if (response.status === 200) {
                NotificationUtil.openMessageSuccess(response.data.message);
                console.log(response);
            }
            return response.data;
        } catch (error: any) {
            NotificationUtil.openMessageError(error.response.data.message);
            console.error(error);
        }
    }

    async updateProduct(id: number, data: FormData) {
        try {
            const response = await apiClient.put(`${this.uriUpdateProduct}/${id}`, data);
            if (response.status === 200) {
                NotificationUtil.openMessageSuccess('Sửa sản phẩm thành công');
            }
            return response.data;
        } catch (error: any) {
            NotificationUtil.openMessageError(error.response.data.message);
        }
    }

    async deleteProduct(id: number) {
        try {
            const response = await apiClient.put(`${this.uriDeleteProduct}/${id}`);
            if (response.status === 200) {
                NotificationUtil.openMessageSuccess(response.data.message);
            }
        } catch (error: any) {
            NotificationUtil.openMessageError(error.response.data.message);
        }
    }
}