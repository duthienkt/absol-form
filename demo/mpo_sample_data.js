//tất cả các id không được trùng nhau
var mpo_sample_data = {
    editor: {
        title: 'Sơ yếu lý lịch',
        properties: [
            {
                type: 'image',
                name: 'Ảnh đại diện',
                id: 'avatar',
                // action: 'input',
                action: 'multi-choice',
                items: Array(30).fill(null).map((u, i) => 'https://absol.cf/avatar/0' + (i + 151) + '.jpg'),
                src: 'https://absol.cf/avatar/0' + (0 + 151) + '.jpg',
                style:{
                    maxWidth: '200px',
                    maxHeight: '200px'
                }
            },
            {
                type: 'text',
                name: 'Tên',
                id: 'name',
                action: 'input',
                placeholder: "Nguyễn Văn An"
            },
            {
                type: 'text',
                name: 'MSSV',
                id: 'stid',
                action: 'input',
                value: '5130abcd'
            },
            {
                type: 'text',
                name: 'Giới tính',
                id: 'sx',
                action: 'single-choice',
                items: [
                    'Nam', "Nữ"
                ]

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
            }
        ]
    }
}