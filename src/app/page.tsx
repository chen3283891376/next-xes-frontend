'use client';
import React from 'react';
import { Typography } from '@douyinfe/semi-ui-19';
import { Work } from '@/interfaces/work';
import WorkList from '@/components/work/WorkList';
import { gsap } from 'gsap';
import TextPlugin from 'gsap/TextPlugin';

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [works, setWorks] = React.useState<Array<Work>>();

    React.useEffect(() => {
        let ignore = false;
        let isLogin = document.cookie.includes('is_login=1;') || false;
        setIsLoggedIn(isLogin);
        const func = async () => {
            const response = await fetch('/api/index/works/follows');
            const data = await response.json();
            const workData: Array<Work> = data.data.filter(Boolean);
            setWorks(workData);

            gsap.registerPlugin(TextPlugin);
            const tl = gsap.timeline();
            gsap.set('.msg', { text: '' });
            tl.to('.msg', {
                text: isLogin ? '我的关注' : '欢迎来到NewXesFrontend',
                duration: 2,
                ease: 'none',
                delay: 0.5
            });
            tl.to('.cursor', {
                opacity: 0,
                duration: 0.5,
                repeat: 3,
                yoyo: true,
                ease: 'steps(1)'
            }, '-=0.5');
            tl.to('.cursor', {
                opacity: 1,
                duration: 0.1
            });
            tl.to('.cursor', {
                visibility: 'hidden',
            })
        };
        
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);
    return (
        <>
            <Typography.Title heading={3} className="text-center">
                <span className="msg">{isLoggedIn ? '我的关注' : '欢迎来到NewXesFrontend'}</span>
                <span className="cursor">|</span>
            </Typography.Title>
            <WorkList works={works ?? []} className="m-4" />
        </>
    );
}
