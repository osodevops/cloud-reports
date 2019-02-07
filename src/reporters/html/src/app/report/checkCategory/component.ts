import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudReportService } from '../report.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cloud-report-check-category',
  templateUrl: 'component.html',
  styleUrls: ['component.scss']
})
export class CloudReportCheckCategoryComponent implements OnInit {

  regions: string[];
  checkCategories: object[];
  selectedRegion: string;
  globalService: boolean;
  service: string;
  scanReportData: Object;

  constructor(private route: ActivatedRoute,
    private cloudReportService: CloudReportService,
    private elementRef: ElementRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCheckCategoryPageData();
  }

  loadCheckCategoryPageData() {
    this.service = this.route.snapshot.paramMap.get('service');
    this.cloudReportService.getScanReportData()
      .subscribe((data) => {
        this.scanReportData = data;
        const regionsHaveData = this.cloudReportService.getRegionsWithData(data, 'aws.' + this.service);
        if (regionsHaveData.length === 1) {
          this.selectedRegion = regionsHaveData[0];
          this.regions = regionsHaveData;
        } else {
          this.regions = regionsHaveData;
          this.selectedRegion = this.cloudReportService.manageRegion(undefined, 'aws.' + this.service, data);
        }
        this.checkCategories = this.cloudReportService.getCheckCategoryData('aws.' + this.service, this.selectedRegion, data);
        if (!this.checkCategories.length) {
          alert('No data to show');
          this.router.navigate(['/']);
        }
      });
  }

  onRegionChange(region) {
    this.cloudReportService.manageRegion(region);
    this.ngOnInit();
  }

}
