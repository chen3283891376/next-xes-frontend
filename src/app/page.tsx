'use client';
import React from 'react';
import { Typography } from '@douyinfe/semi-ui';
import { Work } from '@/interfaces/work';
import WorkList from '@/components/work/WorkList';

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [works, setWorks] = React.useState<Array<Work>>();

    React.useEffect(() => {
        let ignore = false;
        setIsLoggedIn(document.cookie.includes('is_login=1;') || false);
        const func = async () => {
            const response = await fetch('/api/index/works/follows');
            let data = await response.json();
            let workData: Array<Work> = data.data.filter(Boolean);
            setWorks(workData);
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);
    return (
        <>
            <Typography.Title heading={3} className="text-center">
                {isLoggedIn ? '我的关注' : '欢迎来到NewXesFrontend'}
            </Typography.Title>
            <WorkList works={works ?? []} className="m-4" />
        </>
    );
}
