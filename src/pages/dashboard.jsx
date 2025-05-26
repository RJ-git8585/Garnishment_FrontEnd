/**
 * Dashboard component that displays user statistics and activity logs.
 * 
 * This component fetches data from the API on mount and displays animated statistics
 * and a list of activity logs. It uses React hooks for state management and lifecycle
 * methods, and react-spring for animations.
 * 
 * @component
 * @returns {JSX.Element} The rendered Dashboard component.
 * 
 * @example
 * // Usage
 * import Dashboard from './Dashboard';
 * 
 * function App() {
 *   return <Dashboard />;
 * }
 * 
 * @description
 * - Fetches dashboard data and activity logs from the API.
 * - Displays animated statistics using `useSpring` from react-spring.
 * - Displays activity logs with enter/exit animations using `useTransition` from react-spring.
 * - Shows a loading spinner while data is being fetched.
 * - Handles errors gracefully by logging them to the console.
 * 
 * @dependencies
 * - `react`: For state and lifecycle management.
 * - `@react-spring/web`: For animations.
 * - `react-icons/di`: For displaying icons.
 * - `../component/ProfileHeader`: Custom component for the profile header.
 * - `../utils/image/bouncing-circles.svg`: Loading spinner image.
 * - `../configration/apis`: API configuration for fetching data.
 * 
 * @state
 * - `dashboardData` (object): Stores the fetched dashboard data.
 * - `activityLogs` (array): Stores the fetched activity logs.
 * - `loading` (boolean): Indicates whether data is being fetched.
 * 
 * @hooks
 * - `useState`: Manages component state.
 * - `useEffect`: Fetches data on component mount.
 * - `useRef`: Prevents multiple API calls on re-renders.
 * - `useSpring`: Animates numeric values for statistics.
 * - `useTransition`: Animates the appearance and disappearance of activity logs.
 */
import { useState, useEffect, useRef } from 'react';
import { useSpring, animated, useTransition } from '@react-spring/web';
import ProfileHeader from '../component/ProfileHeader';
import load from '../utils/image/bouncing-circles.svg';
import { DiJqueryLogo } from 'react-icons/di';
import { API_URLS } from '../configration/apis';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, logsRes] = await Promise.all([
          fetch(API_URLS.DASHBOARD_USERS_DATA),
          fetch(API_URLS.DASHBOARD_LOGDATA),
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
  }, []);

  const stats = [
    { label: 'Total IWO', value: dashboardData.Total_IWO },
    { label: 'Single IWO', value: dashboardData.Employees_with_Single_IWO },
    { label: 'Multiple IWO', value: dashboardData.Employees_with_Multiple_IWO },
    { label: 'Active Employees', value: dashboardData.Active_employees },
  ];

  const animatedStats = stats.map((stat) => {
    const springProps = useSpring({
      from: { number: 0 },
      to: { number: stat.value || 0 },
      config: { duration: 1000 },
    });
    return { ...stat, springProps };
  });

  const logTransitions = useTransition(activityLogs, {
    from: { opacity: 0, transform: 'translateY(-10px)' },
    enter: { opacity: 1, transform: 'translateY(0)' },
    leave: { opacity: 0, transform: 'translateY(-10px)' },
    keys: (log) => log.id,
  });

  return (
    <>
      <ProfileHeader />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8 custom_tab">
        {animatedStats.map((stat, idx) => (
          <div key={idx} className="mx-auto flex max-w-xs flex-col shadow-lg px-4 py-4 gap-y-4">
            <dt className="text-xs leading-3 text-black-600">{stat.label}</dt>
            <dd className="text-3xl font-semibold text-center tracking-tight text-black-900 sm:text-5xl">
              <animated.span>
                {stat.springProps.number.to((n) => Math.floor(n))}
              </animated.span>
            </dd>
          </div>
        ))}
      </div>
      <hr className="mt-6" />
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
                {logTransitions((style, log) => (
                  <animated.li style={style} key={log.id} className="text-sm mb-2 mt-2 flex logs_cls p-2">
                    <DiJqueryLogo />
                    {log.details}
                  </animated.li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-center">No data available.</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;