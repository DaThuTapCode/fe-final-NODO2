import { ElNotification } from "element-plus"

export class NotificationUtil {

    static openMessageSuccess = (message: any) => {
        ElNotification({
          title: 'Thành công',
          message: message,
          type: 'success',
        })
      }
     static openMessageError = (message: any) => {
        ElNotification({
          title: 'Lỗi',
          message: message,
          type: 'error',
        })
      }
}