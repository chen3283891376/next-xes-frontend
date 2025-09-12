'use client';
import * as React from 'react';
import { Divider, Radio, RadioGroup, TabPane, Tabs, Typography } from '@douyinfe/semi-ui';
import WorkList from '@/components/work/WorkList';
import { Pagination } from '@/components/common/Pagination';
import SearchInput from '@/components/SearchInput';
import { UserAndWorkList } from '@/components/user/UserAndWorkList';

const SearchTabs = {
    AllTab: ({ keyword }: { keyword: string }) => {
        const [currentPage, setCurrentPage] = React.useState(1);
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(
            <Typography.Title heading={6}>加载中...</Typography.Title>,
        );

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                let response: Response;
                let responseData;
                if (currentPage === 1) {
                    response = await fetch(
                        `/api/search?keyword=${keyword}&search_type=all&page=${currentPage}&per_page=50`,
                    );
                    responseData = await response.json();
                } else {
                    response = await fetch(
                        `/api/search?keyword=${keyword}&search_type=works&order_type=comprehensive&lang=all&page=${currentPage}&per_page=50`,
                    );
                    responseData = await response.json();
                }
                if (responseData.data.total === 0) {
                    setPageComponent(<Typography.Title heading={6}>暂无数据</Typography.Title>);
                }

                setPageComponent(
                    <>
                        {currentPage === 1 && (
                            <>
                                <UserAndWorkList infos={responseData.data.users.data} />
                                <Divider className="my-2" />
                                <WorkList works={responseData.data.works.data} />
                            </>
                        )}
                        {currentPage === 1 && responseData.data.works.total > 50 && (
                            <Pagination
                                pageCount={Math.ceil(responseData.data.works.total / 50)}
                                value={currentPage}
                                pageSize={50}
                                handlePageChange={page => {
                                    setCurrentPage(page);
                                }}
                                className="mt-2 mx-auto w-fit"
                            />
                        )}

                        {currentPage > 1 && (
                            <>
                                <WorkList works={responseData.data.data} />
                            </>
                        )}
                        {currentPage > 1 && responseData.data.total > 50 && (
                            <Pagination
                                pageCount={Math.ceil(responseData.data.total / 50)}
                                pageSize={50}
                                value={currentPage}
                                handlePageChange={page => {
                                    setCurrentPage(page);
                                }}
                                className="mt-2 mx-auto w-fit"
                            />
                        )}
                    </>,
                );
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, [currentPage]);

        return <div className="mt-2 m-4">{pageComponent}</div>;
    },
    AuthorTab: ({ keyword }: { keyword: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(
            <Typography.Title heading={6}>加载中...</Typography.Title>,
        );
        const [currentPage, setCurrentPage] = React.useState(1);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(
                    `/api/search?keyword=${keyword}&search_type=users&page=${currentPage}&per_page=10`,
                );
                const responseData = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(<Typography.Title heading={6}>暂无数据</Typography.Title>);
                }

                setPageComponent(
                    <>
                        <UserAndWorkList infos={responseData.data.data} />
                        {responseData.data.total > 10 && (
                            <Pagination
                                pageCount={Math.ceil(responseData.data.total / 10)}
                                pageSize={10}
                                value={currentPage}
                                handlePageChange={page => {
                                    setCurrentPage(page);
                                }}
                                className="mt-2 mx-auto w-fit"
                            />
                        )}
                    </>,
                );
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, [currentPage]);

        return <div className="mt-2 m-4">{pageComponent}</div>;
    },
    ProjectsTab: ({ keyword }: { keyword: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(
            <Typography.Title heading={6}>加载中...</Typography.Title>,
        );
        const [orderType, setOrderType] = React.useState('comprehensive');
        const [lang, setLang] = React.useState('all');
        const [currentPage, setCurrentPage] = React.useState(1);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(
                    `/api/search?keyword=${keyword}&search_type=works&order_type=${orderType}&lang=${lang}&page=${currentPage}&per_page=50`,
                );
                const responseData = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(<Typography.Title heading={6}>暂无作品</Typography.Title>);
                    return;
                }

                setPageComponent(
                    <>
                        <WorkList works={responseData.data.data} />
                        {responseData.data.total > 50 && (
                            <Pagination
                                pageCount={Math.ceil(responseData.data.total / 50)}
                                pageSize={50}
                                value={currentPage}
                                handlePageChange={page => {
                                    setCurrentPage(page);
                                }}
                                className="mx-auto w-fit"
                            />
                        )}
                    </>,
                );
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, [currentPage, lang, orderType]);

        return (
            <div className="mt-2 m-4">
                <div className="flex justify-between my-1">
                    <RadioGroup
                        value={lang}
                        type="button"
                        onChange={event => {
                            if (event.target.value !== null) {
                                setLang(event.target.value);
                                setCurrentPage(1);
                            }
                        }}
                    >
                        <Radio value="all">全部</Radio>
                        <Radio value="scratch">TurboWarp</Radio>
                        <Radio value="python">Python</Radio>
                        <Radio value="cpp">C++</Radio>
                    </RadioGroup>
                    <RadioGroup
                        type="button"
                        value={orderType}
                        onChange={event => {
                            if (event.target.value !== null) {
                                setOrderType(event.target.value);
                                setCurrentPage(1);
                            }
                        }}
                    >
                        <Radio value="comprehensive">综合排序</Radio>
                        <Radio value="likes">点赞最多</Radio>
                        <Radio value="favorites">收藏最多</Radio>
                        <Radio value="source_code_views">改编最多</Radio>
                    </RadioGroup>
                </div>

                {pageComponent}
            </div>
        );
    },
};

export default function SearchPage() {
    const [loaderData, setLoaderData] = React.useState<{
        keyword: string | null;
        tab: string | null;
        isLoggedIn: boolean;
    }>({
        keyword: null,
        tab: null,
        isLoggedIn: false,
    });

    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        const isLoggedIn = document.cookie.includes('is_login=1;') || false;
        const keyword = searchParams.get('keyword');
        const tab = searchParams.get('tab');

        setLoaderData({
            keyword: keyword || null,
            tab: tab || null,
            isLoggedIn,
        });
    }, []);
    const keyword = loaderData.keyword;

    if (keyword === null) {
        return <Typography.Title heading={6}>获取关键字失败</Typography.Title>;
    }

    const handleTabChange = (activeKey: string) => {
        if (activeKey) {
            window.scrollTo(0, 0);
            history.pushState(null, '', `/search?keyword=${decodeURIComponent(keyword)}&tab=${activeKey}`);
        }
    };

    return (
        <div className="mt-2 m-4 flex flex-col items-center">
            <SearchInput keyword={keyword} />

            <Tabs
                defaultActiveKey={loaderData.tab || 'all'}
                onChange={handleTabChange}
                keepDOM={false}
                className="flex flex-col items-center"
            >
                <TabPane tab="综合排序" itemKey="all">
                    <SearchTabs.AllTab keyword={keyword} />
                </TabPane>
                <TabPane tab="作者" itemKey="users">
                    <SearchTabs.AuthorTab keyword={keyword} />
                </TabPane>
                <TabPane tab="项目" itemKey="projects">
                    <SearchTabs.ProjectsTab keyword={keyword} />
                </TabPane>
            </Tabs>
        </div>
    );
}
