import LoadingGif from '../assets/images/loader.gif';

export default function CircularLoader() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img style={{ width: '80px', height: 'auto' }} src={LoadingGif} alt="" />
    </div>
  );
}
