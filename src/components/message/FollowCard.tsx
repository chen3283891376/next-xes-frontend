import * as React from 'react';

import type { FollowDataItem } from '@/interfaces/message';
import { Avatar, Badge, Button, Card, Notification, Space } from '@douyinfe/semi-ui';

const FollowCard = ({
    message,
    className = '',
    onRead,
}: {
    message: FollowDataItem;
    className?: string;
    onRead: () => void;
}) => {
    const [userFollowed, setUserFollowed] = React.useState(message.follow_status === 1);
    const [needRead, setNeedRead] = React.useState<boolean>(message.read_at == '');
    const userLink = `/space/${message.send_user_id}/home`;

    const onClickRead = async () => {
        await fetch('/api/messages/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: 5, id: message.id }),
        });
        setNeedRead(false);
        Notification.success({
            title: '已阅读',
            duration: 1.5,
        });
        onRead();
    };

    const onClickFollow = async () => {
        await fetch('/api/space/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followed_user_id: message.send_user_id, state: !userFollowed }),
        });
        setUserFollowed(!userFollowed);
        // console.log(userFollowed);
        Notification.success({
            title: userFollowed ? '取消关注' : '关注成功',
            duration: 1.5,
        });
    };

    return (
        <>
            <Card className={className}>
                <div className="w-full flex justify-between items-center" onClick={needRead ? onClickRead : () => {}}>
                    <Space align="center" spacing={2}>
                        <Badge
                            type="danger"
                            style={{ display: !needRead ? 'none' : 'inline-block' }}
                            position="leftTop"
                            dot
                        >
                            <a href={userLink} target="_blank">
                                <Avatar
                                    alt={message.send_username}
                                    src={message.send_user_avatar_path}
                                    sx={{ width: 50, height: 50 }}
                                />
                            </a>
                        </Badge>
                        <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                            <a href={userLink} target="_blank" style={{ marginRight: '31px', fontSize: '18px' }}>
                                {message.send_username}
                            </a>
                            <div style={{ fontSize: '14px' }}>{message.signature}</div>
                            <div>
                                <span
                                    style={{
                                        color: 'grey',
                                        fontSize: '12px',
                                        marginRight: '10px',
                                    }}
                                >
                                    {message.created_at}
                                </span>
                            </div>
                        </div>
                    </Space>
                    <Button
                        theme={userFollowed ? 'light' : 'solid'}
                        type={userFollowed ? undefined : 'secondary'}
                        onClick={onClickFollow}
                    >
                        {userFollowed ? '已关注' : '关注'}
                    </Button>
                </div>
            </Card>
        </>
    );
};

export default FollowCard;
