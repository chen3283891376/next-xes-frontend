'use client';
import React from 'react';
import { Avatar, Button, Space, Tabs, Toast, Typography } from '@douyinfe/semi-ui';
import SpaceCoverPage from '../../SpaceCoverPage';
import { SpaceProfile } from '@/interfaces/space';
import { SpaceFavoritesPage } from '../../SpaceFavoritesPage';
import { SpaceSocialPage } from '../../SpaceSocialPage';
import { SpaceHomePage } from '../../SpaceHomePage';
import { SpaceProjectsPage } from '../../SpaceProjectsPage';

interface PageParams {
    params: Promise<{
        id: string;
        tab: string;
    }>;
}

export default function SpaceTabPage({ params }: PageParams) {
    const { id, tab } = React.use(params);
    const [spaceProfile, setSpaceProfile] = React.useState<SpaceProfile['data']>();
    const [userFollowed, setUserFollowed] = React.useState(false);

    React.useEffect(() => {
        const fetchSpaceProfile = async () => {
            const response = await fetch(`/api/space/profile?user_id=${id}`);
            const data: SpaceProfile = await response.json();
            setSpaceProfile(data.data);
            setUserFollowed(data.data.is_follow);
        };
        fetchSpaceProfile();
    }, [id]);

    const onClickFollow = async () => {
        await fetch('/api/space/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followed_user_id: id, state: !userFollowed }),
        });
        setUserFollowed(!userFollowed);
        Toast.success(userFollowed ? '关注成功' : '取消关注成功');
    };

    return (
        <div className="m-4 mt-2">
            <div className="flex justify-between items-center mb-4">
                <Space>
                    <Avatar size="extra-large" src={spaceProfile?.avatar_path} />
                    <div style={{ textAlign: 'left' }}>
                        <Typography.Title heading={5}>
                            {spaceProfile?.realname}
                            <Typography.Text type="secondary">({id})</Typography.Text>
                        </Typography.Title>
                        <Typography.Text type="primary" className="mt-1">
                            关注：{spaceProfile?.follows} &nbsp; 粉丝：{spaceProfile?.fans}
                        </Typography.Text>
                    </div>
                </Space>
                {!spaceProfile?.is_my && (
                    <Button
                        size="large"
                        onClick={onClickFollow}
                        theme={userFollowed ? 'light' : 'solid'}
                        type={userFollowed ? undefined : 'secondary'}
                    >
                        {spaceProfile?.is_follow ? '已关注' : '关注'}
                    </Button>
                )}
            </div>

            <div className="mt-5 flex justify-center w-full">
                <Tabs
                    defaultActiveKey={tab}
                    keepDOM={false}
                    onChange={key => {
                        history.pushState(null, '', `/space/${id}/${key}`);
                    }}
                    className="w-full flex flex-col items-center"
                >
                    <Tabs.TabPane tab="主页" itemKey="home">
                        <SpaceHomePage userId={id} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="封面" itemKey="cover">
                        <SpaceCoverPage userId={id} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="作品" itemKey="projects">
                        <SpaceProjectsPage userId={id} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="收藏" itemKey="favorites">
                        <SpaceFavoritesPage userId={id} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="社交" itemKey="social">
                        <SpaceSocialPage userId={id} />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </div>
    );
}
