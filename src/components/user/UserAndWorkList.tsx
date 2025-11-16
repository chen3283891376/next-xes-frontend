import * as React from 'react';
import { HorizontalUserCard } from './UserCard';
import WorkList from '../work/WorkList';
import { v4 as uuidV4 } from 'uuid';

const UserAndWorkList = ({ infos }: { infos: any[] }) => {
    const cards = infos.map((info, index) => (
        <HorizontalUserCard key={uuidV4()} className={index >= 1 ? 'mt-2' : ''} user={info.user}>
            <WorkList works={info.works} />
        </HorizontalUserCard>
    ));

    return <div className="flex flex-col gap-2">{cards}</div>;
};

export { UserAndWorkList };
