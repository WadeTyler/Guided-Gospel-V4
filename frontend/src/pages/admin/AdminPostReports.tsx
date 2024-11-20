import { useEffect, useState } from 'react'
import { formatTimestamp } from '../../lib/utils'
import AdminSidebar from '../../components/admin/AdminSidebar'

const AdminPostReports = () => {

  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = async () => {
    const response = await fetch('/api/admin/postreports', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    setReports(data);
    console.log("Post Reports Obtained");
  };

  useEffect(() => {
    fetchReports();
  }, []);


  return (
    <div className="w-full min-h-screen flex">
      <AdminSidebar />

      {/* Body */}
      <div className="w-full ml-[15rem] min-h-screen flex flex-col p-4 gap-4 bg-white dark:bg-darkbg dark:text-darktext">
        {/* Header */}
        <header className="admin-panel-header">
            <h1 className="text-primary text-5xl">Post Reports</h1>
            <div className="admin-panel-header-nav">
              
            </div>
          </header>

        {/* Feedbacks */}
        <div className="w-full h-full overflow-scroll flex flex-col relative">

          {/* Header */}
          <div className="">
            <div className="grid grid-cols-6 gap-2">
              <div className="text-primary font-bold flex gap-2">Timestamp</div>
              <div className="text-primary font-bold">Report ID</div>
              <div className="text-primary font-bold">Reporter ID</div>
              <div className="text-primary font-bold">Violator ID</div>
              <div className="text-primary font-bold flex gap-2">Reason</div>
            </div>
          </div>

          {/* BugReports */}
          <div className="mt-10 w-full max-h-[28rem] flex flex-col gap-2 h-full overflow-y-scroll">
            {reports.map((report) => {
              return (
                <div key={report.timestamp} className="grid grid-cols-6 gap-2 border-primary border-[1px] p-2 rounded-xl">
                  <div>{formatTimestamp(report.timestamp)}</div>
                  <div>{report.violationid}</div>
                  <div>{report.reporterid}</div>
                  <div>{report.violatorid}</div>
                  <div>{report.content}</div>
                </div>
              )
            })}
          </div>

        </div>

      </div>

    </div>
  )
}

export default AdminPostReports