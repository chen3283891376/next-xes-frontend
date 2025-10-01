'use client';
import React from 'react';
import { Avatar, BackTop, Badge, Button, Dropdown, IconButton, Nav, Typography } from '@douyinfe/semi-ui-19';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';

import type { UserInfo } from '@/interfaces/user';
import { IconBellStroked, IconCommentStroked, IconFollowStroked } from '@douyinfe/semi-icons';
import { MessageData } from '@/interfaces/message';

const AppNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState<UserInfo['data'] | null>(null);
    const [userAvatar, setUserAvatar] = React.useState<string>('');
    const [messageData, setMessageData] = React.useState<MessageData | null>(null);
    const [totalMessageCount, setTotalMessageCount] = React.useState(0);

    const logoutEvent = async () => {
        await fetch('/passport/logout');
        location.reload();
    };

    React.useEffect(() => {
        setIsLoggedIn(document.cookie.includes('is_login=1;') || false);
        const fetchData = async () => {
            if (document.cookie.includes('is_login=1;')) {
                const response = await fetch('/api/user/info');
                const userData: UserInfo = await response.json();
                setUserInfo(userData.data);
                setUserAvatar(userData.data.avatar_path);

                const messageResponse = await fetch(`/api/messages/overview`);
                const messageResponseData: MessageData = await messageResponse.json();
                setMessageData(messageResponseData);
                setTotalMessageCount(messageResponseData.data.reduce((acc, cur) => acc + cur.count, 0));
            }
        };

        fetchData();
    }, []);
    return (
        <div style={{ width: '100%' }}>
            <Nav
                mode="horizontal"
                renderWrapper={({ itemElement, isSubNav, isInSubNav, props }) => {
                    const routerMap = {
                        discover: '/discover',
                        about: '/about',
                    };
                    return (
                        <Link
                            style={{ textDecoration: 'none' }}
                            // @ts-ignore
                            href={routerMap[props.itemKey]}
                        >
                            {itemElement}
                        </Link>
                    );
                }}
                items={[
                    { itemKey: 'discover', text: '发现' },
                    { itemKey: 'about', text: '关于' },
                ]}
                footer={
                    <div className="flex gap-4 mr-4">
                        <SearchInput />
                        {!isLoggedIn ? (
                            <Link href="/login">登录</Link>
                        ) : (
                            <div className="flex gap-2">
                                <Dropdown
                                    render={
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon={<IconCommentStroked />}>
                                                <Link href="/message/1">
                                                    <Badge count={messageData?.data[0].count}>评论和回复</Badge>
                                                </Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item icon={<IconFollowStroked />}>
                                                <Link href="/message/5">
                                                    <Badge count={messageData?.data[3].count}>关注</Badge>
                                                </Link>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    }
                                >
                                    {/* <Badge count={totalMessageCount}>
                                        <IconBellStroked className='mt-1' />
                                    </Badge> */}
                                    <IconBellStroked className="mt-1" />
                                </Dropdown>

                                <Dropdown
                                    render={
                                        <Dropdown.Menu>
                                            <Dropdown.Item>
                                                <Link href={`/space/${userInfo?.id}/home`}>个人空间</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                                <Link href="/userInfo">个人信息</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={logoutEvent}>
                                                {/* <Link href="/logout">退出登录</Link> */}
                                                退出登录
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    }
                                >
                                    {/* <Avatar size="small" border src={userAvatar} /> */}
                                    用户
                                </Dropdown>
                            </div>
                        )}
                        <Dropdown
                            render={
                                <Dropdown.Menu>
                                    <Dropdown.Item>图形化编程</Dropdown.Item>
                                    <Dropdown.Item>Python</Dropdown.Item>
                                    <Dropdown.Item>C++</Dropdown.Item>
                                </Dropdown.Menu>
                            }
                        >
                            创作
                        </Dropdown>
                    </div>
                }
                header={{
                    text: (
                        <Typography.Title
                            className="cursor-pointer"
                            onClick={() => {
                                window.location.href = '/';
                            }}
                            heading={5}
                        >
                            XesCoding
                        </Typography.Title>
                    ),
                }}
            />
            <BackTop />
        </div>
    );
};
export default AppNavbar;
