export function ManagerDash() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Manager Dashboard
      </h1>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">Total Leads</p>
          <h2 className="text-3xl font-bold">48</h2>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">Upcoming Events</p>
          <h2 className="text-3xl font-bold">5</h2>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">Volunteers</p>
          <h2 className="text-3xl font-bold">12</h2>
        </div>
      </div>

      {/* Events */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Events
          </h2>

          <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            + Create Event
          </button>
        </div>

        <p className="text-gray-500">
          No events yet.
        </p>
      </div>
    </div>
  );
}