//tất cả các key không được trùng nhau
var mpo_sample_data = {
    editor: {
        properties: [
            {
                type: 'image',
                name: 'Ảnh đại diện',
                key: 'avatar',
                action: 'single-choice',
                items: Array(30).fill(null).map((u, i) => (
                    {
                        src: 'https://absol.cf/avatar/0' + (i + 100) + '.jpg',
                        value: i
                    }
                ))
            },
            {
                type: 'text',
                name: 'Tên',
                key: 'name',
                action: 'input'
            },
            {
                type: 'text',
                name: 'MSSV',
                key: 'stid',
                action: 'input'
            },
            {
                type: 'text',
                name: 'Giới tính',
                key: 'sx',
                action: 'single-choice',
                items: [
                    {
                        text: "Nam",
                        value: 1
                    },
                    {
                        text: "Nữ",
                        value: 0
                    }
                ]

            },
            {
                type: 'group',
                name: 'Thông tin liên lạc',
                key: 'contact',
                properties: [
                    {
                        type: 'text',
                        long: true,
                        key: 'address',
                        name: 'Địa chỉ',
                        action: 'input'
                    },
                    {
                        type: 'text',
                        name: 'SĐT',
                        key: 'phone',
                        action: 'input'
                    }
                ]
            },
            {
                type: 'group',
                name: 'Nguời bảo hộ',
                key: 'tutor',
                properties: [
                    {
                        type: 'text',
                        action: 'input',
                        name: 'Địa chỉ',
                        long: true,
                        fName: 'Địa chỉ(người bảo hộ)',
                        key: 'tutor_address'
                    },
                    {
                        type: 'text',
                        name: 'SĐT(người bảo hộ)',
                        key: 'tutor_phone',
                        action: 'input'
                    }
                ]
            }
        ]
    }
}