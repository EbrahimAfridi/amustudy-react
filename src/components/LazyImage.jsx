import { useInView } from 'react-intersection-observer';

export default function LazyImage({ src, alt, className }) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Load only once
    threshold: 0.1,    // Trigger when 10% of the image is in view
  });
  

  return (
    <div ref={ref} className={className}>
      {inView ? (
        <div className='w-[90vw] sm:w-full sm:h-full'>
          <img src={src} alt={alt} className="w-full h-full object-cover rounded-xs" loading="lazy" />
        </div>
      ) : (
        <div className="placeholder bg-gray-300 w-full h-[25vh] rounded-lg"></div>
      )}
    </div>
  );
}
