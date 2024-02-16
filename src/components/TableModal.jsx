import Modal from 'react-bootstrap/Modal';
import { RiListSettingsFill } from "react-icons/ri";
import Table from 'react-bootstrap/Table';
import { useState } from 'react';
import {  modalTableInitialCoumns } from '../constant/InitialColumns';
import Loader from './Loader';
  const TableModal = ({showModal,closeModal,selectedRow,data}) => {
    const [columns, setColumns] = useState(modalTableInitialCoumns);
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);

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

const toggleColumnVisibility = (columnKey) => {
  const updatedColumns = columns.map(col =>
      col.key === columnKey ? { ...col, visible: !col.visible } : col
  );
  setColumns(updatedColumns);
};


    return (
        <Modal show={showModal} dialogClassName="modal-90w" onHide={closeModal} >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
           <div className='d-flex flex-column align-items-center my-4'>
           <div>
           <h3>Project Manager: <span className=''>{selectedRow?.project_manager}</span></h3>
           <h3>Total Projects:{selectedRow?.no_of_projects_minimum_ideal_18}</h3>
           <h3>Total Project Value:{selectedRow?.total_project_value_minimum_ideal_8000_usd}</h3>
           </div>
           </div>
           <div className="row">
    <div className="col">
    <p className='text-center text-white bg-primary py-3'>Number of Projects <br />({selectedRow?.no_of_projects_minimum_ideal_18})</p>
    </div>
    <div className="col">
  <p className='text-center text-white bg-primary py-3'>Total Project Value <br />({selectedRow?.total_project_value_minimum_ideal_8000_usd})</p>
    </div>
    <div className="col">
    <p className='text-center text-white bg-primary py-3'>Total Released Amount <br />({selectedRow?.total_released_amount})</p>
    </div>
    <div className="col">
  <p className='text-center text-white bg-primary py-3'>No. of Fully Completed Project <br />({selectedRow?.no_of_fully_completed_project})</p>
    </div>
    <div className="col">
    <p className='text-center text-white bg-primary py-3'>Project Completion Rate <br />({selectedRow?.project_completion_rate_minimum_ideal_85})</p>
    </div>
    <div className="col">
  <p className='text-center text-white bg-primary py-3'>Milestone Completion Rate <br />({selectedRow?.milestone_completion_rate})</p>
    </div>
  </div>
 <div className="row">
    <div className="col">
    <p className='text-center text-white bg-primary py-3'>Average Project Completion Time <br />({selectedRow?.average_project_completion_time})</p>
    </div>
    <div className="col">
    <p className='text-center text-white bg-primary py-3'>No of Upsale/Cross Sales <br />({selectedRow?.no_of_upsale_cross_sales})</p>
    </div>
    <div className="col">
    <p className='text-center text-white bg-primary py-3'>Value of Upsale/Crosssale <br />({selectedRow?.value_of_upsale_cross_sale})</p>
    </div>
    <div className="col">
    <p className='text-center text-white bg-primary py-3'>Canceled Projects <br />({selectedRow?.canceled_projects})</p>
    </div>
    <div className="col">
    <p className='text-center text-white bg-primary py-3'>Delayed Projects <br />({selectedRow?.delayed_projects})</p>
    </div>
    <div className="col">
    <p className='text-center text-white bg-primary py-3'>Delayed Completed <br />({selectedRow?.delayed_completed})</p>
    </div>
  </div>

  <div>
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
{
   data?.length!==0?<Table striped bordered hover responsive>
  <thead>
      <tr>
          {columns
              .filter(col => col.visible)
              .sort((a, b) => (a.order > b.order ? 1 : -1))
              .map(col => (
                  <th
                      key={col.key}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, col.key)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, col.key)}
                      style={{
                        color: col.key === '' ? 'red' : 'black',
                      
                    }}
                  >
                      {col.label}
  
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
                      <td key={`${row.id}-${col.key}`}>
                          {row[col.key]}
                      </td>
                  ))}
          </tr>
      ))}
  </tbody>
  </Table>:<Loader/>
}


  </div>
        </Modal.Body>
      
      </Modal>
    )
  }
  
  export default TableModal