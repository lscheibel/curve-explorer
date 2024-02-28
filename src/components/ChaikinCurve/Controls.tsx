import React, { useRef } from 'react';
import { ChaikinCurveOptions } from './ChaikinCurve';
import { clamp } from '../../utils/math';
import styles from './Controls.module.scss';
import { useStableCallback } from '../../utils/useStableCallback';

export interface ControlsProps {
    options: ChaikinCurveOptions;
    onChange: (options: ChaikinCurveOptions) => void;
}

const Controls = ({ options, onChange }: ControlsProps) => {
    const setOptions = (partial: Partial<ChaikinCurveOptions>) => {
        onChange({ ...options, ...partial });
    };

    return (
        <div
            style={{
                background: 'var(--true-white)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                color: 'rgba(0,0,0,.0.87)',
            }}
        >
            <Group>
                <BoolInput value={options.closedShape} onChange={(value) => setOptions({ closedShape: value })}>
                    CLOSE SHAPE
                </BoolInput>
            </Group>
            <Group>
                <NumberInput
                    value={options.factor}
                    formatter={(value) => value.toFixed(2)}
                    onChange={(value) => setOptions({ factor: value })}
                    step={0.01}
                    min={0}
                    max={1}
                >
                    RATIO
                </NumberInput>
            </Group>

            <Divider />

            <Group style={{ opacity: options.dynamicResolution ? 0.3 : 1 }}>
                <NumberInput
                    value={options.iterations}
                    onChange={(value) => setOptions({ iterations: value })}
                    step={1}
                    plusButtonProps={{
                        onMouseEnter: () => setOptions({ showNextStep: true }),
                        onMouseLeave: () => setOptions({ showNextStep: false }),
                    }}
                    min={0}
                    max={10}
                >
                    ITERATIONS
                </NumberInput>
            </Group>

            <Group>
                <BoolInput
                    value={options.dynamicResolution}
                    onChange={(value) => setOptions({ dynamicResolution: value })}
                >
                    DYNAMIC RESOLUTION
                </BoolInput>
            </Group>

            <Group style={{ opacity: options.dynamicResolution ? 1 : 0.3 }}>
                <NumberInput
                    value={options.maxAngle}
                    onChange={(value) => setOptions({ maxAngle: value })}
                    step={1}
                    min={0}
                    max={360}
                >
                    MAX ANGLE
                </NumberInput>
            </Group>
            <Group style={{ opacity: options.dynamicResolution ? 1 : 0.3 }}>
                Max Iterations:{' '}
                <NumberInput
                    value={options.maxIterations}
                    onChange={(value) => setOptions({ maxIterations: value })}
                    step={1}
                    min={0}
                    max={10}
                >
                    MAX ITERATIONS
                </NumberInput>
            </Group>

            <Divider />

            <Group>
                <BoolInput value={options.showDots} onChange={(value) => setOptions({ showDots: value })}>
                    SHOW DOTS
                </BoolInput>
            </Group>
            <Group>
                <BoolInput value={options.showBSpline} onChange={(value) => setOptions({ showBSpline: value })}>
                    SHOW SPLINE
                </BoolInput>
            </Group>
        </div>
    );
};

export default Controls;

const Group = (props: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            {...props}
            style={{
                padding: '8px 8px',
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'center',
                justifyContent: 'center',
                ...props.style,
            }}
        />
    );
};

const Divider = () => {
    return (
        <div style={{ padding: '0 8px' }}>
            <div style={{ height: '100%', width: 1, background: 'var(--white)' }} />
        </div>
    );
};

interface NumberInputProps {
    value: number;
    formatter?: (value: number) => string;
    step: number;
    onChange: (num: number) => void;
    plusButtonProps?: React.HTMLAttributes<HTMLButtonElement>;
    children: React.ReactNode;
    min: number;
    max: number;
}

const NumberInput = ({
    value,
    onChange,
    step,
    plusButtonProps,
    children,
    min,
    max,
    formatter = (v) => '' + v,
}: NumberInputProps) => {
    const decIterations = useStableCallback(() => {
        onChange(clamp(value - step, min, max));
    });
    const incIterations = useStableCallback(() => {
        onChange(clamp(value + step, min, max));
    });

    const timeoutRef = useRef<any | null>(null);
    const countRef = useRef(0);

    const repeat = (fn: () => void) => {
        console.log('repeat');
        fn();
        countRef.current++;

        if (countRef.current > 20) {
            timeoutRef.current = setTimeout(() => repeat(fn), 25);
        } else if (countRef.current > 5) {
            timeoutRef.current = setTimeout(() => repeat(fn), 50);
        } else if (countRef.current > 1) {
            timeoutRef.current = setTimeout(() => repeat(fn), 100);
        } else {
            timeoutRef.current = setTimeout(() => repeat(fn), 500);
        }
    };

    const cancel = () => {
        countRef.current = 0;
        if (timeoutRef.current != null) {
            clearTimeout(timeoutRef.current);
        }
    };

    return (
        <div className={styles.numberInput}>
            <div className={styles.numberControls}>
                <button
                    className={styles.numberButton}
                    onPointerDown={() => repeat(decIterations)}
                    onPointerUp={cancel}
                >
                    <span>-</span>
                </button>
                <span className={styles.numberValue}>{formatter(value)}</span>
                <button
                    className={styles.numberButton}
                    onPointerDown={() => repeat(incIterations)}
                    onPointerUp={cancel}
                    {...plusButtonProps}
                >
                    <span>+</span>
                </button>
            </div>

            <span style={{ fontWeight: '400' }}>{children}</span>
        </div>
    );
};

interface BoolInputProps {
    value: boolean;
    onChange: (bool: boolean) => void;
    children: React.ReactNode;
}

const BoolInput = ({ value, onChange, children }: BoolInputProps) => {
    return (
        <label style={{ display: 'flex', gap: '4px', fontWeight: '700' }}>
            <input
                type={'checkbox'}
                checked={value}
                onChange={(e) => {
                    onChange(e.target.checked);
                }}
            />
            <span style={{ fontWeight: '400' }}>{children}</span>
        </label>
    );
};
