import { Pagination } from '@/components/common/Pagination';
import WorkList from '@/components/work/WorkList';
import { SpaceWorks } from '@/interfaces/space';
import { RadioGroup, Radio } from '@douyinfe/semi-ui';
import React from 'react';

const SpaceProjectsPage = ({ userId }: { userId: string }) => {
    const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);
    const [orderType, setOrderType] = React.useState('time');
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(
                `/api/space/works?user_id=${userId}&page=${currentPage}&per_page=20&order_type=${orderType}`,
            );
            const responseData: SpaceWorks = await response.json();

            if (ignore) return;
            if (responseData.data.total === 0) {
                setPageComponent(<h2>暂无作品</h2>);
            }

            setPageComponent(
                <>
                    <WorkList works={responseData.data.data} />
                    {responseData.data.total > 20 && (
                        <div className="w-full mt-2">
                            <Pagination
                                pageCount={Math.ceil(responseData.data.total / 20)}
                                value={currentPage}
                                handlePageChange={page => {
                                    setCurrentPage(page);
                                }}
                                className="mx-auto w-fit"
                            />
                        </div>
                    )}
                </>,
            );
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [userId, currentPage, orderType]);

    return (
        <div className="mt-2">
            <RadioGroup
                className="mb-2 right-padding"
                type="button"
                value={orderType}
                onChange={e => {
                    setOrderType(e.target.value);
                    setCurrentPage(1);
                }}
            >
                <Radio value="time">最新发布</Radio>
                <Radio value="likes">点赞最多</Radio>
                <Radio value="comments">评论最多</Radio>
            </RadioGroup>
            {pageComponent}
        </div>
    );
};
export { SpaceProjectsPage };
