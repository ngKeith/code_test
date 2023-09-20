import { Injectable } from '@angular/core';
import { DbService } from '@app/services/pouchdb/crud.service';
import {} from 'src/app/shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root',
})
export class DbFilterService {
  constructor(public dbService: DbService) {}

  // public async getLodgeGuests(lodgeId: string): Promise<GuestDetails[]> {
  //     let result = await this.dbService.pouchdb.allDocs({
  //         include_docs: true,
  //         attachments: false,
  //       })
  //     let outputRows: GuestDetails[] = []
  //     let rows = result.rows.map(({ doc }) => doc);
  //     outputRows = rows.filter(row => row.hasOwnProperty("_id") && row.hasOwnProperty("lodgesVisited") && row._id.includes("GST") && (row.lodgesVisited.includes(lodgeId) || lodgeId == ""));
  //     return outputRows;
  // }
}
