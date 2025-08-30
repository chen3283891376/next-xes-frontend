import * as React from 'react';
import { Work } from '@/interfaces/work';
import WorkCard from './WorkCard';

const WorkList = ({ works, className = '' }: { works: Work[]; className?: string }) => {
    const cards = works.map((work: Work) => {
        if (work === null) {
            return null;
        } else if (work.removed) {
            return null;
        } else {
            return <WorkCard key={work.id} work={work} />;
        }
    });

    return (
        <div className={`m-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 ${className}`}>
            {cards}
        </div>
    );
};

export default WorkList;
