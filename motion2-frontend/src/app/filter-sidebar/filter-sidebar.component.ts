import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.less'],
})
export class FilterSidebarComponent implements OnInit {
  @Input() filters!: string[];
  @Output() filterSelected = new EventEmitter<string>();

  onFilterSelect(filter: string) {
    this.filterSelected.emit(filter);
  }

  constructor() {}
  ngOnInit(): void {}
}
