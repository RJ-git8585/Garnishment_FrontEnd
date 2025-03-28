import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { BASE_URL } from "../Config";
import Headertop from "../component/Headertop";
import Sidebar from "../component/sidebar";
import EditGarnishmentRule from "./EditGarnishmentRule"; 

function GarnishFee() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/User/GarnishmentFeesStatesRules/`);
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditOpen = (rule) => {
    setSelectedRuleId(rule);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedRuleId(null);
  };

  return (
         <>
          <h4 className="text-l text-black-800 mb-4">Garnishment Fee</h4>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              getRowId={(row) => row.id}
              columns={[
                { field: "id", headerName: "ID", width: 260 },
                { field: "state", headerName: "State", width: 320, renderCell: ({ value }) => <span style={{ textTransform: "capitalize" }}>{value}</span> },
                { field: "pay_period", headerName: "Pay Period", width: 320 },
                {
                  field: "rule",
                  headerName: "Rule",
                  width: 320,
                  renderCell: ({ row }) => (
                    <Button variant="text" color="primary" onClick={() => handleEditOpen(row.rule)}>
                      {row.rule}
                    </Button>
                  ),
                },
              ]}
              rows={loading ? [] : data}
              pageSize={20}
              rowsPerPageOptions={[20]}
              pagination
              paginationMode="client"
              loading={loading}
            />
          </Box>
        
      {selectedRuleId && <EditGarnishmentRule rule={selectedRuleId} open={editOpen} handleClose={handleEditClose} />}
      </>
  );
}

export default GarnishFee;