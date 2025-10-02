'use client';
import { Table, Typography } from '@douyinfe/semi-ui-19';
import * as React from 'react';

export default function AboutPage() {
    const dataSource = [
        {
            name: '项目描述',
            value: '一个《简单》的前端项目',
        },
        {
            name: 'React 版本',
            value: React.version,
        },
        {
            name: '核心框架',
            value: 'Next.js',
        },
        {
            name: 'CSS 解决方案',
            value: 'Tailwind CSS 与 daisyUI',
        },
        {
            name: 'UI 组件库',
            value: 'Semi Design',
        },
        {
            name: '打包工具',
            value: 'Turbopack',
        },
        {
            name: '代码仓库',
            value: (
                <a href="https://github.com/chen3283891376/next-xes-frontend" target="_blank" rel="noopener noreferrer">
                    chen3283891376/next-xes-frontend
                </a>
            ),
        },
    ];

    const columns = [
        {
            title: '项目信息',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
        },
        {
            title: '详情',
            dataIndex: 'value',
            key: 'value',
        },
    ];

    return (
        <div className="m-4 max-w-2xl">
            <Typography.Title heading={2} className="mb-6">
                关于本项目
            </Typography.Title>
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered
                pagination={false}
                rowKey="name"
                className="bg-white rounded-lg shadow-sm"
            />
        </div>
    );
}
