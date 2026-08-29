const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className="spinner small" />
      <span>{message}</span>
    </div>
  );
};

export default LoadingSpinner;
