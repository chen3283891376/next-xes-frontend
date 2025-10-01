import * as React from 'react';
import { Avatar, Badge, Button, Card, Notification, Space, Tooltip } from '@douyinfe/semi-ui-19';
import { processEmojiReplace, processLinkReplace } from '@/utils';
import DOMPurify from 'dompurify';

import type { CommentDataItem } from '@/interfaces/message';
import CommentBox from '../common/CommentBox';

const CommentCard = ({
    message,
    className = '',
    onRead = () => {},
}: {
    message: CommentDataItem;
    className?: string;
    onRead: () => void;
}) => {
    const [isShow, setIsShow] = React.useState<boolean>(true);
    const [isShowComment, setIsShowComment] = React.useState<boolean>(false);
    const [needRead, setNeedRead] = React.useState<boolean>(message.read_at == '');
    const sendUserLink = `/space/${message.send_user_id}/home`;

    const onClickRead = async () => {
        await fetch('/api/messages/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: 1, id: message.id }),
        });
        setNeedRead(false);
        Notification.success({
            title: '已阅读',
            duration: 1,
        });
        onRead();
    };

    return (
        <>
            <Card className={className}>
                <div className="flex items-center justify-between" onClick={needRead ? onClickRead : () => {}}>
                    <Badge
                        type="danger"
                        style={{ display: !needRead ? 'none' : 'inline-block' }}
                        position="leftTop"
                        dot
                    >
                        <a href={sendUserLink} target="_blank" style={{ alignSelf: 'flex-start' }}>
                            <Avatar
                                alt={message.send_username}
                                src={message.send_user_avatar_path}
                                sx={{ width: 50, height: 50 }}
                            />
                        </a>
                    </Badge>
                    <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                        <div style={{ display: 'block', paddingBottom: '5px' }}>
                            <a href={sendUserLink} target="_blank" style={{ fontSize: '18px' }}>
                                {message.send_username}
                            </a>
                            {message.content.sub == null && (
                                <div style={{ display: 'inline' }}>
                                    <span style={{ color: 'grey', fontSize: 'small', marginLeft: '5px' }}>
                                        评论了你的作品：
                                    </span>
                                    <a
                                        href={message.topic.link}
                                        target="_blank"
                                        style={{ textDecoration: 'none', fontSize: '15px' }}
                                    >
                                        {message.topic.text}
                                    </a>
                                </div>
                            )}
                            {message.content.sub != null && (
                                <div style={{ display: 'inline' }}>
                                    <span style={{ color: 'grey', fontSize: 'small', marginLeft: '5px' }}>
                                        回复了你的评论：
                                    </span>
                                    <div
                                        style={{
                                            display: 'inline',
                                            color: 'black',
                                            textDecoration: 'none',
                                            fontSize: '15px',
                                        }}
                                        ref={node => {
                                            if (node) {
                                                node.innerHTML = processEmojiReplace(
                                                    // @ts-ignore  // 这里ide有bug
                                                    DOMPurify.sanitize(message.content.sub.content),
                                                    // @ts-ignore
                                                    message.content.sub.emojis,
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div
                            style={{
                                display: 'block',
                                color: 'black',
                                textDecoration: 'none',
                                paddingBottom: '5px',
                            }}
                            ref={node => {
                                if (node) {
                                    node.innerHTML = processLinkReplace(
                                        processEmojiReplace(
                                            DOMPurify.sanitize(message.content.main.content),
                                            message.content.main.emojis,
                                        ),
                                        message.content.main.links,
                                    );
                                }
                            }}
                        />
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
                            <Button
                                size="small"
                                onClick={async () => {
                                    await fetch('/api/messages/delete', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ category: message.category, id: message.id }),
                                    });
                                    Notification.success({
                                        title: '删除成功',
                                        duration: 1,
                                    });
                                    setIsShow(false);
                                }}
                            >
                                删除
                            </Button>
                            <Button
                                size="small"
                                onClick={() => {
                                    setIsShowComment(true);
                                }}
                            >
                                {message.has_reply ? '已回复' : '回复'}
                            </Button>
                        </div>
                    </div>
                    <Tooltip title={message.topic.text}>
                        <a className="ms-auto" href={message.topic.link} style={{ alignSelf: 'flex-start' }}>
                            <img
                                src={message.topic.thumbnail}
                                alt={message.topic.text}
                                width={107}
                                height={80}
                                style={{ borderRadius: '6px', border: '1px solid #afafaf' }}
                            />
                        </a>
                    </Tooltip>
                </div>
                <CommentBox
                    isShow={isShowComment}
                    setIsShow={setIsShowComment}
                    topic_id={message.topic_id}
                    comment_id={message.comment_id}
                />
            </Card>
        </>
    );
};

export default CommentCard;
