//tất cả các id không được trùng nhau
var mpo_sample_data = {
    editor: {
        title: 'Sơ yếu lý lịch',
        properties: [
            {
                type: 'image',
                name: 'Ảnh đại diện',
                id: 'avatar',
                action: 'input',
                // action: 'single-choice',
                items: Array(30).fill(null).map((u, i) => 'https://absol.cf/avatar/0' + (i + 151) + '.jpg'),
                value: ['https://absol.cf/avatar/0' + (5 + 151) + '.jpg'][0],
                style: {
                    maxWidth: '200px',
                    maxHeight: '200px'
                }
            },
            {
                type: 'text',
                name: 'Tên',
                id: 'name',
                action: 'input',
                placeholder: "Nguyễn Văn An",
                value: "Phạm Hùng Quốc"
            },
            {
                type: 'text',
                name: 'Trường',
                id: 'name',
                action: 'const',
                value:"Đại học Bách Khoa Hồ Chí Minh"
            },
            {
                type: 'text',
                name: 'MSSV',
                id: 'stid',
                action: 'input',
                value: '51303858'
            },
            {
                type: 'number',
                name: 'Tuổi',
                id: 'old',
                action: "input"
            },
            {
                type: 'number',
                name: 'Tháng trong năm',
                id: 'months',
                action: "multi-choice",
                values: [],
                items: Array(12).fill(0).map((u, i) => i + 1)
            },
            {
                type: 'text',
                name: 'Giới tính',
                id: 'sx',
                action: 'single-choice',
                items: [
                    'Nam', "Nữ"
                ],
                value: 'Nam'
            },
            {
                type: 'text',
                name: 'Ngôn ngữ',
                id: 'lang',
                action: 'multi-choice',
                items: ['English', 'Tiếng Việt', "Javascript"]
            },
            {
                type: 'group',
                name: 'Thông tin liên lạc',
                id: 'contact',
                properties: [
                    {
                        type: 'text',
                        long: true,
                        id: 'address',
                        name: 'Địa chỉ',
                        action: 'input'
                    },
                    {
                        type: 'text',
                        name: 'SĐT',
                        id: 'phone',
                        action: 'input'
                    }
                ]
            },
            {
                type: 'group',
                name: 'Nguời bảo hộ',
                id: 'tutor',
                properties: [
                    {
                        type: 'text',
                        action: 'input',
                        name: 'Địa chỉ',
                        long: true,
                        fName: 'Địa chỉ(người bảo hộ)',
                        id: 'tutor_address'
                    },
                    {
                        type: 'text',
                        name: 'SĐT(người bảo hộ)',
                        id: 'tutor_phone',
                        action: 'input'
                    }
                ]
            },
            {
                type:'submit',
                name:"Submit"
            }
        ]
    }
}