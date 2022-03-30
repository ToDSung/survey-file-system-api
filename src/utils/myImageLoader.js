import loadImage from 'blueimp-load-image/js';

export const loadFile = (file) => {
  return loadImage(
    file, 
    (image, data) => {
      // console.log(image)
      // console.log(data)
    },   
    { meta: true }
  )
};
