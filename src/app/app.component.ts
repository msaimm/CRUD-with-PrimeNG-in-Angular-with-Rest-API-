import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DataService } from './MyService/data.service';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PrimeCrud';



  constructor(private confirmationService: ConfirmationService, private api: DataService, private messageService: MessageService, private fb: FormBuilder) {

    this.form = fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      mobile: [null, Validators.required],
      salary: [null, Validators.required]
    })


    this.getAllEmployee();

  }

  showAdd:boolean
  showUpdate:boolean

  form!: FormGroup;

  display: boolean = false;


  showDialog() {
    this.display = true;
    this.form.reset();
    this.showAdd = true
    this.showUpdate = false
  }

  hideDialog() {

    this.display = false;
  }

  


  saveProduct() {

    this.api.postEmployee(this.form.value).subscribe({


      next: () => {
        this.hideDialog();
        this.form.reset();
        this.getAllEmployee();
        this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
      },

      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: 'Via MessageService' });
      }

    })
  }

  products;

  getAllEmployee() {
    this.api.getEmployee().subscribe(res => {

      this.products = res;

    })
  }

  first = 0;

  rows = 5;

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.products ? this.first === (this.products.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.products ? this.first === 0 : true;
  }

  @ViewChild('dt') dt: Table | undefined;

  applyFilterGlobal($event, stringVal) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  id;

  onEdit(row: any) {

    this.id = row.id
    this.form.controls['name'].setValue(row.name)
    this.form.controls['email'].setValue(row.email)
    this.form.controls['mobile'].setValue(row.mobile)
    this.form.controls['salary'].setValue(row.salary)

    this.display = true;
    this.showAdd = false
    this.showUpdate = true


  }

  updateEmployeeDetails() {

    this.api.updateEmployee(this.form.value, this.id)
      .subscribe(res => {

        this.hideDialog();
        this.form.reset();
        this.getAllEmployee();
        this.messageService.add({ severity: 'success', summary: 'Update Data Successfully', detail: 'Via MessageService' });
    
      })

  }

  deleteEmployee(row: any) {



    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        
        this.api.deleteEmployee(row.id).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Data Delete Successfully', detail: 'Via MessageService' });
          this.getAllEmployee();
        })
        
      }
  });

  }


  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.products);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "products");
    });
}

saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}

  


}
