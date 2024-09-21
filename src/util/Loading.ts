import { ElLoading } from "element-plus";

export class LoadingUtil {
    private static loadingInstance: any;

   static openLoading(l: boolean) {
        const loading = ElLoading;
        if (l) {
            this.loadingInstance = loading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
            });
        } else {
            if (this.loadingInstance) {
                this.loadingInstance.close(); // Đóng loading
                this.loadingInstance = null; // Reset instance
            }
        }
    }
}
