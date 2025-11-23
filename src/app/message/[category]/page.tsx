'use client';
import * as React from 'react';
import { Badge, Layout, Nav, Typography } from '@douyinfe/semi-ui-19';
import { IconCommentStroked, IconFollowStroked } from '@douyinfe/semi-icons';
import CommentList from '@/components/message/CommentList';
import FollowList from '@/components/message/FollowList';
import { Pagination } from '@/components/common/Pagination';

import type { MessageData } from '@/interfaces/message';
import { OnSelectedData } from '@douyinfe/semi-ui-19/lib/es/navigation';

interface PageParams {
    params: Promise<{
        category: string;
    }>;
}
const { Sider, Content } = Layout;

const getCategoryFromUrl = () => {
    const pathname = window.location.pathname;
    const categoryMatch = pathname.match(/\/message\/(\d+)/);
    return categoryMatch ? categoryMatch[1] : '1';
};

export default function MessagePage({ params }: PageParams) {
    const readMessages = async () => {
        const messageResponse = await fetch(`/api/messages/overview`);
        const messageResponseData: MessageData = await messageResponse.json();
        setMessageData(messageResponseData);
    };

    const [messages, setMessages] = React.useState<React.JSX.Element>(
        <Typography.Title heading={6}>加载中...</Typography.Title>,
    );
    const [currentTab, setCurrentTab] = React.useState(() => getCategoryFromUrl());
    const [currentPage, setCurrentPage] = React.useState(1);
    const [messageData, setMessageData] = React.useState<MessageData | null>(null);

    React.useEffect(() => {
        const initParams = async () => {
            const { category } = await params;
            const urlCategory = getCategoryFromUrl();
            if (!urlCategory) {
                setCurrentTab(category);
                history.replaceState(null, '', `/message/${category}`);
            }
        };
        initParams();
    }, [params]);

    const fetchMessages = async () => {
        try {
            if (!document.cookie.includes('is_login=1;')) {
                location.href = '/login';
                return;
            }

            const response = await fetch(`/api/messages?category=${currentTab}&page=${currentPage}&per_page=10`);
            const responseData = await response.json();

            await readMessages();

            if (responseData.data?.total === 0) {
                setMessages(<Typography.Title heading={6}>暂无消息</Typography.Title>);
            } else {
                setMessages(
                    <div className="w-full flex flex-col items-center justify-center gap-4">
                        {currentTab === '1' && (
                            <CommentList messages={responseData} onRead={readMessages}></CommentList>
                        )}
                        {currentTab === '5' && <FollowList messages={responseData} onRead={readMessages}></FollowList>}
                        {responseData.data?.total > 10 && (
                            <Pagination
                                pageCount={Math.ceil(responseData.data.total / 10)}
                                value={currentPage}
                                handlePageChange={setCurrentPage}
                            />
                        )}
                    </div>,
                );
            }
        } catch (err) {
            console.error('请求消息失败', err);
            setMessages(<Typography.Title heading={6}>加载失败，请重试</Typography.Title>);
        }
    };

    const handleTabChange = (eventKey: string) => {
        if (eventKey !== currentTab) {
            setCurrentTab(eventKey);
            setCurrentPage(1);
            history.pushState(null, '', `/message/${eventKey}`);
            window.scrollTo(0, 0);
        }
    };

    React.useEffect(() => {
        fetchMessages();

        const handlePopState = () => {
            const category = getCategoryFromUrl();
            setCurrentTab(category);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [currentTab, currentPage]);

    return (
        <Layout>
            <Sider>
                <Nav
                    onSelect={(data: OnSelectedData) => handleTabChange(data.itemKey as string)}
                    items={[
                        {
                            text: '评论和回复',
                            itemKey: '1',
                            icon: (
                                <Badge count={messageData?.data[0]?.count || 0}>
                                    <IconCommentStroked />
                                </Badge>
                            ),
                        },
                        {
                            text: '关注',
                            itemKey: '5',
                            icon: (
                                <Badge count={messageData?.data[2]?.count || 0}>
                                    <IconFollowStroked />
                                </Badge>
                            ),
                        },
                    ]}
                    footer={{ collapseButton: true }}
                    selectedKeys={[currentTab]}
                />
            </Sider>
            <Content>{messages}</Content>
        </Layout>
    );
}
