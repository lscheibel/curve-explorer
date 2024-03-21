import React, { useRef } from 'react';
import { ChaikinCurveOptions, initialValues } from './ChaikinCurve';
import { clamp } from '../../utils/math';
import styles from './Controls.module.scss';
import { useStableCallback } from '../../utils/useStableCallback';
import cn from 'classnames';

export interface ControlsProps {
    options: ChaikinCurveOptions;
    onChange: (options: ChaikinCurveOptions) => void;
}

const Controls = ({ options, onChange }: ControlsProps) => {
    const setOptions = (partial: Partial<ChaikinCurveOptions>) => {
        onChange({ ...options, ...partial });
    };

    return (
        <div className={styles.container}>
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
                    onReset={() => setOptions({ factor: initialValues.factor })}
                    step={0.01}
                    min={0}
                    max={1}
                >
                    RATIO
                </NumberInput>
            </Group>

            <Divider />

            <Group>
                <BoolInput
                    value={options.dynamicResolution}
                    onChange={(value) => setOptions({ dynamicResolution: value })}
                >
                    DYNAMIC RESOLUTION
                </BoolInput>
            </Group>

            {!options.dynamicResolution && (
                <Group style={{ opacity: options.dynamicResolution ? 0.3 : 1 }}>
                    <NumberInput
                        value={options.iterations}
                        onChange={(value) => setOptions({ iterations: value })}
                        onReset={() => setOptions({ iterations: initialValues.iterations })}
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
            )}

            {options.dynamicResolution && (
                <Group style={{ opacity: options.dynamicResolution ? 1 : 0.3 }}>
                    <NumberInput
                        value={options.maxAngle}
                        onChange={(value) => setOptions({ maxAngle: value })}
                        onReset={() => setOptions({ maxAngle: initialValues.maxAngle })}
                        step={1}
                        min={0}
                        max={360}
                    >
                        MAX ANGLE
                    </NumberInput>
                </Group>
            )}

            {options.dynamicResolution && (
                <Group style={{ opacity: options.dynamicResolution ? 1 : 0.3 }}>
                    <NumberInput
                        value={options.maxIterations}
                        onChange={(value) => setOptions({ maxIterations: value })}
                        onReset={() => setOptions({ maxIterations: initialValues.maxIterations })}
                        step={1}
                        min={0}
                        max={10}
                    >
                        MAX ITERATIONS
                    </NumberInput>
                </Group>
            )}

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
    return <div {...props} className={cn(styles.controlGroup)} />;
};

const Divider = () => {
    return (
        <div className={styles.divider} style={{ padding: '0 8px' }}>
            <div className={styles.dividerLine} />
        </div>
    );
};

interface NumberInputProps {
    value: number;
    formatter?: (value: number) => string;
    step: number;
    onChange: (num: number) => void;
    onReset: () => void;
    plusButtonProps?: React.HTMLAttributes<HTMLButtonElement>;
    children: React.ReactNode;
    min: number;
    max: number;
}

const NumberInput = ({
    value,
    onChange,
    onReset,
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

    const isMouseDownRef = useRef(false);

    const repeat = (fn: () => void) => {
        if (!isMouseDownRef.current) return;

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
        isMouseDownRef.current = false;
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
                    onPointerDown={() => {
                        isMouseDownRef.current = true;
                        repeat(decIterations);
                    }}
                    onPointerUp={cancel}
                    onPointerLeave={cancel}
                >
                    <span>-</span>
                </button>
                <span className={styles.numberValue} onDoubleClick={onReset}>
                    {formatter(value)}
                </span>
                <button
                    className={styles.numberButton}
                    onPointerDown={() => {
                        isMouseDownRef.current = true;
                        repeat(incIterations);
                    }}
                    onPointerUp={cancel}
                    onPointerLeave={cancel}
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
        <label className={styles.checkboxLabel}>
            <input
                className={styles.checkboxInput}
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
