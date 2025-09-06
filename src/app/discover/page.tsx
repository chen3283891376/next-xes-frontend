'use client';
import * as React from 'react';
import { Pagination, Radio, RadioGroup } from '@douyinfe/semi-ui';
import WorkList from '@/components/work/WorkList';

import type { WorkList as IWorkList } from '@/interfaces/work';

export default function DiscoverPage() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [orderLang, setOrderLang] = React.useState<string>('');
    const [orderType, setOrderType] = React.useState<string>('latest');
    const [works, setWorks] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/works/${orderType}?lang=${orderLang}&page=${currentPage}&per_page=50`);
            const responseData: IWorkList = await response.json();

            if (responseData['total'] === 0) {
                setWorks(<h2>暂无作品</h2>);
            }
            setWorks(
                <>
                    <WorkList works={responseData.data} />
                    {responseData.total > 50 && (
                        <div style={{ width: '100%' }}>
                            <Pagination
                                total={Math.ceil(responseData.total / 50) * 50}
                                pageSize={50}
                                currentPage={currentPage}
                                onPageChange={page => {
                                    setCurrentPage(page);
                                }}
                                className="mx-auto w-fit mt-3"
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
    }, [currentPage, orderLang, orderType]);

    return (
        <>
            <div className="flex justify-between mb-3 m-4">
                <RadioGroup
                    type="button"
                    buttonSize="middle"
                    value={orderLang}
                    onChange={event => {
                        setOrderLang(event.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <Radio value="">全部</Radio>
                    <Radio value="scratch">TurboWarp</Radio>
                    <Radio value="python">Python</Radio>
                    <Radio value="cpp">C++</Radio>
                </RadioGroup>

                <RadioGroup
                    type="button"
                    buttonSize="middle"
                    value={orderType}
                    onChange={event => {
                        setOrderType(event.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <Radio value="latest">最新发布</Radio>
                    <Radio value="popular">最受欢迎</Radio>
                    <Radio value="courses">随堂练习</Radio>
                </RadioGroup>
            </div>

            {works}
        </>
    );
}
