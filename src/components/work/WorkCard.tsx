import * as React from 'react';
import { Card, Tag, Space, Typography, Tooltip, Divider } from '@douyinfe/semi-ui';
import { IconEyeOpened, IconLikeThumb, IconDislikeThumb, IconComment } from '@douyinfe/semi-icons';
import { getWorkLink } from '@/utils';
import { Work } from '@/interfaces/work';

const WorkCard = ({ work }: { work: Work }) => {
    const link = getWorkLink(work);
    const author_url = `/space/home?id=${work.user_id}`;

    return (
        <Tooltip content={work.created_at} placement="bottom">
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
            >
                <Space spacing="tight" wrap>
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
                </Space>
            </Card>
        </Tooltip>
    );
};

const SmallWorkCard = ({ work }: { work: Work }) => {
    return (
        <Tooltip placement="top" title={`👀${work.views} 👍${work.likes} 👎${work.unlikes} ${work.created_at}`}>
            <Card
                actions={[
                    <a href={getWorkLink(work)} target="_blank" rel="noopener noreferrer">
                        <img className="mx-auto" src={work.thumbnail} alt={work.name} style={{ maxHeight: 138 }} />
                        <Divider />
                        <Typography.Text link={{ href: getWorkLink(work), target: '_blank' }} style={{ fontSize: 16 }}>
                            {work.name.replace(/<em>|<\/em>/g, '')}
                        </Typography.Text>
                    </a>,
                ]}
            />
        </Tooltip>
    );
};

export default WorkCard;
export { SmallWorkCard };
