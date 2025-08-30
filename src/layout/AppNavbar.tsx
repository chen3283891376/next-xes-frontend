'use client';
import React from "react";
import { BackTop, Dropdown, Nav, Typography } from "@douyinfe/semi-ui";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import { IconArrowUp } from "@douyinfe/semi-icons";

const AppNavbar = () => {
    const style = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: 30,
        borderRadius: '100%',
        backgroundColor: '#0077fa',
        color: '#fff',
        bottom: 100,
    };
    return (
        <div style={{ width: '100%' }}>
            <Nav 
                mode="horizontal"
                renderWrapper={({ itemElement, isSubNav, isInSubNav, props }) => {
                    const routerMap = {
                        discover: '/discover',
                        about: '/about'
                    };
                    return (
                        <Link
                            style={{ textDecoration: "none" }}
                            // @ts-ignore
                            href={routerMap[props.itemKey]}
                        >
                            {itemElement}
                        </Link>
                    );
                }}
                items={[
                    { itemKey: 'discover', text: '发现' },
                    { itemKey: 'about', text: '关于' }
                ]}
                footer={
                    <div>
                        <SearchInput />
                        <Dropdown render={
                            <Dropdown.Menu>
                                <Dropdown.Item>图形化编程</Dropdown.Item>
                                <Dropdown.Item>Python</Dropdown.Item>
                                <Dropdown.Item>C++</Dropdown.Item>
                            </Dropdown.Menu>
                        }>
                            <span className="mr-4">创作</span>
                        </Dropdown>
                    </div>
                }
                header={{
                    text: <Typography.Title
                        className="cursor-pointer" 
                        onClick={() => {
                            window.location.href = '/';
                        }}
                        heading={5}
                    >XesCoding</Typography.Title>,
                }}
            />
            <BackTop style={style}>
                <IconArrowUp />
            </BackTop>
        </div>
    )
}
export default AppNavbar;
