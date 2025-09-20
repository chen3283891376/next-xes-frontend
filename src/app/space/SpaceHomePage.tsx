import { UserHorizontalList } from '@/components/user/UserList';
import { SmallWorkCard } from '@/components/work/WorkCard';
import WorkList from '@/components/work/WorkList';
import { SpaceIndex } from '@/interfaces/space';
import { Button, Card, Typography, Skeleton } from '@douyinfe/semi-ui';
import { IconLikeHeart, IconEyeOpened, IconStar, IconCopy, IconBookmark, IconArrowRight } from '@douyinfe/semi-icons';
import React from 'react';

const SpaceHomePage = ({ userId }: { userId: string }) => {
    const OverviewItemCard = ({
        title,
        value,
        icon: Icon,
    }: {
        title: string;
        value: number;
        icon: React.ElementType;
    }) => {
        return (
            <Card className="w-full h-full p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary-50 text-primary">
                        <Icon size="large" />
                    </div>
                    <div>
                        <Typography.Text className="text-gray-500 text-sm">{title}</Typography.Text>
                        <div className="mt-1 font-semibold text-2xl">{value.toLocaleString()}</div>
                    </div>
                </div>
            </Card>
        );
    };

    const LoadingSkeleton = () => (
        <div className="space-y-6">
            <Card title="TA 的成就" className="p-4 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </Card>

            {[1, 2, 3, 4].map(section => (
                <Card key={section} className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <Skeleton.Title style={{ width: 120 }} />
                        <Skeleton.Button style={{ width: 80 }} />
                    </div>
                    <div className="p-4">
                        <div className="space-y-3">
                            {[1, 2, 3].map(item => (
                                <Skeleton key={item} style={{ height: 100, width: '100%' }} />
                            ))}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );

    const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<LoadingSkeleton />);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/space/index?user_id=${userId}`);
            const responseData: SpaceIndex = await response.json();

            setPageComponent(
                <div className="space-y-6">
                    <Card title="TA 的成就" className="p-6 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <OverviewItemCard
                                title="作品总数"
                                value={responseData.data.overview.works}
                                icon={IconBookmark}
                            />
                            <OverviewItemCard
                                title="被点赞总数"
                                value={responseData.data.overview.likes}
                                icon={IconLikeHeart}
                            />
                            <OverviewItemCard
                                title="被浏览总数"
                                value={responseData.data.overview.views}
                                icon={IconEyeOpened}
                            />
                            <OverviewItemCard
                                title="被改编总数"
                                value={responseData.data.overview.source_code_views}
                                icon={IconCopy}
                            />
                            <OverviewItemCard
                                title="被收藏总数"
                                value={responseData.data.overview.favorites}
                                icon={IconStar}
                            />
                        </div>

                        {responseData.data.representative_work && (
                            <div className="mt-6 flex flex-col gap-4 items-center">
                                <Typography.Title heading={5} className="mb-2">
                                    代表作
                                </Typography.Title>
                                <div className="border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                    <SmallWorkCard work={responseData.data.representative_work} />
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <Typography.Title heading={5} className="m-0">
                                TA 的作品
                                <Typography.Text className="ml-2 text-gray-500 text-base font-normal">
                                    ({responseData.data.works.total})
                                </Typography.Text>
                            </Typography.Title>
                            <Button
                                type="tertiary"
                                onClick={() => (location.href = `/space/${userId}/projects`)}
                                className="group"
                            >
                                查看更多
                                <IconArrowRight
                                    size="small"
                                    className="ml-1 group-hover:translate-x-1 transition-transform"
                                />
                            </Button>
                        </div>
                        <div className="p-4">
                            <WorkList works={responseData.data.works.data} />
                            {responseData.data.works.data.length === 0 && (
                                <div className="text-center py-10 text-gray-500">暂无作品</div>
                            )}
                        </div>
                    </Card>

                    <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <Typography.Title heading={5} className="m-0">
                                TA 的收藏
                                <Typography.Text className="ml-2 text-gray-500 text-base font-normal">
                                    ({responseData.data.favorites.total})
                                </Typography.Text>
                            </Typography.Title>
                            <Button
                                type="tertiary"
                                onClick={() => (location.href = `/space/${userId}/favorites`)}
                                className="group"
                            >
                                查看更多
                                <IconArrowRight
                                    size="small"
                                    className="ml-1 group-hover:translate-x-1 transition-transform"
                                />
                            </Button>
                        </div>
                        <div className="p-4">
                            <WorkList works={responseData.data.favorites.data} />
                            {responseData.data.favorites.data.length === 0 && (
                                <div className="text-center py-10 text-gray-500">暂无收藏</div>
                            )}
                        </div>
                    </Card>

                    <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <Typography.Title heading={5} className="m-0">
                                TA 的粉丝
                                <Typography.Text className="ml-2 text-gray-500 text-base font-normal">
                                    ({responseData.data.fans.total})
                                </Typography.Text>
                            </Typography.Title>
                            <Button
                                type="tertiary"
                                onClick={() => (location.href = `/space/${userId}/social`)}
                                className="group"
                            >
                                查看更多
                                <IconArrowRight
                                    size="small"
                                    className="ml-1 group-hover:translate-x-1 transition-transform"
                                />
                            </Button>
                        </div>
                        <div className="p-4">
                            <UserHorizontalList users={responseData.data.fans.data} />
                            {responseData.data.fans.data.length === 0 && (
                                <div className="text-center py-10 text-gray-500">暂无粉丝</div>
                            )}
                        </div>
                    </Card>

                    <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <Typography.Title heading={5} className="m-0">
                                TA 的关注
                                <Typography.Text className="ml-2 text-gray-500 text-base font-normal">
                                    ({responseData.data.follows.total})
                                </Typography.Text>
                            </Typography.Title>
                            <Button
                                type="tertiary"
                                onClick={() => (location.href = `/space/${userId}/social`)}
                                className="group"
                            >
                                查看更多
                                <IconArrowRight
                                    size="small"
                                    className="ml-1 group-hover:translate-x-1 transition-transform"
                                />
                            </Button>
                        </div>
                        <div className="p-4">
                            <UserHorizontalList users={responseData.data.follows.data} />
                            {responseData.data.follows.data.length === 0 && (
                                <div className="text-center py-10 text-gray-500">暂无关注</div>
                            )}
                        </div>
                    </Card>
                </div>,
            );
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [userId]);

    return <div className="mt-4 px-2 md:px-4 max-w-7xl mx-auto">{pageComponent}</div>;
};

export { SpaceHomePage };
