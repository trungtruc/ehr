
TÊN DB: Cho-Ray-Hospital

1. Thêm những user vào bảng user:
    a/ collection này có tác dụng khi hệ thống ehr gửi thông tin bệnh nhân qua (firstname, lastname, dateOfBirth, gender, identityCardNumber, ethnicity), thì hệ thống sẽ search trong db, nếu có thì sẽ lấy _id trong collection user của user đó để truy vấn tới health record của họ

    b/ Thực hiện file addUser.js để thêm 1 mảng các user.

2. Thêm health record cho 1 user:
    a/ Mở file excel để có các thông tin về health record và id của bệnh nhân
        Copy health record từ excel và paste vào file recordData.js , sau đó lưu lại
        chạy file storeHealthRecord.js để lưu 1 record vào collection record.
        mỗi lần chạy chỉ lưu được 1 record.
        
        NOTE: CHÚ Ý TỚI DÒNG module.exports ở dưới cùng, nếu không có dòng đó hoặc bỏ dòng đó lên trên đầu thì sẽ export ra undefine

    b/ hoặc import 2 collection user và record
