import { useState, useEffect, useRef } from 'react';
import Sidebar from '../component/sidebar';
import Headertop from '../component/Headertop';
import ProfileHeader from '../component/ProfileHeader';
import load from '../bouncing-circles.svg';
import { DiJqueryLogo } from 'react-icons/di';
import { BASE_URL } from '../Config';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasFetchedData = useRef(false); // Prevent duplicate API calls

  useEffect(() => {
    if (hasFetchedData.current) return; // Prevent double fetching in Strict Mode
    hasFetchedData.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard and logs data in parallel
        const [dashboardRes, logsRes] = await Promise.all([
          fetch(`${BASE_URL}/User/DashboardData`),
          fetch(`${BASE_URL}/User/logdata`),
        ]);

        const [dashboardJson, logsJson] = await Promise.all([
          dashboardRes.json(),
          logsRes.json(),
        ]);

        setDashboardData(dashboardJson.data || {});
        setActivityLogs(logsJson.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Dependency array ensures the effect runs only once

  const { Active_employees, Employees_with_Multiple_IWO, Total_IWO, Employees_with_Single_IWO } = dashboardData;

  const stats = [
    { label: 'Total IWO', value: Total_IWO },
    { label: 'Single IWO', value: Employees_with_Single_IWO },
    { label: 'Multiple IWO', value: Employees_with_Multiple_IWO },
    { label: 'Active Employees', value: Active_employees },
  ];

  return (
    <div className="min-h-full">
      
      <div className="container">
        <div className="sidebar hidden lg:block">
          <Sidebar />
        </div>
        <div className="content ml-auto remove-btns">
          <Headertop />
          <ProfileHeader />
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8 custom_tab">
            {stats.map((stat, idx) => (
              <div key={idx} className="mx-auto flex max-w-xs flex-col shadow-lg px-4 py-4 gap-y-4">
                <dt className="text-xs leading-3 text-black-600">{stat.label}</dt>
                <dd className="text-3xl font-semibold text-center tracking-tight text-black-900 sm:text-5xl">
                  {stat.value || 0}
                </dd>
              </div>
            ))}
          </div>
          <hr className="mt-6" />

          {/* Activity and Logs Section */}
          <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-2">
            {['Activity', 'Logs'].map((title, idx) => (
              <div key={idx} className="border-single pb-2 rounded-xl mb-4 border-2">
                <h5 className="mt-0 py-2 px-2 text-lg bg-cyan-100 font-semibold">{title}</h5>
                {loading ? (
                  <div className="text-center">
                    <img className="mx-auto h-10 logo-inner w-auto custom_logo_side" src={load} alt="Loading..." />
                  </div>
                ) : activityLogs.length > 0 ? (
                  <ul>
                    {activityLogs.map((log) => (
                      <li key={log.id} className="text-sm mb-2 mt-2 flex logs_cls p-2">
                        <DiJqueryLogo />
                        {log.details}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-center">No data available.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;