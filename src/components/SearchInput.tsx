import * as React from 'react';
import { AutoComplete, Empty } from '@douyinfe/semi-ui';
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';
import { IconSearch } from '@douyinfe/semi-icons';
import type { Associate_words } from '@/interfaces/common';

const SearchInput = ({ keyword = '' }: { keyword?: string }) => {
    const [options, setOptions] = React.useState<string[]>([]);
    const [inputValue, setInputValue] = React.useState(keyword);

    const fetchSuggestions = React.useCallback(async (value: string) => {
        if (!value) {
            setOptions([]);
            return;
        }
        const response = await fetch(`/api/search/associate_words?keyword=${value}`);
        const responseData: Associate_words = await response.json();
        setOptions(responseData.data.map(item => decodeURIComponent(item.word.replace(/<em>/g, '').replace(/<\/em>/g, ''))));
    }, []);

    return (
        <AutoComplete 
            className='mr-3'
            value={inputValue}
            prefix={<IconSearch />}
            placeholder='搜点什么？'
            onChange={(value) => {
                setInputValue(String(value));
            }}
            data={options}
            onSearch={fetchSuggestions}
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    location.href = `/search?keyword=${inputValue}`;
                }
            }}
            emptyContent={<Empty style={{ padding: 12 }} image={<IllustrationNoContent style={{ width: 150, height: 150 }}/>} description={'暂无内容'} />}
        />
    );
};

export default SearchInput;
