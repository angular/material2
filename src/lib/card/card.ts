import {
  NgModule,
  ModuleWithProviders,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Directive
} from '@angular/core';


/**
 * Content of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: 'mat-card-content'
})
export class MatCardContent {}

/**
 * Title of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: 'mat-card-title'
})
export class MatCardTitle {}

/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: 'mat-card-subtitle'
})
export class MatCardSubtitle {}

/**
 * Action section of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: 'mat-card-actions'
})
export class MatCardActions {}


/*

<mat-card> is a basic content container component that adds the styles of a material design card.

While you can use this component alone,
it also provides a number of preset styles for common card sections, including:
 - mat-card-title
 - mat-card-subtitle
 - mat-card-content
 - mat-card-actions
 - mat-card-footer

 You can see some examples of cards here:
 http://embed.plnkr.co/s5O4YcyvbLhIApSrIhtj/

 TODO(kara): update link to demo site when it exists

*/

@Component({
  moduleId: module.id,
  selector: 'mat-card',
  templateUrl: 'card.html',
  styleUrls: ['card.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatCard {}


/*  The following components don't have any behavior.
 They simply use content projection to wrap user content
 for flex layout purposes in <mat-card> (and thus allow a cleaner, boilerplate-free API).


<mat-card-header> is a component intended to be used within the <mat-card> component.
It adds styles for a preset header section (i.e. a title, subtitle, and avatar layout).

You can see an example of a card with a header here:
http://embed.plnkr.co/tvJl19z3gZTQd6WmwkIa/

TODO(kara): update link to demo site when it exists
*/

@Component({
  moduleId: module.id,
  selector: 'mat-card-header',
  templateUrl: 'card-header.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatCardHeader {}

/*

<mat-card-title-group> is a component intended to be used within the <mat-card> component.
It adds styles for a preset layout that groups an image with a title section.

You can see an example of a card with a title-group section here:
http://embed.plnkr.co/EDfgCF9eKcXjini1WODm/

TODO(kara): update link to demo site when it exists
*/

@Component({
  moduleId: module.id,
  selector: 'mat-card-title-group',
  templateUrl: 'card-title-group.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatCardTitleGroup {}


@NgModule({
  exports: [
    MatCard, MatCardHeader, MatCardTitleGroup, MatCardContent, MatCardTitle, MatCardSubtitle,
    MatCardActions
  ],
  declarations: [
    MatCard, MatCardHeader, MatCardTitleGroup, MatCardContent, MatCardTitle, MatCardSubtitle,
    MatCardActions
  ],
})
export class MatCardModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MatCardModule,
      providers: []
    };
  }
}
