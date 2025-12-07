// TODO: 似乎还有bug？不管了，先用着
import * as React from 'react';
import { Button, Form, Modal, Toast, Typography } from '@douyinfe/semi-ui-19';
import { IconUpload } from '@douyinfe/semi-icons';
import SparkMD5 from 'spark-md5';

import { PublishWorkInfo } from '@/interfaces/work';

const { Title } = Typography;
const { Input, Select, TagInput, TextArea } = Form;

const ProjectPublishModal = ({
    workInfo,
    visible,
    setVisible,
}: {
    workInfo: PublishWorkInfo;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}) => {
    const [work, setWork] = React.useState<PublishWorkInfo>(workInfo);
    const [thumbnailImage, setThumbnailImage] = React.useState<string>(
        work.thumbnail || 'https://static0.xesimg.com/talcode/assets/py/default-python-thumbnail.png',
    );
    const [origin, setOrigin] = React.useState<string>(work.created_source || 'original');
    const [tags, setTags] = React.useState<string[]>(work.tags === '' ? [] : work.tags.split(' '));

    const workNameRef = React.useRef<HTMLInputElement>(null);
    const thumbnailUploadRef = React.useRef<HTMLInputElement>(null);
    const descriptionTextRef = React.useRef<HTMLTextAreaElement>(null);

    let lang = workInfo.lang;
    if (lang === 'webpy' || lang === 'python') {
        lang = 'python';
    } else if (lang === 'cpp') {
        lang = 'compilers';
    } else {
        lang = 'projects';
    }

    const handleOk = async () => {
        if (!workNameRef.current?.value || tags.length === 0) {
            Toast.error('有选项未填写！');
            return;
        }
        try {
            await fetch(`/api/${lang}/${work.id}/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: work.id,
                    name: workNameRef.current.value,
                    tags: tags.join(' '),
                    created_source: origin,
                    thumbnail: thumbnailImage,
                    hidden_code: 2,
                    description: descriptionTextRef.current?.value,
                }),
            });
            Toast.success('发布成功');
            setVisible(false);
        } catch (error) {
            Toast.error('发布失败，请重试');
        }
    };
    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <Modal
            bodyStyle={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}
            visible={visible}
            title="发布作品"
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
        >
            <div className="flex-1">
                <Title heading={4}>作品封面</Title>
                <div className="overflow-hidden rounded">
                    <img
                        src={thumbnailImage}
                        alt="作品封面"
                        style={{ width: '100%', height: '100%', display: 'block' }}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        ref={thumbnailUploadRef}
                        style={{ display: 'none' }}
                        onChange={async e => {
                            if (e.target.files && e.target.files[0]) {
                                const reader = new FileReader();
                                const file = e.target.files[0];
                                const FileExtension = file.name.split('.').pop()?.toLowerCase() || '';

                                reader.readAsArrayBuffer(file);
                                reader.onload = async e => {
                                    if (e.target && e.target.result) {
                                        const ThumbnailImageArrayBuffer = e.target.result as ArrayBuffer;

                                        const spark = new SparkMD5.ArrayBuffer();
                                        spark.append(ThumbnailImageArrayBuffer);
                                        const md5 = spark.end();

                                        const reader2 = new FileReader();
                                        reader2.readAsArrayBuffer(file);
                                        reader2.onload = async e2 => {
                                            if (e2.target && e2.target.result && md5) {
                                                try {
                                                    const response = await fetch(
                                                        `/api/assets/v2/get_tss_upload_params?filename=${md5}.${FileExtension}&md5=${md5}&scene=thumbnail`,
                                                    );
                                                    const responseData = await response.json();

                                                    await fetch(responseData.data.host, {
                                                        method: 'PUT',
                                                        headers: responseData.data.headers,
                                                        body: e2.target.result,
                                                    });

                                                    setThumbnailImage(
                                                        responseData.data.url +
                                                            '?x-oss-process=image/resize,w_640/format,webp',
                                                    );
                                                } catch (error) {
                                                    console.error('上传失败:', error);
                                                }
                                            }
                                        };
                                    }
                                };
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        icon={<IconUpload />}
                        onClick={() => {
                            if (thumbnailUploadRef.current) {
                                thumbnailUploadRef.current.click();
                            }
                        }}
                    >
                        上传封面
                    </Button>
                </div>
            </div>
            <div className="flex-1">
                <Form layout="vertical">
                    <Input field="WorkName" ref={workNameRef} initValue={work.name} label="作品名称" />
                    <Select
                        field="Origin"
                        label="作品来源"
                        initValue={work.created_source || 'original'}
                        onChange={value => setOrigin(value as string)}
                    >
                        <Select.Option value="original" disabled={work.created_source === 'adapt'}>
                            原创
                        </Select.Option>
                        <Select.Option value="adapt">改编</Select.Option>
                        <Select.Option value="reprint" disabled={work.created_source === 'adapt'}>
                            转载
                        </Select.Option>
                    </Select>
                    <TagInput field="WorkTags" label="作品标签" initValue={tags} onChange={value => setTags(value)} />
                    <TextArea
                        field="WorkDescription"
                        ref={descriptionTextRef}
                        label="作品描述"
                        initValue={work.description}
                        rows={4}
                    />
                </Form>
            </div>
        </Modal>
    );
};
export default ProjectPublishModal;
