import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { ChipsModule } from 'primeng/chips';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const modules = [
  ContextMenuModule,
  InputTextModule,
  InputTextareaModule,
  CalendarModule,
  ButtonModule,
  CardModule,
  DialogModule,
  FieldsetModule,
  ToolbarModule,
  DropdownModule,
  SelectButtonModule,
  FileUploadModule,
  AutoCompleteModule,
  MessagesModule,
  MessageModule,
  ConfirmDialogModule,
  ToastModule,
  PaginatorModule,
  TooltipModule,
  SidebarModule,
  ChipsModule,
  ProgressSpinnerModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class PrimengModule { }