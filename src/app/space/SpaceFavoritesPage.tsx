import { Pagination } from '@/components/common/Pagination';
import WorkList from '@/components/work/WorkList';
import { SpaceWorks } from '@/interfaces/space';
import React from 'react';

export default function SpaceFavoritesPage({ userId }: { userId: string }) {
    const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(
                `/api/space/favorites?user_id=${userId}&page=${currentPage}&per_page=20&order_type=time`,
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
    }, [userId, currentPage]);

    return <div className="mt-2">{pageComponent}</div>;
};
