import * as React from 'react';

import type { FollowMessageInfo } from '@/interfaces/message';
import FollowCard from './FollowCard';

const FollowList = ({ messages, onRead = () => {} }: { messages: FollowMessageInfo; onRead?: () => void }) => {
    const cards = messages.data.data.map((message, index) => (
        <FollowCard className={index >= 1 ? 'mt-2' : ''} message={message} onRead={onRead} />
    ));

    return <div className="w-full flex flex-col gap-2">{cards}</div>;
};

export default FollowList;
