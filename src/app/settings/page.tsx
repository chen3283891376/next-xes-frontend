'use client';
import * as React from 'react';
import { Card, Switch, Typography } from '@douyinfe/semi-ui-19';

export default function SettingsPage() {
    const [hitokoto, setHitokoto] = React.useState(false);

    React.useEffect(() => {
        setHitokoto(localStorage.getItem('hitokoto') === 'true')
    }, [])

    return (
        <div className='p-4'>
            <Typography.Title heading={3}>设置</Typography.Title>
            <Typography.Text>这里有一些（也许有用的）可选小功能设置。</Typography.Text>

            <div className='m-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'>
                <Card
                    title='Hitokoto一言'
                    headerExtraContent={
                        <Switch 
                            checked={hitokoto} 
                            onChange={() => {
                                setHitokoto(!hitokoto)
                                localStorage.setItem('hitokoto', String(!hitokoto))
                            }}
                        />
                    }
                > 
                    每日一句，让你在coding中获得新鲜感。
                </Card>
            </div>
        </div>
    )
}
