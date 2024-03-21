import React from 'react';
import styles from './Credits.module.scss';

const Credits = () => {
    return (
        <div className={styles.credits}>
            <a href={'https://github.com/lscheibel/curve-explorer'}>Source</a> — Made with 💙 by{' '}
            <a href={'https://lennardscheibel.de'}>Lennard Scheibel</a>
        </div>
    );
};

export default Credits;
