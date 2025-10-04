'use client';
import * as React from 'react';
import { IconButton } from '@douyinfe/semi-ui-19';
import { IconGithubLogo as GitHub } from '@douyinfe/semi-icons';

export default function AppFooter() {
    let isShowFooter = true;
    if (location.pathname.includes('/embed')) {
        isShowFooter = false;
    }
    return (
        <div 
            className="flex justify-between bg-neutral-700 px-4 py-1 text-white"
            style={{
                display: isShowFooter ? 'flex' : 'none',
                marginTop: isShowFooter ? '16px' : 0,
            }}
        >
            <div className="flex items-center">
                <span>Copyright by NewXesTeam 2025</span>
            </div>
            <div className="flex items-center bg-neutral-600">
                <IconButton
                    onClick={() => window.open('https://github.com/NewXesTeam/new-xes-frontend')}
                    icon={<GitHub className={'text-white'} />}
                />
            </div>
        </div>
    );
}
