
import Spinner from 'react-bootstrap/Spinner';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        width: '100%', 
      }}
    >
      <Spinner animation="border" />
    </div>
  );
};

export default Loader;