import React, { type ChangeEvent, useState } from "react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { type RowData } from "../../file-hasher-types";

export interface FlexibleFormTableProps {
  onChange?: ({ rowTitles, rowValues }: RowData) => any;
  rowData: RowData; // allow the table to be pre-populated with data
}

export const FlexibleFormTable = ({
  onChange = () => {},
  rowData,
}: FlexibleFormTableProps) => {
  /**
   * Combining these 2 states into an object would be a lot cleaner,
   * However, it'll also be less efficient when rendering since a change
   * of either states will trigger a rerendering of everything as well.
   * Isolating it should restrict rendering slightly (Although not much).
   */
  // const [rowTitles, setRowTitles] = useState([""]);

  const [rowTitles, setRowTitles] = useState(rowData.rowTitles);
  // const [rowValues, setRowValues] = useState([""]);
  const [rowValues, setRowValues] = useState(rowData.rowValues);

  const addEditableRow = () => {
    setRowTitles((prevRowTitles) => prevRowTitles.concat(""));
    setRowValues((prevRowValues) => prevRowValues.concat(""));
  };

  const removeEditableRow = (index: number) => {
    setRowTitles((prevRowTitles) =>
      prevRowTitles.filter((val, idx) => idx !== index)
    );
    setRowValues((prevRowValues) =>
      prevRowValues.filter((val, idx) => idx !== index)
    );
  };

  const onRowChange =
    (col: "title" | "value", index: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (col === "title") {
        setRowTitles((prevRowTitles) => {
          const newTitles = [...prevRowTitles];
          newTitles[index] = event.target.value;
          onChange({ rowTitles: newTitles, rowValues });
          return newTitles;
        });
      } else {
        setRowValues((prevRowValues) => {
          const newValues = [...prevRowValues];
          newValues[index] = event.target.value;
          onChange({ rowTitles, rowValues: newValues });
          return newValues;
        });
      }
    };

  return (
    <TableContainer>
      <form>
        <Table variant="simple" size="lg">
          <Thead>
            <Tr>
              <Th>Keys</Th>
              <Th>Value</Th>
              <Th>
                <Button rightIcon={<AddIcon />} onClick={addEditableRow}>
                  Add row
                </Button>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {rowTitles.map((row, idx) => (
              <Tr key={idx}>
                <Td>
                  <Input
                    placeholder="Key for the field"
                    value={row}
                    onChange={onRowChange("title", idx)}
                  />
                </Td>
                <Td>
                  <Input
                    placeholder="Value for the field"
                    value={rowValues[idx]}
                    onChange={onRowChange("value", idx)}
                  />
                </Td>
                <Td>
                  <IconButton
                    aria-label="Remove row"
                    icon={<DeleteIcon />}
                    onClick={() => {
                      removeEditableRow(idx);
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </form>
    </TableContainer>
  );
};
