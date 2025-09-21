// 预计写project页面的时候会再增强一下（虽然看起来遥遥无期）
import * as React from 'react';
import { Button, Input, Notification } from '@douyinfe/semi-ui';

import type { ErrorResponse } from '@/interfaces/common';

const CommentBox = ({
    topic_id,
    comment_id,
    isShow,
    setIsShow,
}: {
    topic_id: string;
    comment_id: number;
    isShow: boolean;
    setIsShow: (value: boolean) => void;
}) => {
    const [comment, setComment] = React.useState('');

    const onCLickComment = async () => {
        if (comment.trim() === '') {
            Notification.error({
                title: '评论内容不能为空',
                duration: 3,
            });
            return;
        }
        const response = await fetch('/api/comments/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appid: 1001108,
                comment_from: 'message',
                content: comment,
                target_id: comment_id,
                topic_id: topic_id,
            }),
        });
        if (response.ok) {
            setIsShow(false);
            setComment('');
            Notification.success({
                title: '评论成功',
                duration: 3,
            });
        } else {
            const responseData: ErrorResponse = await response.json();
            Notification.error({
                title: '评论失败',
                content: responseData.message,
                duration: 3,
            });
        }
    };

    return (
        <div style={{ display: isShow ? 'block' : 'none', padding: '10px' }}>
            <Input
                placeholder="评论"
                width={'100%'}
                value={comment}
                onChange={(value, e) => {
                    setComment(value);
                }}
                suffix={
                    <Button variant="contained" color="primary" onClick={onCLickComment}>
                        提交
                    </Button>
                }
            />
        </div>
    );
};

export default CommentBox;
