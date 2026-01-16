export const ERROR_MESSAGES = {
    /* COMMON / GENERAL */
    LOAD_FAILED: "Không thể tải dữ liệu. Vui lòng thử lại.",
    CREATE_FAILED: "Không thể tạo mới. Vui lòng thử lại.",
    DELETE_FAILED: "Không thể xóa. Vui lòng thử lại.",
    CONTENT_NOT_FOUND: "Không xác định được nội dung.",
    INCREASE_VIEW_FAILED: "Không thể tăng lượt xem",

    /* AUTH / ACCOUNT */
    LOGIN_FAILED: "Đăng nhập thất bại. Vui lòng thử lại.",
    REGISTER_FAILED: "Không thể đăng ký tài khoản. Vui lòng thử lại.",
    FORGOT_PASSWORD_FAILED: "Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại.",
    CHANGE_PASSWORD_FAILED: "Không thể đổi mật khẩu. Vui lòng thử lại.",
    ACTIVATE_ACCOUNT_FAILED: "Không thể kích hoạt tài khoản. Vui lòng thử lại.",
    INVALID_LINK: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",

    /* AUTH VALIDATION */
    EMAIL_EMPTY: "Email không được để trống",
    EMAIL_INVALID: "Email không hợp lệ",
    EMAIL_EXISTS: "Email đã tồn tại",
    PASSWORD_EMPTY: "Mật khẩu không được để trống",
    PASSWORD_INVALID: "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt",
    PASSWORD_MISMATCH: "Mật khẩu nhập lại không khớp",
    USERNAME_EMPTY: "Tên người dùng không được để trống",
    USERNAME_TOO_SHORT: "Tên người dùng quá ngắn",
    USERNAME_TOO_LONG: "Tên người dùng quá dài",
    USERNAME_EXISTS: "Tên người dùng đã tồn tại",

    /* UPLOAD */
    TITLE_EMPTY: "Tiêu đề không được để trống",
    FILE_EMPTY: "Vui lòng chọn file",
    VIDEO_EMPTY: "Vui lòng chọn file video",
    UPLOAD_FAILED: "Upload thất bại!",
    UPLOAD_HISTORY_LOAD_FAILED: "Không thể tải dữ liệu. Vui lòng thử lại.",

    /* LESSON */
    LESSON_NOT_FOUND: "Không tìm thấy bài giảng.",
    LESSON_LOAD_FAILED: "Không thể tải bài giảng. Vui lòng thử lại.",
    LESSON_DETAIL_LOAD_FAILED: "Không thể tải chi tiết bài giảng. Vui lòng thử lại.",
    LESSON_AUTHOR_LOAD_FAILED: "Không thể tải thêm bài giảng của giảng viên này. Vui lòng thử lại.",
    LESSON_UPDATE_FAILED: "Không thể cập nhật trạng thái bài giảng. Vui lòng thử lại.",
    LESSON_DELETE_FAILED: "Không thể xóa bài giảng. Vui lòng thử lại.",
    LESSON_UPDATE_FAILED_FORM: "Update thất bại. Vui lòng thử lại.",

    /* LESSON AUTH / ACTION */
    DOWNLOAD_LOGIN_REQUIRED_LESSON: "Vui lòng đăng nhập để tải tài liệu",
    DOWNLOAD_SUBFILE_LOGIN_REQUIRED: "Vui lòng đăng nhập để tải file bổ sung",
    LOGIN_REQUIRED_LESSON_FAVORITE: "Vui lòng đăng nhập để lưu video yêu thích.",

    /* FAVORITE */
    FAVORITE_ADD_FAILED: "Không thể cập nhật kho lưu. Vui lòng thử lại.",
    FAVORITE_REMOVE_FAILED: "Không thể xóa mục khỏi kho lưu. Vui lòng thử lại.",
    FAVORITE_UPDATE_FAILED: "Không thể cập nhật kho yêu thích. Vui lòng thử lại.",
    FAVORITES_LOAD_FAILED: "Không thể tải kho lưu. Vui lòng thử lại.",

    /* RATING */
    RATING_LOAD_FAILED: "Không thể tải đánh giá. Vui lòng thử lại.",
    RATING_SUBMIT_FAILED: "Không thể gửi đánh giá. Vui lòng thử lại.",
    RATING_ALREADY_EXISTS: "Bạn đã đánh giá tài liệu này.",
    RATING_SELECT_REQUIRED: "Vui lòng chọn số sao trước khi xác nhận.",
    LOGIN_REQUIRED_RATING: "Vui lòng đăng nhập để đánh giá tài liệu.",

    /* COMMENT */
    COMMENT_LOAD_FAILED: "Không thể tải bình luận. Vui lòng thử lại.",

    /* CATEGORY */
    CATEGORY_LOAD_FAILED: "Đã xảy ra lỗi khi tải danh mục. Vui lòng thử lại",
    CATEGORY_LOAD_FAILED_FORM: "Lấy danh sách danh mục thất bại. Vui lòng thử lại.",
    CATEGORY_UPDATE_FAILED: "Không thể cập nhật trạng thái danh mục. Vui lòng thử lại",
    CATEGORY_NOT_FOUND: "Không tìm thấy danh mục. Vui lòng thử lại.",

    /* DOCUMENT */
    DOCUMENT_LOAD_FAILED: "Không thể tải tài liệu. Vui lòng thử lại.",
    DOCUMENT_UPDATE_FAILED: "Không thể cập nhật trạng thái tài liệu. Vui lòng thử lại.",
    DOCUMENT_UPDATE_FAILED_FORM: "Update thất bại!",
    DOCUMENT_DELETE_FAILED: "Xóa tài liệu thất bại. Vui lòng thử lại.",
    DOCUMENT_NOT_FOUND: "Không tìm thấy tài liệu. Vui lòng thử lại.",
    AUTHOR_DOCUMENTS_LOAD_FAILED: "Không thể tải thêm tài liệu của tác giả này. Vui lòng thử lại.",
    PDF_LOAD_ERROR: "Không thể mở tài liệu PDF.",

    /* DOCUMENT AUTH */
    DOWNLOAD_LOGIN_REQUIRED: "Vui lòng đăng nhập để tải tài liệu",
    LOGIN_REQUIRED_FAVORITE: "Vui lòng đăng nhập để lưu tài liệu yêu thích.",

    /* USER */
    USER_LOAD_FAILED: "Không thể tải người dùng. Vui lòng thử lại.",
    USER_UPDATE_FAILED: "Không thể cập nhật trạng thái người dùng. Vui lòng thử lại.",
    PROFILE_LOAD_FAILED: "Không thể tải thông tin cá nhân. Vui lòng thử lại.",
    PROFILE_UPDATE_FAILED: "Cập nhật thất bại!",

    /* FORM / COMPONENT */
    UPDATE_FAILED_FORM: "Cập nhật thất bại. Vui lòng thử lại.",
    DELETE_FAILED_FORM: "Xóa thất bại!",
    CAROUSEL_LOAD_FAILED: "Không thể lấy thông tin cùng danh mục. Vui lòng thử lại.",

    /* CHATBOT */
    CHAT_HISTORY_LOAD_FAILED: "Không thể lấy thông tin lịch sử chat. Vui lòng thử lại.",
    CHAT_SEND_FAILED: "Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại.",
};

export const SUCCESS_MESSAGES = {
    /* CATEGORY */
    CATEGORY_CREATED: "Danh mục đã được tạo thành công.",
    CATEGORY_UPDATED: "Danh mục đã được cập nhật thành công.",

    /* USER */
    USER_CREATED: "Người dùng đã được tạo thành công.",

    /* DOCUMENT */
    DOCUMENT_CREATED: "Tài liệu đã được tải lên thành công.",

    /* LESSON */
    LESSON_CREATED: "Bài học đã được tạo thành công.",

    /* AUTH */
    REGISTER_SUCCESS: "Đăng ký thành công vui lòng vào Email để kích hoạt tài khoản!",
    FORGOT_PASSWORD_SUCCESS: "Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.",
    CHANGE_PASSWORD_SUCCESS: "Đổi mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.",
    ACTIVATE_ACCOUNT_SUCCESS: "Tài khoản đã kích hoạt thành công, bạn hãy đăng nhập để tiếp tục sử dụng dịch vụ!",

    /* UPLOAD */
    UPLOAD_SUCCESS: "Upload thành công!",
};
