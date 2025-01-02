import AdminLayout from "./layout";
import { useState, useEffect } from "react";

export default function AdminBorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [showRequests, setShowRequests] = useState(true);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0); // Manage count locally

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("backendlibrary-production.up.railway.app/borrow-requests/pending");
        const data = await response.json();
        setRequests(data);
        // setPendingRequestsCount(data.length);
      } catch (error) {
        console.error("Failed to fetch borrow requests:", error);
      }
    };

    const fetchWaitlist = async () => {
      try {
        const response = await fetch("backendlibrary-production.up.railway.app/get-waitlist");
        const data = await response.json();
        setWaitlist(data);
      } catch (error) {
        console.error("Failed to fetch waitlist:", error);
      }
    };

    const markRequestsViewed = async () => {
      try {
        await fetch("backendlibrary-production.up.railway.app/borrow-requests/mark-viewed", { method: "POST" });
        console.log("Requests marked as viewed.");
        setPendingRequestsCount(0); // Reset count locally
      } catch (error) {
        console.error("Error marking requests as viewed:", error);
      }
    };

    fetchRequests();
    fetchWaitlist();
    markRequestsViewed(); // Mark requests as viewed when component loads
  }, []);

  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await fetch("backendlibrary-production.up.railway.app/user-borrow/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await response.json();
      setRequests(requests.filter((req) => req._id !== requestId));
      alert(data.message);
    } catch (error) {
      console.error(`Error handling request ${action}:`, error);
    }
  };

  return (
    <AdminLayout pendingRequestsCount={pendingRequestsCount}> {/* Pass state as prop */}
      <div>
        <h2>Manage Borrow Requests and Waitlist</h2>
        <div>
          <button style={{ margin: "0px 10px" }} onClick={() => setShowRequests(true)}>
            Borrow Requests
          </button>
          <button onClick={() => setShowRequests(false)}>Waitlist</button>
        </div>

        {showRequests ? (
          <div>
            <h3>Pending Borrow Requests</h3>
            <ul>
              {requests && requests.length > 0 ? (
                requests.map((request) => (
                  <li key={request._id}>
                    <p><strong>User:</strong> {request.user.firstName} ({request.user.email})</p>
                    <p><strong>Book:</strong> {request.book.title}</p>
                    <button onClick={() => handleRequestAction(request._id, "approve")}>Approve</button>
                    <button onClick={() => handleRequestAction(request._id, "reject")}>Reject</button>
                  </li>
                ))
              ) : (
                <p>No pending borrow requests found.</p>
              )}
            </ul>
          </div>
        ) : (
          <div>
            <h3>Waitlist</h3>
            <ul>
              {waitlist && waitlist.length > 0 ? (
                waitlist.map((item) => (
                  <li key={item._id}>
                    <p><strong>User:</strong> {item.user.firstName} ({item.user.email})</p>
                    <p><strong>Book:</strong> {item.book.title}</p>
                    <p><strong>Requested Date:</strong> {new Date(item.requestedAt).toLocaleDateString()}</p>
                    <button onClick={() => handleRequestAction(item._id, "approve")}>Approve</button>
                    <button onClick={() => handleRequestAction(item._id, "reject")}>Reject</button>
                  </li>
                ))
              ) : (
                <p>No users on the waitlist.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
