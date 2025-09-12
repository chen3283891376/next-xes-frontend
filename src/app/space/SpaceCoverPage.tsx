import { SpaceCover } from '@/interfaces/space';
import { Spin } from '@douyinfe/semi-ui';
import React from 'react';

export default function SpaceCoverPage({ userId }: { userId: string }) {
    const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<Spin size="large" />);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/space/web_cover?user_id=${userId}`);
            const responseData: SpaceCover = await response.json();

            if (ignore) return;
            if (responseData.data.is_show_web_tab) {
                setPageComponent(<iframe src={responseData.data.index_url} width="100%" height={600} />);
            } else {
                setPageComponent(<h2>未设置封面</h2>);
            }
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [userId]);

    return <div className="mt-2">{pageComponent}</div>;
}
