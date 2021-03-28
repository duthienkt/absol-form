# Định nghĩa

Các input tương ứng với literal

1 form tương đương với struct
Các form bên trong được coi như 1 trường của struct đó, trường này kiểu struct

Khác với form, template chỉ là layout, định nghĩa cho phần tổ chức layout, các input phía trong sẽ trở thành 1 trường của
form chứa template đó, nói cách khác template là 1 layout bố trí sẵn input trên đó

Nếu sửa form, toàn bộ các form chứa con là form đó sẽ đổi theo, không thể edit form con

Nếu sửa template, những form dùng template đó không thay đổi, bởi vì template chỉ là khuôn mẫu, dùng để điền vào form đang 
edit, lúc lưu thì không lưu template nào đã dùng.

Template cần : layout và có thể có các input, các input này có tên, tạo ra thì form sẽ nhận thêm các trường này

Form(Struct): layout, input, form con được đặt tên, tên này chính là các property của bản thân form đó


## Quy đổi kiểu, giá trị

| Compoment          |  Kiểu           |   Ghi chú             |
|====================|=================|=======================|







