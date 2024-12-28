import PropTypes from 'prop-types';

const Events = ({events}) => {

    Events.propTypes = {
        events: PropTypes.arrayOf(
            PropTypes.shape({
                date: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                venue: PropTypes.string.isRequired,
            })
        ).isRequired,
    };

    return (

        <div className="hidden sm:flex flex-col items-center w-[90%] sm:w-[20%] h-screen border-l-[1px] border-[#1c1f26] overflow-y-auto">
          <h1 className="text-gray-300 text-[20px] font-bold pt-[15vh] w-full pl-2">
            Events Calendar
          </h1>
          <div className="flex flex-col gap-10 w-full pt-10 rounded-md pl-4">
            {events.map((event, index) => (
              <div key={index} className="flex-col w-full text-[15px]">
                <div className="flex flex-col justify-center gap-2">
                  <span className="font-medium text-gray-400">
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <h3 className=" font-medium cursor-pointer">{event.title}</h3>
                  <span>{event.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
    )

    
}

export default Events;