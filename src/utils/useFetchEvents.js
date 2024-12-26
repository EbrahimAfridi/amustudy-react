import { useState, useEffect } from "react";
import pb from "../../lib/pocketbase";

const useFetchEvents = () => {
  const [events, setEvents] = useState([]);
  const [showError, setShowError] = useState(false);

  const fetchEvents = async () => {
    try {
      const records = await pb.collection("posts").getList(1, 10, {
        filter: 'date != ""',
        sort: "-created",
      });
      setEvents(records.items);
      setShowError(false);
    } catch (error) {
      setShowError(true);
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, showError };
};

export default useFetchEvents;