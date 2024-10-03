import { apiClient } from "@/services/api";
import { PaginationObject } from "@/type/util/PaginationObject";
import { LoadingUtil } from "@/util/Loading";

export class ProductService {
    private uriGetPageProduct = '/api/product/search';
    private uriGetProductById = '/api/product';
    private uriCreateProduct = '/api/product/create';
    private uriUpdateProduct = '/api/product/update';
    private uriDeleteProduct = '/api/product/delete';
    private uriExportExcel = '/api/excel/products';


    async getProductList(pagin: PaginationObject, paramSearch: any) {
        try {
            LoadingUtil.openLoading(true);
            if (paramSearch !== null && typeof paramSearch === 'string' && paramSearch !== '') {
                const response = await apiClient.post(`${this.uriGetPageProduct}?${paramSearch}`, pagin);
                if (response.data.empty === true) {
                    return response.data;
                }
                return response.data;
            }
            // Nếu không có tham số tìm kiếm, chỉ gửi phân trang
            const response = await apiClient.post(this.uriGetPageProduct, pagin);
            return response.data;
        } catch (error) {
            // NotificationUtil.openMessageError('Lỗi khi lấy danh sách sản phẩm');
        }finally {
            LoadingUtil.openLoading(false);
        }
    }


    async getProductById(id: any) {
         return  await apiClient.get(`${this.uriGetProductById}/${id}`);
    }

    async createNewProduct(data: FormData) {
        return await apiClient.post(`${this.uriCreateProduct}`, data);
    }


    async updateProduct(id: any, data: FormData) {
        return await apiClient.put(`${this.uriUpdateProduct}/${id}`, data);
    }

    async deleteProduct(id: number) {
            return  await apiClient.put(`${this.uriDeleteProduct}/${id}`);
    }

    async exportExcel(mode: number, queryString: string) {
        try {

            let  apiUrl  = ``;
            if(mode === 1){
                apiUrl  = `${this.uriExportExcel}/${mode}`;
            }else {
                apiUrl  = `${this.uriExportExcel}/${mode}?${queryString}`;
            }

            const response = await apiClient.get(apiUrl, {
                responseType: 'blob' // Đặt kiểu phản hồi là blob để nhận file
            });
            
            // Tạo URL từ blob
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadUrl = window.URL.createObjectURL(blob);
    
            // Tạo link để tải file
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `exported-file-${mode}.xlsx`; // Tên file khi tải về
            link.click();
    
            // Giải phóng bộ nhớ
            window.URL.revokeObjectURL(downloadUrl);
    
        } catch (error) {
            // NotificationUtil.openMessageError('Lỗi xuất excel!');
        }
    }
    
}