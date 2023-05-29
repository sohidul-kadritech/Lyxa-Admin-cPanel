import AXIOS from '../network/axios';

export function downloadFile(fileUrl) {
  // Fetch the file as a blob

  AXIOS.get(fileUrl).then((response) => {
    console.log(response);
  });

  //   fetch(fileUrl)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       // Create a new anchor element
  //       const a = document.createElement('a');
  //       a.href = window.URL.createObjectURL(blob);

  //       // Set the download attribute to specify the suggested file name
  //       a.download = 'filename.pdf';

  //       // Append the anchor to the document body
  //       document.body.appendChild(a);

  //       // Simulate a click on the anchor element to start the download
  //       a.click();

  //       // Clean up
  //       document.body.removeChild(a);
  //       window.URL.revokeObjectURL(a.href);
  //     })
  //     .catch((error) => {
  //       console.log('Error:', error);
  //     });
}
