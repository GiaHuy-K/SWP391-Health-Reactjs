import React, { useEffect, useState } from 'react'
import { getHealthIncidents } from '../../services/api.healthIncident';
import { toast } from 'react-toastify';
import EventHealthIncidentTemplate from '../../components/templates/eventHealthIncidientTemplate';

function ManageEvent() {
  const [loading, setLoading] = useState(false);
  const [eventList, setEventList] = useState([]);
  const fetchEvent = async () => {
    setLoading(true);
        try {
          const response = await getHealthIncidents();
          console.log(response);
        } catch (error) {
          console.log(error);
          toast.error("Lỗi API");
        } finally {
          setLoading(false);
        }
  };
  
  useEffect(() => {
    fetchEvent();   
  }, []);

  return (
    <div>
      {/* <h2>Danh sách sự cố sức khỏe</h2> */}
      <EventHealthIncidentTemplate data={eventList} loading={loading} onReload={fetchEvent} />
    </div>
  )
}

export default ManageEvent