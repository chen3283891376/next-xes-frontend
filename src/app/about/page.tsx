'use client';
import { Typography } from '@douyinfe/semi-ui';
import * as React from 'react';

export default function AboutPage() {
    return (
        <div className="m-4">
            <Typography.Title>关于</Typography.Title>
            <p>没什么好关于的，就是一个《简单》的前端项目。</p>
            <p>
                使用 React {React.version} 和 Next.js 开发，使用 Tailwind CSS 与 daisyUI 作为 css 库，使用 Semi Design
                作为 UI 库，使用 Turbopack 作为打包框架。
            </p>
            <p>
                代码仓库：
                <a href="https://dgithub.xyz/NewXesTeam/NewXesFrontend">NewXesTeam/NewXesFrontend</a>
            </p>
        </div>
    );
}
