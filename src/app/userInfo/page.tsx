'use client';
import React from 'react';
import { Avatar, Typography, Table } from '@douyinfe/semi-ui';

import type { UserInfo } from '@/interfaces/user';
import type { SpaceProfile } from '@/interfaces/space';

interface InfoItem {
    key: string;
    attribute: string;
    value: React.ReactNode;
}

export default function UserInfoPage() {
    const [userData, setUserData] = React.useState<UserInfo['data'] | null>(null);
    const [spaceData, setSpaceData] = React.useState<SpaceProfile['data'] | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let ignore = false;

        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const infoResponse = await fetch('/api/user/info');
                const infoResponseData: UserInfo = await infoResponse.json();
                setUserData(infoResponseData.data);

                const spaceProfileResponse = await fetch(`/api/space/profile?user_id=${infoResponseData.data.user_id}`);
                const spaceProfileData: SpaceProfile = await spaceProfileResponse.json();
                setSpaceData(spaceProfileData.data);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!ignore) {
            fetchUserInfo();
        }

        return () => {
            ignore = true;
        };
    }, []);

    if (loading) {
        return <Typography.Text>加载中...</Typography.Text>;
    }

    if (!userData || !spaceData) {
        return <Typography.Text>获取用户信息失败</Typography.Text>;
    }

    const sexId = userData.sex;
    const sexName: string = ['男', '女', '未知'][Number(sexId) - 1] || '未知';

    const tableData: InfoItem[] = [
        { key: 'user_id', attribute: '用户 ID', value: userData.user_id },
        { key: 'name', attribute: '用户名（他人不可见）', value: userData.name },
        { key: 'realname', attribute: '真名', value: userData.realname },
        { key: 'nickname', attribute: '昵称（他人不可见）', value: userData.nickname },
        { key: 'en_name', attribute: '英文名（他人不可见）', value: userData.en_name },
        { key: 'sex', attribute: '性别', value: sexName },
        {
            key: 'avatar',
            attribute: '头像',
            value: <Avatar src={userData.avatar_path} />,
        },
        { key: 'create_time', attribute: '创建时间（他人不可见）', value: userData.create_time },
        { key: 'grade_name', attribute: '年级名称（他人不可见）', value: userData.grade_name },
        { key: 'signature', attribute: '个人签名', value: spaceData.signature },
        { key: 'follows', attribute: '关注数量', value: spaceData.follows },
        { key: 'fans', attribute: '粉丝数量', value: spaceData.fans },
    ];

    const columns = [
        {
            title: '属性',
            dataIndex: 'attribute',
            key: 'attribute',
            width: '30%',
        },
        {
            title: '值',
            dataIndex: 'value',
            key: 'value',
            width: '70%',
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <Typography.Title heading={2} style={{ marginBottom: 24 }}>
                个人信息展示页面
            </Typography.Title>

            <Table<InfoItem>
                columns={columns}
                dataSource={tableData}
                pagination={false}
                style={{ width: '80%', maxWidth: 800 }}
            />

            <Typography.Paragraph style={{ marginTop: 24, fontStyle: 'italic' }}>
                「国之殇，未敢忘。——尸体的神韵」
            </Typography.Paragraph>
        </div>
    );
}
