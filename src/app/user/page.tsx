'use client';
import * as React from'react';
import { Button, Card, Space, Tabs, Tag, Toast, Tooltip, Typography } from '@douyinfe/semi-ui-19';
import { IconEyeOpened, IconLikeThumb, IconDislikeThumb, IconComment, IconEdit, IconShareStroked, IconPause } from '@douyinfe/semi-icons';
import { Pagination } from '@/components/common/Pagination';
import WorkList from '@/components/work/WorkList';

import { ErrorResponse } from '@/interfaces/common';
import { UserWorkList } from '@/interfaces/user';
import { PublishWorkInfo, Work } from '@/interfaces/work';
import { getEditWorkLink, getWorkLink } from '@/utils';

const FixedWorkCard = (
    onClickPublish: (work: PublishWorkInfo) => void,
    onClickCancelPublish: (work: PublishWorkInfo) => Promise<void>,
) => {
    return ({ work }: { work: Work; }) => {
        const publishedText = { 0: '未发布', 1: '已发布', 2: '审核中', removed: '已下架' };
        const [isShowOperators, setIsShowOperators] = React.useState(false);
        let link = getWorkLink(work);
        let editLink = getEditWorkLink(work);
        let workStatus;

        if (work.removed) {
            workStatus = publishedText['removed'];
        } else {
            workStatus = publishedText[work.published as keyof typeof publishedText];
        }

        const statusColors = {
            未发布: 'white',
            已发布: 'green',
            审核中: 'blue',
            已下架: 'red',
        };

        return (
            <Tooltip content={work.created_at} position='bottom'>
                <div
                    onMouseEnter={() => setIsShowOperators(true)}
                    onMouseLeave={() => setIsShowOperators(false)}
                >
                    <Card
                        title={
                            <Typography.Title
                                link={{ href: link, target: '_blank' }}
                                ellipsis={{ showTooltip: true }}
                                heading={4}
                            >
                                {work.name}
                            </Typography.Title>
                        }
                        cover={
                            <div className='relative'>
                                <img
                                    className="mx-auto"
                                    style={{ width: '224px', height: '168px', cursor: 'pointer' }}
                                    onClick={() => window.open(link, '_blank')}
                                    draggable={false}
                                    src={
                                        work.thumbnail ||
                                        'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'
                                    }
                                    alt={work.name}
                                />
                                <div
                                    className="absolute top-[8px] right-[8px] gap-1 z-10"
                                    style={{ display: isShowOperators ? 'flex' : 'none' }}
                                >
                                    <Button
                                        size="small"
                                        icon={<IconEdit />}
                                        onClick={() => window.open(editLink, '_blank')}
                                        type='primary'
                                        theme='solid'
                                        sx={{ minWidth: 'auto', padding: '4px 8px' }}
                                    >
                                        编辑
                                    </Button>
                                    {work.published === 0 && !work.removed && (
                                        <Button
                                            size="small"
                                            icon={<IconShareStroked />}
                                            onClick={() => {
                                                let workData = work as unknown as PublishWorkInfo;
                                                workData.created_source = 'original';
                                                onClickPublish(workData);
                                            }}
                                            type='secondary'
                                            theme='solid'
                                            sx={{ minWidth: 'auto', padding: '4px 8px' }}
                                        >
                                            发布
                                        </Button>
                                    )}
                                    {work.published === 1 && (
                                        <Button
                                            size="small"
                                            icon={<IconPause />}
                                            onClick={() => {
                                                let workData = work as unknown as PublishWorkInfo;
                                                onClickCancelPublish(workData);
                                            }}
                                            type='danger'
                                            theme='solid'
                                            sx={{ minWidth: 'auto', padding: '4px 8px' }}
                                        >
                                            取消发布
                                        </Button>
                                    )}
                                </div>
                            </div>
                        }
                        actions={[
                            <Space className={'w-full'} spacing="tight" wrap key={work.id}>
                                <div className="flex justify-between w-full">
                                    <Tag 
                                        color={statusColors[workStatus as keyof typeof statusColors] as any}
                                        size="small" 
                                        shape='circle'
                                        className='shrink-0'
                                    >
                                        {workStatus}
                                    </Tag>

                                    <span style={{ fontSize: '12px' }}>
                                        <Tag color="cyan" size="small" shape="circle" prefixIcon={<IconEyeOpened />}>
                                            {work.views}
                                        </Tag>
                                        <Tag color="red" size="small" shape="circle" prefixIcon={<IconLikeThumb />}>
                                            {work.likes}
                                        </Tag>
                                        <Tag color="purple" size="small" shape="circle" prefixIcon={<IconDislikeThumb />}>
                                            {work.unlikes}
                                        </Tag>
                                        <Tag color="green" size="small" shape="circle" prefixIcon={<IconComment />}>
                                            {work.comments}
                                        </Tag>
                                    </span>
                                </div>
                            </Space>,
                        ]}
                    />
                </div>
            </Tooltip>
        );
    }
}

