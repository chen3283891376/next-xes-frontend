import * as React from 'react';
import { Card, Tag, Space, Typography, Tooltip, Divider } from '@douyinfe/semi-ui-19';
import { IconEyeOpened, IconLikeThumb, IconDislikeThumb, IconComment } from '@douyinfe/semi-icons';
import { getWorkLink } from '@/utils';
import { Work } from '@/interfaces/work';
import { v4 as uuidV4 } from 'uuid';

const WorkCard = ({ work }: { work: Work }) => {
    const link = getWorkLink(work);
    const author_url = `/space/${work.user_id}/home`;

    return (
        <Tooltip content={work.created_at || work.published_at} position='bottom'>
            <span>
                <Card
                    title={
                        <Typography.Title
                            link={{ href: link, target: '_blank' }}
                            ellipsis={{ showTooltip: true }}
                            heading={4}
                        >
                            {work.name.replace(/<em>|<\/em>/g, '')}
                        </Typography.Title>
                    }
                    cover={
                        <img
                            className="mx-auto"
                            style={{ width: '224px', height: '168px', cursor: 'pointer' }}
                            onClick={() => window.open(link, '_blank')}
                            draggable={false}
                            src={
                                work.thumbnail ||
                                'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'
                            }
                            alt={work.name}
                        />
                    }
                    actions={[
                        <Space className={'w-full'} spacing="tight" wrap key={work.id}>
                            <div className="flex justify-between w-full">
                                <a href={author_url} target="_blank" style={{ maxWidth: '114px' }}>
                                    <Tag size="large" color="yellow" style={{ fontSize: '14px' }}>
                                        {work.username}
                                    </Tag>
                                </a>
                                <span style={{ fontSize: '12px' }}>
                                    <Tag color="cyan" size="small" shape="circle" prefixIcon={<IconEyeOpened />}>
                                        {work.views}
                                    </Tag>
                                    <Tag color="red" size="small" shape="circle" prefixIcon={<IconLikeThumb />}>
                                        {work.likes}
                                    </Tag>
                                    <Tag color="purple" size="small" shape="circle" prefixIcon={<IconDislikeThumb />}>
                                        {work.unlikes}
                                    </Tag>
                                    <Tag color="green" size="small" shape="circle" prefixIcon={<IconComment />}>
                                        {work.comments}
                                    </Tag>
                                </span>
                            </div>
                        </Space>,
                    ]}
                />
            </span>
        </Tooltip>
    );
};

const SmallWorkCard = ({ work }: { work: Work }) => {
    return (
        <Tooltip position="top" content={`👀${work.views} 👍${work.likes} 👎${work.unlikes} ${work.created_at}`}>
            <span>
                <Card
                    actions={[
                        <a key={uuidV4()} href={getWorkLink(work)} target="_blank" rel="noopener noreferrer">
                            <img className="mx-auto" src={work.thumbnail} alt={work.name} style={{ maxHeight: 138 }} />
                            <Divider />
                            <Typography.Text link={{ href: getWorkLink(work), target: '_blank' }} style={{ fontSize: 16 }}>
                                {work.name.replace(/<em>|<\/em>/g, '')}
                            </Typography.Text>
                        </a>,
                    ]}
                />
            </span>
        </Tooltip>
    );
};

export default WorkCard;
export { SmallWorkCard };
