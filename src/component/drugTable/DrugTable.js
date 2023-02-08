import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../index.css';
import ReactDOM from 'react-dom';

import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DrugService } from '../service/DrugService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './DrugTable.css';

const DrugTable = () => {

    let emptyDrug = {
        id: null,
        drugName: '',
        genericNames: null,
        price: 0,
        doseType: '',
        company: null
    };

    const [Drugs, setDrugs] = useState(null);
    const [DrugDialog, setDrugDialog] = useState(false);
    const [deleteDrugDialog, setDeleteDrugDialog] = useState(false);
    const [deleteDrugsDialog, setDeleteDrugsDialog] = useState(false);
    const [Drug, setDrug] = useState(emptyDrug);
    const [selectedDrugs, setSelectedDrugs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const drugService = new DrugService();

    useEffect(() => {
        drugService.getDrugs().then(data => setDrugs(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const openNew = () => {
        setDrug(emptyDrug);
        setSubmitted(false);
        setDrugDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setDrugDialog(false);
    }

    const hideDeleteDrugDialog = () => {
        setDeleteDrugDialog(false);
    }

    const hideDeleteDrugsDialog = () => {
        setDeleteDrugsDialog(false);
    }

    const saveDrug = () => {
        setSubmitted(true);

        if (Drug.name.trim()) {
            let _Drugs = [...Drugs];
            let _Drug = {...Drug};
            if (Drug.id) {
                const index = findIndexById(Drug.id);

                _Drugs[index] = _Drug;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Drug Updated', life: 3000 });
            }
            else {
                _Drug.id = createId();
                _Drug.image = 'Drug-placeholder.svg';
                _Drugs.push(_Drug);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Drug Created', life: 3000 });
            }

            setDrugs(_Drugs);
            setDrugDialog(false);
            setDrug(emptyDrug);
        }
    }

    const editDrug = (Drug) => {
        setDrug({...Drug});
        setDrugDialog(true);
    }

    const confirmDeleteDrug = (Drug) => {
        setDrug(Drug);
        setDeleteDrugDialog(true);
    }

    const deleteDrug = () => {
        let _Drugs = Drugs.filter(val => val.id !== Drug.id);
        setDrugs(_Drugs);
        setDeleteDrugDialog(false);
        setDrug(emptyDrug);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Drug Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < Drugs.length; i++) {
            if (Drugs[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const importCSV = (e) => {
        const file = e.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const data = csv.split('\n');

            // Prepare DataTable
            const cols = data[0].replace(/['"]+/g, '').split(',');
            data.shift();

            const importedData = data.map(d => {
                d = d.split(',');
                const processedData = cols.reduce((obj, c, i) => {
                    c = c === 'Status' ? 'inventoryStatus' : (c === 'Reviews' ? 'rating' : c.toLowerCase());
                    obj[c] = d[i].replace(/['"]+/g, '');
                    (c === 'price' || c === 'rating') && (obj[c] = parseFloat(obj[c]));
                    return obj;
                }, {});

                processedData['id'] = createId();
                return processedData;
            });

            const _Drugs = [...Drugs, ...importedData];

            setDrugs(_Drugs);
        };

        reader.readAsText(file, 'UTF-8');
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteDrugsDialog(true);
    }

    const deleteSelectedDrugs = () => {
        let _Drugs = Drugs.filter(val => !selectedDrugs.includes(val));
        setDrugs(_Drugs);
        setDeleteDrugsDialog(false);
        setSelectedDrugs(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Drugs Deleted', life: 3000 });
    }

    const onCategoryChange = (e) => {
        let _Drug = {...Drug};
        _Drug['category'] = e.value;
        setDrug(_Drug);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Drug = {...Drug};
        _Drug[`${name}`] = val;

        setDrug(_Drug);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _Drug = {...Drug};
        _Drug[`${name}`] = val;

        setDrug(_Drug);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedDrugs || !selectedDrugs.length} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const imageBodyTemplate = (rowData) => {
        return <img src={`images/Drug/${rowData.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="Drug-image" />
    }

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    }

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    }

    const statusBodyTemplate = (rowData) => {
        return <span className={`Drug-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editDrug(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteDrug(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Drugs</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const DrugDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDrug} />
        </React.Fragment>
    );
    const deleteDrugDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDrugDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteDrug} />
        </React.Fragment>
    );
    const deleteDrugsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDrugsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedDrugs} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={Drugs} selection={selectedDrugs} onSelectionChange={(e) => setSelectedDrugs(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Drugs"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                    <Column field="drugName" header="drug name" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="genericNames" header="generic names" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="doseType" header="Dose Type" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="company" header="Company" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={DrugDialog} style={{ width: '450px' }} header="Drug Details" modal className="p-fluid" footer={DrugDialogFooter} onHide={hideDialog}>
                {Drug.image && <img src={`images/Drug/${Drug.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={Drug.image} className="Drug-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={Drug.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !Drug.name })} />
                    {submitted && !Drug.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" value={Drug.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>

                <div className="field">
                    <label className="mb-3">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={Drug.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={Drug.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={Drug.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={Drug.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price">Price</label>
                        <InputNumber id="price" value={Drug.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity">Quantity</label>
                        <InputNumber id="quantity" value={Drug.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteDrugDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDrugDialogFooter} onHide={hideDeleteDrugDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {Drug && <span>Are you sure you want to delete <b>{Drug.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteDrugsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDrugsDialogFooter} onHide={hideDeleteDrugsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {Drug && <span>Are you sure you want to delete the selected Drugs?</span>}
                </div>
            </Dialog>
        </div>
    );
}
export default DrugTable;                