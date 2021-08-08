import React, { CSSProperties, ReactNode } from "react";
import { ContainerTabProps } from '../container-tab/ContainerTab';
import "./Container.scss";

export interface ContainerProps {
    heading: string;
    style?: CSSProperties;
    children?: ReactNode;
    tabs?: ContainerTabProps
}

export const Container = (props: ContainerProps) => {
    
    return (
        <div style = {props.style ? props.style : {}} className = "container">
            { props.children }
        </div>
    );
}