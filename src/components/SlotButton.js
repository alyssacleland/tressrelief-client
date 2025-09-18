import PropTypes from 'prop-types';

export default function SlotButton({ start, stylistName, serviceName, duration, formatTime }) {
  return (
    <button type="button" onClick={() => alert(`Selected ${serviceName} at ${formatTime(start)} with ${stylistName} (${duration} minutes)`)} className="flex flex-col items-center rounded-lg border border-gray-200 px-0 py-0 text-sm hover:border-pink-400 hover:ring-1 hover:ring-pink-300 hover:shadow-sm transition">
      <span className="text-sm text-gray-900">{formatTime(start)}</span>
      <span className="text-[11px] text-gray-500">{stylistName}</span>
    </button>
  );
}

SlotButton.propTypes = {
  start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  stylistName: PropTypes.string.isRequired,
  serviceName: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  formatTime: PropTypes.func.isRequired,
};
