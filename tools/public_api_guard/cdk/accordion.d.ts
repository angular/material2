export declare class CdkAccordion implements OnDestroy, OnChanges {
    readonly _openCloseAllActions: Subject<boolean>;
    readonly _stateChanges: Subject<SimpleChanges>;
    readonly id: string;
    multi: boolean;
    closeAll(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    openAll(): void;
    static ngAcceptInputType_multi: boolean | string;
}

export declare class CdkAccordionItem implements OnDestroy {
    protected _expansionDispatcher: UniqueSelectionDispatcher;
    accordion: CdkAccordion;
    closed: EventEmitter<void>;
    destroyed: EventEmitter<void>;
    disabled: any;
    expanded: any;
    expandedChange: EventEmitter<boolean>;
    readonly id: string;
    opened: EventEmitter<void>;
    constructor(accordion: CdkAccordion, _changeDetectorRef: ChangeDetectorRef, _expansionDispatcher: UniqueSelectionDispatcher);
    close(): void;
    ngOnDestroy(): void;
    open(): void;
    toggle(): void;
    static ngAcceptInputType_disabled: boolean | string;
    static ngAcceptInputType_expanded: boolean | string;
}

export declare class CdkAccordionModule {
}
