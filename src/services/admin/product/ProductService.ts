import { apiClient } from "@/services/api";
import { PaginationObject } from "@/type/util/PaginationObject";
import { NotificationUtil } from "@/util/Notification";

export class ProductService {
    private uriGetPageProduct = '/api/product/search';
    private uriGetProductById = '/api/product/';
    private uriCreateProduct = '/api/product/create';
    private uriUpdateProduct = '/api/product/update';
    private uriDeleteProduct = '/api/product/delete';


    async getProductList(pagin: PaginationObject, paramSearch: any) {
        try {
            // Chuẩn hóa các tham số tìm kiếm
            const normalizedParams: any = {
                name: paramSearch.name !== null ? paramSearch.name : '',
                productCode: paramSearch.productCode !== null ? paramSearch.productCode : '',
                categoryID: paramSearch.categoryID !== null ? paramSearch.categoryID : ''
            };
    
            // Xử lý startDate và endDate
            if (paramSearch.startDate && paramSearch.startDate.trim() !== '') {
                normalizedParams.startDate = paramSearch.startDate;
            }
    
            if (paramSearch.endDate && paramSearch.endDate.trim() !== '') {
                normalizedParams.endDate = paramSearch.endDate;
            }
    
            // Kiểm tra nếu paramSearch có các giá trị hợp lệ
            if (
                normalizedParams.name !== '' ||
                normalizedParams.productCode !== '' ||
                normalizedParams.categoryID !== '' ||
                normalizedParams.startDate !== undefined ||
                normalizedParams.endDate !== undefined
            ) {
                // Tạo query string từ normalizedParams
                const searchParams = new URLSearchParams(normalizedParams).toString();
    
                // Thêm query string vào URL nếu có tham số tìm kiếm
                const url = searchParams
                    ? `${this.uriGetPageProduct}?${searchParams}`
                    : this.uriGetPageProduct;
                // Gửi pagin (phân trang) trong body của POST request
                const response = await apiClient.post(url, pagin);
                return response.data;
            }
    
            // Nếu không có tham số tìm kiếm, chỉ gửi phân trang
            const response = await apiClient.post(this.uriGetPageProduct, pagin);
            return response.data;
        } catch (error) {
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
                NotificationUtil.openMessageSuccess('Thêm sản phẩm thành công');
            }
            return response.data;
        } catch (error: any) {
            NotificationUtil.openMessageError(error.response.data.message);
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
            if (response.status === 204) {
                NotificationUtil.openMessageSuccess('Xóa sản phẩm thành công');
            }
        } catch (error: any) {
            NotificationUtil.openMessageError(error.response.data.message);
        }
    }
}