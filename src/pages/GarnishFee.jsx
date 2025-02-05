import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { BASE_URL } from "../Config";
import Headertop from "../component/Headertop";
import Sidebar from "../component/sidebar";
import EditGarnishmentRule from "./EditGarnishmentRule"; // Import edit popup component

function GarnishFee() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/User/GarnishmentFeesStatesRules/`);
        const jsonData = await response.json();
        setData(jsonData.data);
      } catch (error) {
        console.error("Error fetching table data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Open edit dialog
  const handleEditOpen = (rule) => {
    setSelectedRuleId(rule);
    setEditOpen(true);
  };

  // Close edit dialog
  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedRuleId(null);
  };

  return (
    <div>
      <div className="min-h-full">
        <div className="container main ml-auto">
          <div className="sidebar hidden lg:block">
            <Sidebar />
          </div>
          <div className="content ml-auto flex flex-col">
            <Headertop />
            <hr />
            <h4 className="text-l text-black-800 mb-4">Garnishment Fee</h4>

            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                getRowId={(row) => row.id}
                columns={[
                  { field: "id", headerName: "ID", width: 100 },
                  { field: "state", headerName: "State", width: 200 },
                  { field: "pay_period", headerName: "Pay Period", width: 200 },
                  {
                    field: "rule",
                    headerName: "Rule",
                    width: 250,
                    renderCell: (params) => (
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleEditOpen(params.row.rule)}
                      >
                        {params.row.rule}
                      </Button>
                    ),
                  },
                ]}
                rows={loading ? [] : data}
                pageSize={25}
                rowsPerPageOptions={[25]}
                pagination
                paginationMode="client"
                loading={loading}
              />
            </Box>
          </div>
        </div>
      </div>

      {/* Edit Rule Popup */}
      {selectedRuleId && (
        <EditGarnishmentRule
          rule={selectedRuleId}
          open={editOpen}
          handleClose={handleEditClose}
        />
      )}
    </div>
  );
}

export default GarnishFee;
