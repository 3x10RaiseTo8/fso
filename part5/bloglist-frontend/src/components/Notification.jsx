import PropTypes from 'prop-types';

const Notification = ({ message, className }) => {
  return <div className={className}>{message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};
export default Notification;
