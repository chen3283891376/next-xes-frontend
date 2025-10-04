'use client';
import React from "react";
import { BasicResponse } from "@/interfaces/common";
import { PublishWorkInfo } from "@/interfaces/work";
import { WSTerminal } from "@/lib/WebsocketIDE/components/Terminal";

interface PageParams {
    params: Promise<{
        id: string;
    }>;
}

export default function EmbedCppPage({ params }: PageParams) {
    const { id } = React.use(params);
    const [code, setCode] = React.useState('');

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch(`/api/compilers/v2/${id}`);
            const responseData: BasicResponse<PublishWorkInfo> = await response.json();
            setCode(responseData.data.xml);
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

    return <WSTerminal className="w-full h-full" lang="cpp" code={code} />;
}