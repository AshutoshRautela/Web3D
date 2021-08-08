import React from "react";
import { ContainerProps } from "../container/Container";

export interface ContainerTabProps {
    heading: string;
}

export const ContainerTab = (props: ContainerProps) => {
    return (
        <div>
            <span>{props.heading}</span>
        </div>
    )
}