
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
import { AdminService } from '../service/AdminService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './AdminTable.css';

const AdminTable = () => {

    let emptyAdmin = {
        id: null,
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        nearestPopularPlace: '',
        phoneNumber: null
    };
    const [Admins, setAdmins] = useState(null);
    const [AdminDialog, setAdminDialog] = useState(false);
    const [deleteAdminDialog, setDeleteAdminDialog] = useState(false);
    const [deleteAdminsDialog, setDeleteAdminsDialog] = useState(false);
    const [Admin, setAdmin] = useState(emptyAdmin);
    const [selectedAdmins, setSelectedAdmins] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const adminService = new AdminService();

    useEffect(() => {
        adminService.getAdmins().then(data => setAdmins(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const openNew = () => {
        setAdmin(emptyAdmin);
        setSubmitted(false);
        setAdminDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setAdminDialog(false);
    }

    const hideDeleteAdminDialog = () => {
        setDeleteAdminDialog(false);
    }

    const hideDeleteAdminsDialog = () => {
        setDeleteAdminsDialog(false);
    }

    const saveAdmin = () => {
        setSubmitted(true);

        if (Admin.email.trim()) {
            let _Admins = [...Admins];
            let _Admin = {...Admin};
            if (Admin.id) {
                const index = findIndexById(Admin.id);

                _Admins[index] = _Admin;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Admin Updated', life: 3000 });
            }
            else {
                _Admin.id = createId();
                _Admin.image = 'Admin-placeholder.svg';
                _Admins.push(_Admin);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Admin Created', life: 3000 });
            }

            setAdmins(_Admins);
            setAdminDialog(false);
            setAdmin(emptyAdmin);
        }
    }

    const editAdmin = (Admin) => {
        setAdmin({...Admin});
        setAdminDialog(true);
    }

    const confirmDeleteAdmin = (Admin) => {
        setAdmin(Admin);
        setDeleteAdminDialog(true);
    }

    const deleteAdmin = () => {
        let _Admins = Admins.filter(val => val.id !== Admin.id);
        setAdmins(_Admins);
        setDeleteAdminDialog(false);
        setAdmin(emptyAdmin);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Admin Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < Admins.length; i++) {
            if (Admins[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        return 5222222;
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

            const _Admins = [...Admins, ...importedData];

            setAdmins(_Admins);
        };

        reader.readAsText(file, 'UTF-8');
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteAdminsDialog(true);
    }

    const deleteSelectedAdmins = () => {
        let _Admins = Admins.filter(val => !selectedAdmins.includes(val));
        setAdmins(_Admins);
        setDeleteAdminsDialog(false);
        setSelectedAdmins(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Admins Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _Admin = {...Admin};
        _Admin[`${name}`] = val;

        setAdmin(_Admin);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _Admin = {...Admin};
        _Admin[`${name}`] = val;

        setAdmin(_Admin);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }


    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Admins</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const AdminDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveAdmin} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={Admins} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} admins"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column field="firstName" header="first name" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="lastName" header="last name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="email" header="email" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="phoneNumber" header="phone number" sortable style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            <Dialog visible={AdminDialog} style={{ width: '450px' }} header="admin Details" modal className="p-fluid" footer={AdminDialogFooter} onHide={hideDialog}>
                {Admin.image && <img src={`images/admin/${Admin.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={Admin.image} className="admin-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="email">email</label>
                    <InputText id="email" value={Admin.email}  onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !Admin.email })} />
                    {submitted && !Admin.email && <small className="p-error">email is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="firstName">first name</label>
                    <InputText id="firstName" value={Admin.firstName} onChange={(e) => onInputChange(e, 'firstName')} required autoFocus className={classNames({ 'p-invalid': submitted && !Admin.firstName })} />
                    {submitted && !Admin.firstName && <small className="p-error">first name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="lastName">last name</label>
                    <InputText id="lastName" value={Admin.lastName} onChange={(e) => onInputChange(e, 'lastName')} required autoFocus className={classNames({ 'p-invalid': submitted && !Admin.lastName })} />
                    {submitted && !Admin.lastName && <small className="p-error">last name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="address">addresse</label>
                    <InputText id="address" value={Admin.address} onChange={(e) => onInputChange(e, 'address')} required autoFocus className={classNames({ 'p-invalid': submitted && !Admin.address })} />
                    {submitted && !Admin.address && <small className="p-error">address is required.</small>}
                </div>

                <div className="field">
                    <label htmlFor="city">city</label>
                    <InputText id="city" value={Admin.city} onChange={(e) => onInputChange(e, 'city')} required autoFocus className={classNames({ 'p-invalid': submitted && !Admin.city })} />
                    {submitted && !Admin.city && <small className="p-error">city is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="nearestPopularPlace">nearest popular place</label>
                    <InputText id="nearestPopularPlace" value={Admin.nearestPopularPlace} onChange={(e) => onInputChange(e, 'nearestPopularPlace')} required autoFocus className={classNames({ 'p-invalid': submitted && !Admin.nearestPopularPlace })} />
                    {submitted && !Admin.nearestPopularPlace && <small className="p-error">nearest popular place is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="phoneNumber">phone number</label>
                    <InputNumber id="phoneNumber" value={Admin.phoneNumber} onChange={(e) => onInputNumberChange(e, 'phoneNumber')} required autoFocus className={classNames({ 'p-invalid': submitted && !Admin.phoneNumber })} />
                    {submitted && !Admin.phoneNumber && <small className="p-error">phone number is required.</small>}
                </div>
            </Dialog>
        </div>
    );
}
export default AdminTable;                                