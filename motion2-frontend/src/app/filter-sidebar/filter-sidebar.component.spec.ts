import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSidebarComponent } from './filter-sidebar.component';

describe('FilterSidebarComponent', () => {
  let component: FilterSidebarComponent;
  let fixture: ComponentFixture<FilterSidebarComponent>;

  const filters = ['all', 'incomplete', 'complete'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterSidebarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSidebarComponent);
    component = fixture.componentInstance;
    component.filters = filters;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the sidebar', () => {
    const filterListItems = fixture.nativeElement.querySelectorAll(
      'li'
    ) as HTMLElement[];
    let filterListItemTexts: (string | null)[] = [];
    for (let filter of filterListItems) {
      filterListItemTexts.push(filter.textContent);
    }

    expect(filterListItemTexts).toEqual(filters);
  });

  it('should emit the selected filter', () => {
    spyOn(component.filterSelected, 'emit');

    const filterListItems = fixture.nativeElement.querySelectorAll(
      'li > button'
    ) as HTMLElement[];

    filterListItems[0].click();
    expect(component.filterSelected.emit).toHaveBeenCalledWith(filters[0]);

    filterListItems[1].click();
    expect(component.filterSelected.emit).toHaveBeenCalledWith(filters[1]);

    filterListItems[2].click();
    expect(component.filterSelected.emit).toHaveBeenCalledWith(filters[2]);
  });
});
