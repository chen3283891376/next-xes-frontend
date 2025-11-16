import * as React from 'react';
import { Work } from '@/interfaces/work';
import WorkCard from './WorkCard';

const WorkList = ({
    works,
    className = '',
    enableRemoved = true,
    WorkCardInterface = WorkCard,
}: {
    works: Work[];
    className?: string;
    enableRemoved?: boolean;
    WorkCardInterface?: ({ work }: { work: Work }) => React.JSX.Element | null;
}) => {
    const cards = works.map((work: Work) => {
        if (work === null) {
            return null;
        } else if (work.removed && enableRemoved) {
            return null;
        } else {
            return <WorkCardInterface key={work.id} work={work} />;
        }
    });

    return (
        <div className={`m-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 ${className}`}>
            {cards}
        </div>
    );
};

export default WorkList;
