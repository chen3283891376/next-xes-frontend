import * as React from 'react';
import FollowCard from './FollowCard';
import { v4 as uuidV4 } from 'uuid';

import type { FollowMessageInfo } from '@/interfaces/message';

const FollowList = ({ messages, onRead = () => {} }: { messages: FollowMessageInfo; onRead?: () => void }) => {
    const cards = messages.data.data.map((message, index) => (
        <FollowCard key={uuidV4()} className={index >= 1 ? 'mt-2' : ''} message={message} onRead={onRead} />
    ));

    return <div className="w-full flex flex-col gap-2">{cards}</div>;
};

export default FollowList;
