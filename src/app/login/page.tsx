'use client';
import React from 'react';
import { Banner, Button, Card, Checkbox, Input, PinCode, Typography } from '@douyinfe/semi-ui-19';
import { IconLock, IconPhone } from '@douyinfe/semi-icons';
import { checkLoggedIn } from '@/utils';
import { CaptchaPacket, LoginPacket } from '@/interfaces/login';

export default function LoginPage() {
    const [symbolValue, setSymbolValue] = React.useState('');
    const [passwordValue, setPasswordValue] = React.useState('');
    const [privacyValue, setPrivacyValue] = React.useState(false);

    const [captchaBase64, setCaptchaBase64] = React.useState('');
    const [captchaAnswer, setCaptchaAnswer] = React.useState('');

    const [errorValue, setErrorValue] = React.useState('');
    const [successValue, setSuccessValue] = React.useState('');

    const [visuallyValue, setVisuallyValue] = React.useState(true);
    const [passportReadOnly, setPassportReadOnly] = React.useState(false);
    const [requiredCaptcha, setRequiredCaptcha] = React.useState(false);

    const processCaptcha = async () => {
        const tokenCodeRequest = await fetch('/passport/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'client-id': '111101',
                'device-id': '_',
                'ver-num': '0.0.0',
            },
            body: `symbol=${symbolValue}&password=${passwordValue}&captcha=${captchaAnswer}`,
        });
        const tokenCodeResult: LoginPacket = await tokenCodeRequest.json();

        if (tokenCodeResult.errcode !== 0) {
            setErrorValue(tokenCodeResult.errmsg);
            setPassportReadOnly(false);
            setRequiredCaptcha(false);
            setVisuallyValue(true);
            setCaptchaAnswer('');
        } else {
            setSuccessValue('登录成功！正在跳转到主页...');

            await fetch('/passport/get_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'client-id': '111101',
                    'device-id': '_',
                    'ver-num': '0.0.0',
                },
                body: `code=${tokenCodeResult.data.code}`,
            });

            setTimeout(() => {
                location.href = '/';
            }, 500);
        }
    };

    const loginEvent = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (symbolValue.length !== 11) {
            setErrorValue('不合法的手机号！');
            return;
        } else if (passwordValue === '') {
            setErrorValue('密码不能为空！');
            return;
        } else if (requiredCaptcha && captchaAnswer === '') {
            setErrorValue('验证码不能为空！');
            return;
        } else if (!privacyValue) {
            setErrorValue('请阅读并同意相关协议！');
            return;
        } else {
            setErrorValue('');
        }

        if (requiredCaptcha) {
            await processCaptcha();
            return;
        }

        const captchaRequest = await fetch('/passport/captcha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'client-id': '111101',
                'device-id': '_',
                'ver-num': '0.0.0',
            },
            body: `symbol=${symbolValue}&password=${passwordValue}&scene=3`,
        });
        const captchaResult: CaptchaPacket = await captchaRequest.json();

        setVisuallyValue(false);
        setPassportReadOnly(true);
        setRequiredCaptcha(true);
        setCaptchaBase64(captchaResult.data.captcha);
    };

    React.useEffect(() => {
        if (checkLoggedIn()) {
            setSuccessValue('您已登录！正在跳转到主页...');
            setTimeout(() => {
                location.href = '/';
            }, 500);
        }
    }, []);

    return (
        <div className="m-4 mx-auto max-w-md">
            <Card header={<Typography.Title heading={5}>欢迎登录 NewXesFrontend</Typography.Title>}>
                <form onSubmit={loginEvent}>
                    {errorValue && <Banner className="mb-2" type="danger" closeIcon description={errorValue} />}

                    {successValue && <Banner className="mb-2" type="success" closeIcon description={successValue} />}

                    <Input
                        prefix={<IconPhone />}
                        placeholder={'手机号'}
                        autoComplete="tel"
                        autoFocus
                        disabled={passportReadOnly}
                        value={symbolValue}
                        onChange={(value, e) => setSymbolValue(value)}
                    />

                    <Input
                        className="mt-4"
                        prefix={<IconLock />}
                        placeholder={'密码'}
                        autoComplete="current-password"
                        disabled={passportReadOnly}
                        value={passwordValue}
                        onChange={(value, e) => setPasswordValue(value)}
                        mode="password"
                        showClearIgnoreDisabled
                    />

                    <Checkbox
                        className="mt-4"
                        disabled={passportReadOnly}
                        checked={privacyValue}
                        onChange={e => setPrivacyValue(e.target.checked ?? false)}
                    >
                        我已阅读并同意
                        <a
                            href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/agreement"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 4px', color: '#1976d2' }}
                        >
                            《学而思网校用户协议》
                        </a>
                        、
                        <a
                            href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 4px', color: '#1976d2' }}
                        >
                            《用户个人信息保护政策》
                        </a>
                        、
                        <a
                            href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/childpolicy"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 4px', color: '#1976d2' }}
                        >
                            《儿童个人信息保护规则》
                        </a>
                        、
                        <a
                            href="/eula"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 4px', color: '#1976d2' }}
                        >
                            《NewXesFrontend 最终用户协议》
                        </a>
                    </Checkbox>

                    {!visuallyValue && (
                        <div className='flex space-between items-center mt-4'>
                            <PinCode
                                count={4}
                                format={"mixed"}
                                defaultValue={captchaAnswer}
                                onComplete={(value) => setCaptchaAnswer(value)}
                            />
                            <img src={captchaBase64} alt="验证码" style={{ height: '40px' }} />
                        </div>
                    )}

                    <Button
                        className="mt-4"
                        type="primary"
                        size="large"
                        htmlType='submit'
                    >
                        登录
                    </Button>
                </form>
            </Card>
        </div>
    );
}