export default function UserPage() {
    const [type, setType] = React.useState('normal');
    const [lang, setLang] = React.useState('projects');
    const [status, setStatus] = React.useState('all');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageComponent, setPageComponent] = React.useState<React.ReactNode>(
        <Typography.Title heading={5}>Loading...</Typography.Title>
    );
    const [showPublishModal, setShowPublishModal] = React.useState(false);
    const publishWork = React.useRef<PublishWorkInfo>(null);
    
    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            try {
                const response = await fetch(
                    `/api/${lang}/my?type=${type}&published=${status}&page=${currentPage}&per_page=20`,
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const responseData: UserWorkList = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(
                        <Typography.Title heading={5} className='py-4 text-center'>
                            暂时没有作品，快去创作吧
                        </Typography.Title>,
                    );
                    return;
                }

                setPageComponent(
                    <>
                        <WorkList
                            works={responseData.data.data}
                            enableRemoved={false}
                            WorkCardInterface={FixedWorkCard(
                                (work: PublishWorkInfo) => {
                                    publishWork.current = work;
                                    setShowPublishModal(true);
                                },
                                async (work: PublishWorkInfo) => {
                                    try {
                                        const response = await fetch(`/api/${lang}/${work.id}/cancel_publish`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                params: {
                                                    id: work.id,
                                                },
                                            }),
                                        });
                                        if (!response.ok) {
                                            const error: ErrorResponse = await response.json();
                                            Toast.error(error.message);
                                            return;
                                        }
                                        Toast.success('取消发布成功');
                                        setLang(work.lang);
                                    } catch (error) {
                                        Toast.error('取消发布失败，请重试');
                                    }
                                },
                            )}
                        />
                        {responseData.data.total > 20 && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 20)}
                                    value={currentPage}
                                    handlePageChange={value => setCurrentPage(value)}
                                />
                            </div>
                        )}
                    </>,
                );
            } catch (error) {
                setPageComponent(
                    <Typography.Title heading={5} className='py-4 text-center'>
                        加载失败，请刷新页面重试
                    </Typography.Title>,
                );
            }
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [type, lang, status, currentPage]);

    return (
        <div className="mt-2 m-4">
            <Card className="mb-4">
                <Tabs 
                    tabList={[
                        { tab: "个人创作", itemKey: "normal" },
                        {
                            tab: <Tooltip content="（隋唐练习）">
                                    随堂练习
                                </Tooltip>,
                            itemKey: "homework"
                        }
                    ]}
                    onChange={(itemKey: string) => {
                        setType(itemKey);
                        setCurrentPage(1);
                    }}
                />

                <div className="flex gap-4 items-center">
                    <span>类型</span>

                    <Tabs
                        type='slash'
                        className='mt-3'
                        activeKey={lang}
                        onChange={(itemKey: string) => {
                            setLang(itemKey);
                            setCurrentPage(1);
                        }}
                        tabList={[
                            { tab: "TurboWarp", itemKey: "projects" },
                            { tab: "Python", itemKey: "python" },
                            { tab: "C++", itemKey: "compilers" }
                        ]}
                    />
                </div>
                <div className="flex gap-4 items-center">
                    <span>状态</span>

                    <Tabs
                        type='slash'
                        className='mt-3'
                        activeKey={status}
                        onChange={(itemKey: string) => {
                            setStatus(itemKey);
                            setCurrentPage(1);
                        }}
                        tabList={[
                            { tab: "全部", itemKey: "all" },
                            { tab: "未发布", itemKey: "0" },
                            { tab: "审核中", itemKey: "2" },
                            { tab: "已发布", itemKey: "1" },
                            { tab: "已下架", itemKey: "removed" }
                        ]}
                    />
                </div>
            </Card>

            {pageComponent}
        </div>
    )
}