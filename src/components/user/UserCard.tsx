import React from 'react';
import { Avatar, Tooltip, Card, Typography, Button, Divider } from '@douyinfe/semi-ui';

import type { SimpleUserInfo } from '@/interfaces/user';

const HorizontalUserCard = ({
    user,
    className = '',
    children = undefined,
}: {
    user: SimpleUserInfo;
    className?: string;
    children?: React.ReactNode;
}) => {
    const [userFollowed, setUserFollowed] = React.useState(user.is_follow || user.is_followed);
    const userLink = `/space/${user.id}/home`;

    const onClickFollow = async () => {
        await fetch('/api/space/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followed_user_id: user.user_id, state: !userFollowed }),
        });
        setUserFollowed(!userFollowed);
    };

    return (
        // <Card className={className} style={{ padding: '10px', display: 'flex' }}>
        <Card className={`${className} padding-10 flex`}>
            <div className='flex justify-between w-full'>
                <Card.Meta
                    avatar={<Avatar size="large" src={user.avatar_path} alt={user.realname} />}
                    title={
                        <Typography.Text link onClick={() => window.open(userLink, '_blank')}>
                            {user.user_id === undefined
                                ? '666这入关注了undefined先生'
                                : user.realname.replace(/<em>|<\/em>/g, '')}
                        </Typography.Text>
                    }
                    description={
                        <>
                            <div style={{ fontSize: '14px' }}>
                                <span>关注：{user.follows}  </span>
                                <span>粉丝：{user.fans}  </span>
                                <span>UID：{user.id}  </span>
                            </div>
                            <Typography>{user.signature}</Typography>
                        </>
                    }
                />

                <Button
                    onClick={() => onClickFollow()}
                    theme={userFollowed ? 'light' : 'solid'}
                    type={userFollowed ? undefined : 'secondary'}
                >
                    {userFollowed ? '已关注' : '关注'}
                </Button>
            </div>
            {children ? (
                <>
                    <Divider />
                    {children}
                </>
            ) : null}
        </Card>
    );
};

const SmallUserCard = ({ user }: { user: SimpleUserInfo }) => {
    const userLink = `/space/${user.id}/home`;

    return (
        <Tooltip content={`粉丝：${user.fans} 关注：${user.follows}`}>
            <Card>
                <Card.Meta
                    avatar={<Avatar size="small" src={user.avatar_path} alt={user.realname} />}
                    title={
                        <Typography.Text link style={{ fontSize: '20px' }} onClick={() => window.open(userLink, '_blank')}>
                            {user.realname}
                        </Typography.Text>
                    }
                />
            </Card>
        </Tooltip>
    );
};

export { HorizontalUserCard, SmallUserCard };
