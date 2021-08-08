import React, { CSSProperties } from 'react';
import './Inspector.scss';

import { Container } from '../shared/container/Container';

export const Inspector = () => {

    const inspectorStyle: CSSProperties = {
        position: 'absolute',
        top: '0%',
        right: '0%',
        height: '100vh',
        width: '300px',
    }

    return (
        <Container style = {inspectorStyle} heading = {"Inspector"}></Container>
    )
}