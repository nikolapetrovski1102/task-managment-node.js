import React, { useState, useEffect, useCallback } from "react";
import TableRow from "./TableRow";
import styled from "styled-components";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "./arrajMove";
import axios from 'axios';

const TaskTable = styled.div`
  .handle{
    padding: 0% 2% 0 3%;
  }
  .table{
    width: 60%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 15px;
  }

  .table td {
    border: solid 1px #000;
    border-style: none solid solid none;
    padding: 10px;
  }
  tr:first-child td:first-child { border-top-left-radius: 10px; }
  tr:first-child td:last-child { border-top-right-radius: 10px; }

  tr:last-child td:first-child { border-bottom-left-radius: 10px; }
  tr:last-child td:last-child { border-bottom-right-radius: 10px; }

  tr:first-child td { border-top-style: solid; }
  tr td:first-child { border-left-style: solid; }
`;

const SortableCont = SortableContainer(({ children }) => {
  return <tbody>{children}</tbody>;
});

const SortableItem = SortableElement(props => <TableRow {...props} />);

const MyTable = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8081/listTasks', {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsbmFtZSI6Ik5pa29sYSIsImlkIjoiNjY1NjAyYjliMzM2YWViZjAyZjNlNzdlIiwiaWF0IjoxNzE2OTk4MzcxLCJleHAiOjE3MTcwMDE5NzF9.aMHe_bb0KIfBkZLcWjTHNxmsK32nr7yGWVq5uWKDMQs'
          }
        });
        setItems(response.data.task);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
    setItems(oldItems => arrayMove(oldItems, oldIndex, newIndex));
  }, []);

  return (
    <TaskTable>
      <table className="table table-dark fixed_header">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Project</th>
          </tr>
        </thead>
        <SortableCont
          onSortEnd={onSortEnd}
          axis="y"
          lockAxis="y"
          lockToContainerEdges={true}
          lockOffset={["30%", "50%"]}
          helperClass="helperContainerClass"
          useDragHandle={true}
        >
          {items.map((value, index) => (
            <SortableItem
              key={`item-${index}`}
              index={index}
              first={value.name}
              second={value.priority}
              third={value.dueDate}
              fourth={value.project}
            />
          ))}
        </SortableCont>
      </table>
    </TaskTable>
  );
};

export default MyTable;
