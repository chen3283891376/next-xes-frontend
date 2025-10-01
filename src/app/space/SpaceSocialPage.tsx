import { Pagination } from '@/components/common/Pagination';
import { UserVerticalList } from '@/components/user/UserList';
import { SpaceSocial } from '@/interfaces/space';
import { Radio, RadioGroup } from '@douyinfe/semi-ui-19';
import React from 'react';

export const SpaceSocialPage = ({ userId }: { userId: string }) => {
    const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);
    const [currentTab, setCurrentTab] = React.useState('follows');
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/space/${currentTab}?user_id=${userId}&page=${currentPage}&per_page=10`);
            const responseData: SpaceSocial = await response.json();

            if (ignore) return;
            if (responseData.data.total === 0) {
                setPageComponent(<h2>暂无数据</h2>);
            }

            setPageComponent(
                <>
                    <UserVerticalList users={responseData.data.data} />
                    {responseData.data.total > 10 && (
                        <div className="w-full mt-2">
                            <Pagination
                                pageCount={Math.ceil(responseData.data.total / 10)}
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
    }, [userId, currentTab, currentPage]);

    return (
        <div className="mt-2">
            <RadioGroup
                className="mb-2 right-padding"
                value={currentTab}
                type="button"
                onChange={event => {
                    if (event.target.value !== null) {
                        setCurrentTab(event.target.value);
                        setCurrentPage(1);
                    }
                }}
            >
                <Radio value="follows">TA 的关注</Radio>
                <Radio value="fans">TA 的粉丝</Radio>
            </RadioGroup>
            {pageComponent}
        </div>
    );
};
