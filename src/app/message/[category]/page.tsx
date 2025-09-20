'use client';
import * as React from 'react';
import { Badge, Layout, Nav, Typography } from '@douyinfe/semi-ui';
import { IconCommentStroked, IconFollowStroked } from '@douyinfe/semi-icons';
import CommentList from '@/components/message/CommentList';
import FollowList from '@/components/message/FollowList';
import { Pagination } from '@/components/common/Pagination';

import type { MessageData } from '@/interfaces/message';
import { OnSelectedData } from '@douyinfe/semi-ui/lib/es/navigation';

interface PageParams {
    params: Promise<{
        category: string;
    }>;
}
const { Sider, Content } = Layout;

export default function MessagePage({ params }: PageParams) {
    const { category } = React.use(params);

    const readMessages = async () => {
        const messageResponse = await fetch(`/api/messages/overview`);
        const messageResponseData: MessageData = await messageResponse.json();
        setMessageData(messageResponseData);
    };

    const [messages, setMessages] = React.useState<React.JSX.Element>(
        <Typography.Title heading={6}>加载中...</Typography.Title>,
    );

    const [currentTab, setCurrentTab] = React.useState(category);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [messageData, setMessageData] = React.useState<MessageData | null>(null);

    React.useEffect(() => {
        let ignore = false;
        if (!document.cookie.includes('is_login=1;')) {
            location.href = '/login';
        }

        const func = async () => {
            console.log(currentTab, typeof currentTab);
            const response = await fetch(`/api/messages?category=${currentTab}&page=${currentPage}&per_page=10`);
            const responseData = await response.json();

            await readMessages();

            if (responseData.data['total'] === 0) {
                setMessages(<Typography.Title heading={6}>暂无消息</Typography.Title>);
            } else {
                setMessages(
                    <div className="w-full flex flex-col items-center justify-center gap-4">
                        {currentTab === '1' && (
                            <CommentList messages={responseData} onRead={readMessages}></CommentList>
                        )}
                        {currentTab === '5' && <FollowList messages={responseData} onRead={readMessages}></FollowList>}
                        {responseData.data.total > 10 && (
                            <Pagination
                                pageCount={Math.ceil(responseData.data.total / 10)}
                                value={currentPage}
                                handlePageChange={page => {
                                    setCurrentPage(page);
                                }}
                            />
                        )}
                    </div>,
                );
            }
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [currentTab, currentPage]);

    const handleTabChange = (eventKey: string) => {
        if (eventKey !== currentTab) {
            history.pushState(null, '', `/message/${eventKey}`);
            window.scrollTo(0, 0);
            setCurrentTab(eventKey);
            setCurrentPage(1);
        }
    };

    return (
        <Layout>
            {/* <Grid
                        size={{ xs: 12, lg: 2 }}
                        sx={{
                            position: 'sticky',
                            top: '10px',
                            height: 'fit-content',
                            mb: 2,
                            zIndex: 1,
                        }}
                    >
                        <Card sx={{ p: 2, boxShadow: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                消息中心
                            </Typography>
                            <List component="nav">
                                <ListItem disablePadding>
                                    <ListItemButton selected={currentTab === '1'} onClick={() => handleTabChange('1')}>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center">
                                                    评论和回复
                                                    <Badge
                                                        color="error"
                                                        badgeContent={messageData?.data[0].count}
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton selected={currentTab === '5'} onClick={() => handleTabChange('5')}>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center">
                                                    关注
                                                    <Badge
                                                        color="error"
                                                        badgeContent={messageData?.data[2].count}
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid> */}
            <Sider>
                <Nav
                    className="h-[300px]"
                    onSelect={(data: OnSelectedData) => {
                        handleTabChange(data.itemKey as string);
                    }}
                    items={[
                        {
                            text: '评论和回复',
                            itemKey: '1',
                            icon: (
                                <Badge count={messageData?.data[0].count}>
                                    <IconCommentStroked />
                                </Badge>
                            ),
                        },
                        {
                            text: '关注',
                            itemKey: '5',
                            icon: (
                                <Badge count={messageData?.data[2].count}>
                                    <IconFollowStroked />
                                </Badge>
                            ),
                        },
                    ]}
                    footer={{
                        collapseButton: true,
                    }}
                    selectedKeys={[currentTab]}
                />
            </Sider>
            <Content>{messages}</Content>
        </Layout>
    );
}
