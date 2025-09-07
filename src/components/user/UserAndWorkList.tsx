import * as React from 'react';
import { HorizontalUserCard } from './UserCard';
import WorkList from '../work/WorkList';

const UserAndWorkList = ({ infos }: { infos: any[] }) => {
    const cards = infos.map((info, index) => (
        <HorizontalUserCard key={info.id} className={index >= 1 ? 'mt-2' : ''} user={info.user}>
            <WorkList works={info.works} />
        </HorizontalUserCard>
    ));

    return <div className="flex flex-col gap-2">{cards}</div>;
};

export { UserAndWorkList };
