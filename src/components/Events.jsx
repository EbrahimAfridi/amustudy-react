import PropTypes from 'prop-types';

const Events = ({events, mobile}) => {

    Events.propTypes = {
        events: PropTypes.arrayOf(
            PropTypes.shape({
                date: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                venue: PropTypes.string.isRequired,
            })
        ).isRequired,
    };

    const wideScreenStyle = "hidden sm:flex flex-col items-center w-[90%] sm:w-[20%] h-screen border-l-[1px] border-[#1c1f26] overflow-y-auto text-white";
    const mobileScreenStyle = "flex flex-col items-center w-[calc(100vw-6px)] min-h-screen bg-primary text-white";
    return (

        <div className={`${mobile ? mobileScreenStyle : wideScreenStyle}`}>
          <h1 className=" text-[20px] font-bold pt-[15vh] w-full pl-2">
            Events Calendar
          </h1>
          <div className="flex flex-col gap-10 w-full pt-10 rounded-md px-4">
            {events.map((event, index) => (
              <div key={index} className="flex-col w-full text-[15px] sm:p-0 p-3 sm:border-0 border-[1px] border-gray-700 rounded-xl">
                <div className="flex sm:flex-col flex-row sm:justify-center justify-between gap-2">
                  <span className="font-medium sm:text-gray-400 w-1/2">
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <div className='w-1/2 sm:w-fit'>  
                    <h3 className=" sm:font-medium font-bold sm:text-[17px] text-[20px] cursor-pointer pb-1">{event.title}</h3>
                    <span className='sm:text-[15px] text-[12px] sm:font-normal font-medium'>{event.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    )

    
}

export default Events;