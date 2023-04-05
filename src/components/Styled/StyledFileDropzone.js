/* eslint-disable max-len */
import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg';

const focusedStyle = {
  // borderColor: '#1890ff',
};

const acceptStyle = {
  // borderColor: '#52c41a',
};

const rejectStyle = {
  // borderColor: '#ff4d4f',
};

const defaultStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '20px',
  background: 'rgb(250, 250, 250)',
  outline: 'none',
  transition: 'border 250ms ease-in-out 0s',
  minHeight: '100px',
  backgroundImage:
    "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='25' ry='25' stroke='%235E97A9FF' stroke-width='3' stroke-dasharray='11%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")",
  borderRadius: '25px',
  cursor: 'pointer',
};

export default function StyledFileDropzone({ text, classes, ...args }) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    maxSize: 1000 * 1000,
    ...args,
  });

  const style = useMemo(
    () => ({
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div {...getRootProps({ style: { ...defaultStyle, ...style } })}>
      <input {...getInputProps()} />
      <p
        style={{
          color: '#8c8c8c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '9px',
          marginBottom: '0px',
        }}
      >
        <UploadIcon /> Drop files here or click to upload
      </p>
    </div>
  );
}
