import { useState } from 'react'
import { RiListSettingsFill } from "react-icons/ri";
import { initialColumns } from '../constant/InitialColumns';
import Table from 'react-bootstrap/Table';

import TableModal from './TableModal';
import Loader from './Loader';


const TableData = ({ data, totalProjectValue, totalProjectCount }) => {

    const [columns, setColumns] = useState(initialColumns);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);
    const [apiEndpoints, setApiEndpoints] = useState({
        'no_of_projects_minimum_ideal_18': 'https://retoolapi.dev/raJ2QY/no_of_projects',
        'total_project_value_minimum_ideal_8000_usd': 'https://retoolapi.dev/qQwvdU/total_project_value',
        'total_released_amount':'https://retoolapi.dev/g8dYiX/total_released_amount',
        'no_of_fully_completed_project':'https://retoolapi.dev/Ap1WeY/no_of_fully_completed_project',
        'project_completion_rate_minimum_ideal_85':'https://retoolapi.dev/q0JzIY/project_completion_rate',
        'milestone_completion_rate':'https://retoolapi.dev/hPaSQx/milestone_completion_rate',
        'task_completion_rate':'https://retoolapi.dev/JxFjNL/task_completion_rate',
        'average_project_completion_time':'https://retoolapi.dev/5uR4BW/average_project_completion_time',
        'no_of_upsale_cross_sales':'https://retoolapi.dev/4W877W/no_of_upsale_cross_sales',
        'value_of_upsale_cross_sale':'https://retoolapi.dev/pptYJy/value_of_upsale_cross_sale',
        'canceled_projects':'https://retoolapi.dev/XbPWst/canceled_projects',
        'delayed_projects':'https://retoolapi.dev/psFpKa/delayed_projects',
        'delayed_completed':'https://retoolapi.dev/lJOP3J/delayed_completed',
    });
    const [additionalData, setAdditionalData] = useState([])

    const toggleColumnVisibility = (columnKey) => {
        const updatedColumns = columns.map(col =>
            col.key === columnKey ? { ...col, visible: !col.visible } : col
        );
        setColumns(updatedColumns);
    };


    const openModal = async (row, key) => {
        const endpoint = apiEndpoints[key];
        if (endpoint) {
            setSelectedRow(row);
            setShowModal(true);
            await fetchAdditionalData(endpoint);
        }
    };

    const fetchAdditionalData = async (endpoint) => {
        try {
            const response = await fetch(endpoint);
            const additionalData = await response.json();
            setAdditionalData(additionalData);
        } catch (error) {
            console.error('Error fetching additional data:', error);
        }
    };

    const closeModal = () => {
        setSelectedRow(null);
        setShowModal(false);
    };

    const handleDragStart = (e, columnKey) => {
        e.dataTransfer.setData('columnKey', columnKey);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, droppedColumnKey) => {
        const draggedColumnKey = e.dataTransfer.getData('columnKey');
        const draggedColumn = columns.find(col => col.key === draggedColumnKey);
        const droppedColumn = columns.find(col => col.key === droppedColumnKey);
        const updatedColumns = columns.map(col => {
            if (col.key === draggedColumnKey) {
                return { ...col, order: droppedColumn.order };
            }
            if (col.key === droppedColumnKey) {
                return { ...col, order: draggedColumn.order };
            }
            return col;
        });
        setColumns(updatedColumns);
    };

    return (
        <div className='mx-5 my-5'>
            <h1 className='text-center my-2'>Total Project:{totalProjectCount}</h1>
            <h1 className='text-center my-2'>Total Project Value:${totalProjectValue}</h1>

            <div className='d-flex justify-content-end ' style={{ marginBottom: '10px', position: 'relative' }}>

                <RiListSettingsFill size={35} onClick={() => setShowColumnDropdown(!showColumnDropdown)} cursor='pointer'/>
                {showColumnDropdown && (
                    <div style={{ position: 'absolute', top: '50px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {columns.map((col, index) => (
                            <div key={index}>
                                <label style={{cursor:'pointer'}}>
                                    <input

                                        type="checkbox"
                                        checked={col.visible}
                                        onChange={() => toggleColumnVisibility(col.key)}
                                    />
                                    &nbsp;{col.label}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
           {data?.length!==0? <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {columns
                            ?.filter(col => col.visible)
                            ?.sort((a, b) => (a.order > b.order ? 1 : -1))
                            ?.map(col => (
                                <th
                                key={col.key}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, col.key)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, col.key)}
                                style={{
                                    whiteSpace: 'pre-line',
                                }}
                            >
                                {col.key === 'no_of_projects_minimum_ideal_18' ||
                                 col.key === 'project_completion_rate_minimum_ideal_85' ||
                                 col.key === 'total_project_value_minimum_ideal_8000_usd' ? (
                                    <>
                                        <span style={{ color: 'black', fontSize: 'inherit' }}>
                                            {col?.label?.split('(')[0]}
                                        </span>
                                        <br />
                                        <span style={{ color: 'red', fontSize: 'small' }}>
                                        {col.label.match(/\(([^)]+)\)/) && (
                                <span style={{ color: 'red', fontSize: 'small' }}>
                                    ({col.label.match(/\(([^)]+)\)/)[1]} )
                                </span>
                            )}
                                        </span>
                                    </>
                                ) : (
                                    <span style={{ color: 'black' }}>
                                        {col.label}
                                    </span>
                                )}
                            </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map(row => (
                        <tr key={row.id} >
                            {columns
                                .filter(col => col.visible)
                                .sort((a, b) => (a.order > b.order ? 1 : -1))
                                .map(col => (
                                    <td key={`${row.id}-${col.key}`} onClick={() => openModal(row, col.key)}>
                                        {row[col.key]}
                                    </td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </Table>:<Loader/>}

         <TableModal closeModal={closeModal} showModal={showModal} selectedRow={selectedRow} data={additionalData}/>
        </div>
    )
}

export default TableData