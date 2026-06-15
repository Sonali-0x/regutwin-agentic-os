export class ApiResponse {
  static success(data: any, message = "Success") {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message = "Error") {
    return {
      success: false,
      message,
    };
  }
}
