export declare const MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS: InjectionToken<MatProgressSpinnerDefaultOptions>;

export declare function MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY(): MatProgressSpinnerDefaultOptions;

export declare class MatProgressSpinner extends _MatProgressSpinnerMixinBase implements OnInit, CanColor {
    readonly _circleRadius: number;
    readonly _circleStrokeWidth: number;
    _elementRef: ElementRef<HTMLElement>;
    _noopAnimations: boolean;
    readonly _strokeCircumference: number;
    readonly _strokeDashOffset: number | null;
    readonly _viewBox: string;
    diameter: number;
    mode: ProgressSpinnerMode;
    strokeWidth: number;
    value: number;
    constructor(_elementRef: ElementRef<HTMLElement>, platform: Platform, _document: any, animationMode: string, defaults?: MatProgressSpinnerDefaultOptions);
    ngOnInit(): void;
    static ngAcceptInputType_diameter: number | string;
    static ngAcceptInputType_strokeWidth: number | string;
    static ngAcceptInputType_value: number | string;
}

export interface MatProgressSpinnerDefaultOptions {
    _forceAnimations?: boolean;
    diameter?: number;
    strokeWidth?: number;
}

export declare class MatSpinner extends MatProgressSpinner {
    constructor(elementRef: ElementRef<HTMLElement>, platform: Platform, document: any, animationMode: string, defaults?: MatProgressSpinnerDefaultOptions);
    static ngAcceptInputType_diameter: number | string;
    static ngAcceptInputType_strokeWidth: number | string;
    static ngAcceptInputType_value: number | string;
}

export declare type ProgressSpinnerMode = 'determinate' | 'indeterminate';
