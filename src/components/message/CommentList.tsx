import * as React from 'react';
import CommentCard from './CommentCard';
import { v4 as uuidV4 } from 'uuid';

import type { CommentMessageInfo } from '@/interfaces/message';

const CommentList = ({ messages, onRead = () => {} }: { messages: CommentMessageInfo; onRead?: () => void }) => {
    const cards = messages.data.data.map((message, index) => (
        <CommentCard key={uuidV4()} className={index >= 1 ? 'mt-2' : ''} message={message} onRead={onRead} />
    ));

    return <div className="w-full flex flex-col gap-2">{cards}</div>;
};

export default CommentList;
