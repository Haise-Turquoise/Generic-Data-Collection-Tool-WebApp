import React, { useState, useMemo, useEffect} from 'react';
import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import CreateAuditLog from '../../AuditLog_Global';
import AttributeConfigController from '../../../controllers/AttributeConfig';
import {
    controllerAddRow,
    controllerEditRow,
    controllerDeleteRow,
    formatTimestamp,
    fetchWithStatus,
    calculateOptions
} from '../../../tools/misc'

import AttributeConfig from '../../../types/attributeconfig';

interface AttributeConfigMT extends AttributeConfig {
    tableData?: any;
}

const checkDuplicateKeyword = (rowData: AttributeConfigMT, tableData?: AttributeConfigMT[]) => {
    if (!tableData) {
        return true
    }
    // Check if Code is duplicate
    // field of element being edited -- null if not editing
    let current: any = null;
    if (rowData.tableData) {
        if (rowData.tableData.editing === 'delete') {
            return true;
        } else if (rowData.tableData.editing === 'update') {
            current = tableData.find((el: any) => el._id === rowData._id);
        }
    } else if (rowData._id) {
        // this case runs while submitting a change
        return true;
    }
    const duplicate = tableData.find((val: any) => val.attributeKeyword === rowData.attributeKeyword && val !== current)
    return duplicate ? "Duplicate Keyword Cannot Exist" : true
}

const validateCode = (rowData: AttributeConfigMT, tableData?: AttributeConfigMT[]) => {
    // Entry must be 3 digit number
    if (!(/^\d{3}$/).test(rowData.code)) {
        return "Entry must be a 3 digit number"
    }

    if (!tableData) {
        return true
    }
    // Validate Code -> must be non duplicate
    // field of element being edited -- null if not editing
    let current: any = null;
    if (rowData.tableData) {
        if (rowData.tableData.editing === 'delete') {
            return true;
        } else if (rowData.tableData.editing === 'update') {
            current = tableData.find((el: any) => el._id === rowData._id);
        }
    } else if (rowData._id) {
        // this case runs while submitting a change
        return true;
    }
    const duplicate = tableData.find((val: any) => val.code === rowData.code && val !== current)
    if (duplicate !== undefined) {
        return "Duplicate Code Cannot Exist"
    }
    return true;
}

const AttributeConfigHeader = () => {
    return (
        <Paper className="header">
            <Typography variant="h5">Attribute Configuration</Typography>
        </Paper>
    );
}

const AttributeConfigTable = () => {
    const [attributeConfigs, setAttributeConfigs] = useState<AttributeConfig[] | undefined>(undefined);
    const [readRowNum, setRowNum] = useState(1);
    const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

    useEffect(() => {
        fetchWithStatus<AttributeConfig>(AttributeConfigController, setAttributeConfigs, setStatus)
    }, [])

    // Convert Date
    attributeConfigs?.forEach((attributeConfig: AttributeConfig) => {
        attributeConfig.updatedAt = formatTimestamp(attributeConfig.updatedAt)
    });

    // Table Variables for Loading
    const preColumns: Column<AttributeConfigMT>[] = [{ title: 'Name', field: 'value' }];
    const preConfigs: AttributeConfigMT[] = [
        {
            _id: '',
            attributeKeyword: '',
            code: '',
            updatedBy: '',
            updatedAt: '',
        },
    ];

    // Prepare Columns for Material Table
    const columns: Column<AttributeConfigMT>[] = useMemo(
        () => [
            { title: 'Attribute Keyword', field: 'attributeKeyword', validate: rowData => checkDuplicateKeyword(rowData, attributeConfigs) },
            { title: 'Code', field: 'code', validate: rowData => validateCode(rowData, attributeConfigs) },
            {
                title: 'Modified On',
                field: 'updatedAt',
                editComponent: () => {
                    return <div></div>;
                }, 
            },
            {
                title: 'Updated By',
                field: 'updatedBy',
                editComponent: () => {
                    return <div></div>;
                },
            },
        ],
        [attributeConfigs],
    );

    // Prepare the options
    const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

    // Record who and when of the action
    function recordUpdate(attributeConfig: AttributeConfigMT) {
        //get username and record in Modified By column
        attributeConfig.updatedBy = localStorage.getItem('currentUser') || '';
        //record new date and time in Modified On column
        attributeConfig.updatedAt = new Date().toLocaleString();
    }

    // Editing Functionalities for Attribute Config
    const editable = useMemo(
        () => ({
            onRowAdd: (attributeConfig: AttributeConfigMT) =>
                new Promise<AttributeConfig | undefined>((resolve, reject) => {
                    recordUpdate(attributeConfig);
                    controllerAddRow(AttributeConfigController, setAttributeConfigs, attributeConfig)
                        .then((res: AttributeConfig) => {
                            if (res) {
                                resolve(res)
                            }
                            reject()
                        })
                }).then(newAttributeConfig => {
                    // For Auditlog
                    if (newAttributeConfig) {
                        CreateAuditLog(
                            null,
                            "Add Attribute Configuration",
                            "AttributeConfig",
                            newAttributeConfig._id,
                            {},
                            newAttributeConfig,
                        );
                    }
                }),

            onRowUpdate: (attributeConfig: AttributeConfigMT) =>
                new Promise((resolve, reject) => {
                    recordUpdate(attributeConfig);
                    // Find the old value before updating for Auditlog
                    (async () => {
                        const oldAttributeConfig = await AttributeConfigController.fetchAttributeConfig(attributeConfig._id);
                        CreateAuditLog(
                            null,
                            'Update Attribute Configuration',
                            'AttributeConfig',
                            attributeConfig._id,
                            oldAttributeConfig,
                            attributeConfig,
                        );
                    })();
                    // Do Update
                    controllerEditRow(AttributeConfigController, setAttributeConfigs, attributeConfig)
                        .then((res: boolean) => {
                            if (res) {
                                resolve(res)
                            }
                            reject()
                        })
                }),

            onRowDelete: (attributeConfig: AttributeConfigMT) =>
                new Promise((resolve, reject) => {
                    recordUpdate(attributeConfig);
                    // For Auditlog
                    const attributeConfig_trim = (({ tableData, ...o }) => o)(attributeConfig);
                    CreateAuditLog(null, "Delete Attribute Configuration", "AttributeConfig", attributeConfig._id, attributeConfig_trim, {});
                    controllerDeleteRow(AttributeConfigController, setAttributeConfigs, attributeConfig._id)
                        .then((res: boolean) => {
                            if (res) {
                                resolve(res)
                            }
                            reject()
                        })
                }),
        }),
        [],
    );

    useEffect(() => {
        setRowNum(attributeConfigs?.length || 0)
    }, [attributeConfigs]);

    return (
        <MaterialTable
            key={readRowNum}
            columns={!!attributeConfigs ? columns : preColumns}
            data={!!attributeConfigs ? attributeConfigs : preConfigs}
            editable={!!attributeConfigs ? editable : undefined}
            options={options}
        />
    );
}

const AttributeConfig = (props: any) => (
    <div>
        <AttributeConfigHeader />
        <AttributeConfigTable />
    </div>
);

export default AttributeConfig;