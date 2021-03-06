// handle S3 upload
const getSignedUrl = async (file) => {
  let queryString =
    "?objectName=" + file.id + "&contentType=" + encodeURIComponent(file.type);
  return fetch("http://localhost:8000/app/v1/S3/signURL" + queryString)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log("error: ", err);
    });
};

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();

  if (xhr.withCredentials != null) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest !== "undefined") {
    // xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }

  return xhr;
}

export const S3Upload = (fileInfo) => {
  //parameters: { type, data, id }
  return new Promise((resolve, reject) => {
    getSignedUrl(fileInfo)
      .then((s3Info) => {
        // upload to S3
        console.log("s3Info", s3Info);
        var xhr = createCORSRequest("PUT", s3Info.signedUrl);

        xhr.onload = function () {
          if (xhr.status === 200) {
            console.log(xhr.status);
            resolve(true);
          } else {
            console.log(xhr.status);

            reject(xhr.status);
          }
        };

        xhr.setRequestHeader("Content-Type", fileInfo.type);
        xhr.setRequestHeader("x-amz-acl", "public-read");

        return xhr.send(fileInfo.data);
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  });
};
