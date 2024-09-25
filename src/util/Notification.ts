import { ElNotification } from "element-plus"

export class NotificationUtil {

  static openMessageSuccess = (title: any, message: any) => {

    ElNotification({
      title: title,
      message: message,
      type: 'success',
    })
  }
  static openMessageError = (title: any, message: any) => {
    ElNotification({
      title: title,
      message: message,
      type: 'error',
    })
  }
}