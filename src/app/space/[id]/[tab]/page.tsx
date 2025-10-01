'use client';
import React from 'react';
import { Avatar, Button, Divider, Layout, Nav, Space, Tabs, Toast, Typography } from '@douyinfe/semi-ui-19';
import SpaceCoverPage from '../../SpaceCoverPage';
import { SpaceProfile } from '@/interfaces/space';
import { SpaceFavoritesPage } from '../../SpaceFavoritesPage';
import { SpaceSocialPage } from '../../SpaceSocialPage';
import { SpaceHomePage } from '../../SpaceHomePage';
import { SpaceProjectsPage } from '../../SpaceProjectsPage';
import { OnSelectedData } from '@douyinfe/semi-ui-19/lib/es/navigation';
import { IconCode, IconFollowStroked, IconHeartStroked, IconHome, IconImage } from '@douyinfe/semi-icons';

const navItems = ['home', 'cover', 'projects', 'favorites','social']

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
    const [currentTab, setCurrentTab] = React.useState(tab);

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
        Toast.success(!userFollowed ? '关注成功' : '取消关注成功');
    };

    return (
        <div className="m-4 mt-2">
            <div className="flex justify-between items-center">
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
                        {userFollowed ? '已关注' : '关注'}
                    </Button>
                )}
            </div>
            <Divider />

            <Layout>
                <Layout.Sider className="mt-2">
                    <Nav
                        defaultIsCollapsed
                        selectedKeys={[navItems.indexOf(currentTab)]}
                        onSelect={(data: OnSelectedData) => {
                            history.pushState(null, '', `/space/${id}/${navItems[data.itemKey as number]}`);
                            setCurrentTab(navItems[data.itemKey as number]);
                        }}
                        items={[
                            {
                                itemKey: 0,
                                icon: <IconHome />,
                                text: '主页',
                            },
                            {
                                itemKey: 1,
                                icon: <IconImage />,
                                text: '封面',
                            },
                            {
                                itemKey: 2,
                                icon: <IconCode />,
                                text: '作品',
                            },
                            {
                                itemKey: 3,
                                icon: <IconHeartStroked />,
                                text: '收藏',
                            },
                            {
                                itemKey: 4,
                                icon: <IconFollowStroked />,
                                text: '社交',
                            },
                        ]}
                        footer={{
                            collapseButton: true
                        }}
                    />
                </Layout.Sider>
                <Layout.Content className="m-2 mt-2">
                    {currentTab === 'home' && <SpaceHomePage userId={id} />}
                    {currentTab === 'cover' && <SpaceCoverPage userId={id} />}
                    {currentTab === 'projects' && <SpaceProjectsPage userId={id} />}
                    {currentTab === 'favorites' && <SpaceFavoritesPage userId={id} />}
                    {currentTab ==='social' && <SpaceSocialPage userId={id} />}
                </Layout.Content>
            </Layout>
        </div>
    );
}
