const path = require("path");
const ABSPATH = path.dirname(process.mainModule.filename);
const gm = require("gm");
const fs = require("fs");
const rq = require("request");
const exists = (path) => {
  try {
    return fs.statSync(path).isFile();
  } catch (e) {
    return false;
  }
};

const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

class Media {
  constructor(path) {
    this.src = path;
  }

  isValidMedia(src) {
    return /\.(jpe?g|png)$/.test(src);
  }

  isValidBaseDir(src) {
    return /^\/public\/images/.test(src);
  }

  thumb(request, response) {
    let image = ABSPATH + this.src;

    if (this.isValidMedia(this.src)) {
      let width =
        request.query.w && /^\d+$/.test(request.query.w)
          ? request.query.w
          : "150";
      let height =
        request.query.h && /^\d+$/.test(request.query.h)
          ? request.query.h
          : "150";
      let extension = getFileExtension(this.src);
      let mime = extension === "jpeg" || extension === "jpg" ? "jpeg" : "png";

      response.type(mime);

      gm(rq(this.src)).resize(width, height).stream().pipe(response);
    } else {
      response.sendStatus(404);
    }
  }
}

module.exports = Media;
