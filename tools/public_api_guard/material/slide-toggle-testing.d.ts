export declare abstract class _MatSlideToggleHarnessBase extends ComponentHarness {
    protected abstract _nativeElement: AsyncFactoryFn<TestElement>;
    blur(): Promise<void>;
    check(): Promise<void>;
    focus(): Promise<void>;
    getAriaLabel(): Promise<string | null>;
    getAriaLabelledby(): Promise<string | null>;
    getLabelText(): Promise<string>;
    getName(): Promise<string | null>;
    isChecked(): Promise<boolean>;
    isDisabled(): Promise<boolean>;
    isFocused(): Promise<boolean>;
    isRequired(): Promise<boolean>;
    isValid(): Promise<boolean>;
    abstract toggle(): Promise<void>;
    uncheck(): Promise<void>;
}

export declare class MatSlideToggleHarness extends _MatSlideToggleHarnessBase {
    protected _nativeElement: AsyncFactoryFn<TestElement>;
    toggle(): Promise<void>;
    static hostSelector: string;
    static with(options?: SlideToggleHarnessFilters): HarnessPredicate<MatSlideToggleHarness>;
}

export interface SlideToggleHarnessFilters extends BaseHarnessFilters {
    label?: string | RegExp;
    name?: string;
}
