'use client';
import * as React from 'react';
import { Button } from '@douyinfe/semi-ui-19';
import { IconGithubLogo as GitHub } from '@douyinfe/semi-icons';

export default function AppFooter() {
    return (
        <div className="flex justify-between bg-neutral-200 px-4 py-1 text-black">
            <div className="flex items-center">
                <span>Copyright by NewXesTeam 2025</span>
            </div>
            <div className="flex items-center">
                <Button onClick={() => window.open('https://github.com/NewXesTeam/new-xes-frontend')}>
                    <GitHub className="text-black" aria-label="GitHub" />
                </Button>
            </div>
        </div>
    );
}
