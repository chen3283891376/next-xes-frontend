'use client';
import * as React from 'react';
import { Divider, Layout, Nav, Radio, RadioGroup, Typography } from '@douyinfe/semi-ui-19';
import WorkList from '@/components/work/WorkList';
import { Pagination } from '@/components/common/Pagination';
import SearchInput from '@/components/SearchInput';
import { UserAndWorkList } from '@/components/user/UserAndWorkList';
import { OnSelectedData } from '@douyinfe/semi-ui-19/lib/es/navigation';
import { IconCode, IconListView, IconUser } from '@douyinfe/semi-icons';

const getSearchParamsFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
        keyword: searchParams.get('keyword') ? searchParams.get('keyword')! : null,
        tab: searchParams.get('tab') || 'all',
    };
};

const updateUrlTab = (tab: string, keyword: string) => {
    history.pushState(
        null,
        '',
        `/search?keyword=${encodeURIComponent(keyword)}&tab=${tab}`
    );
};

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
                    return;
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
        }, [currentPage, keyword]);

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
                    return;
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
        }, [currentPage, keyword]);

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
        }, [currentPage, lang, orderType, keyword]);

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

const { Sider, Content } = Layout;
const tabs = ['all', 'users', 'projects'];

export default function SearchPage() {
    const [searchState, setSearchState] = React.useState(() => getSearchParamsFromUrl());
    const { keyword, tab: currentTab } = searchState;

    React.useEffect(() => {
        const handlePopState = () => {
            setSearchState(getSearchParamsFromUrl());
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    if (keyword === null) {
        return <Typography.Title heading={6}>获取关键字失败</Typography.Title>;
    }

    const handleTabChange = (newTab: string) => {
        if (newTab !== currentTab) {
            setSearchState(prev => ({ ...prev, tab: newTab }));
            updateUrlTab(newTab, keyword);
        }
    };

    return (
        <div className="mt-2 m-4">
            <div className="flex justify-center mb-2 w-full">
                <SearchInput keyword={keyword} />
            </div>
            <Divider />
            <Layout>
                <Sider>
                    <Nav
                        defaultIsCollapsed
                        selectedKeys={[tabs.indexOf(currentTab)]}
                        onSelect={(data: OnSelectedData) => {
                            const newTab = tabs[data.itemKey as number];
                            handleTabChange(newTab);
                        }}
                        footer={{
                            collapseButton: true,
                        }}
                        items={[
                            {
                                itemKey: 0,
                                text: '综合排序',
                                icon: <IconListView />,
                            },
                            {
                                itemKey: 1,
                                text: '作者',
                                icon: <IconUser />,
                            },
                            {
                                itemKey: 2,
                                text: '项目',
                                icon: <IconCode />,
                            },
                        ]}
                    />
                </Sider>
                <Content>
                    {currentTab === 'all' && <SearchTabs.AllTab keyword={keyword} />}
                    {currentTab === 'users' && <SearchTabs.AuthorTab keyword={keyword} />}
                    {currentTab === 'projects' && <SearchTabs.ProjectsTab keyword={keyword} />}
                </Content>
            </Layout>
        </div>
    );
}
