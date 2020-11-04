import React , {useState} from "react";
import { Form, Box, Button } from 'react-bulma-components';
const {Field, Control, Label, Help } = Form;

import ImageUploading from "react-images-uploading";

const ImageUploads = (props, {name = "", state}) => {
  const [images, setImages] = useState([]);
  const maxNumber = 69;

  const handleChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log("props", props)
    console.log(imageList, addUpdateIndex);
    let updateListState = {[props.name]:imageList}
    updateListState = updateListState[props.name]
    props.onChange(updateListState)
    console.log("updateList", updateListState)
    setImages(imageList);
  };

  return (
      <ImageUploading
        multiple
        value={images}
        onChange={handleChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <Field className="upload__image-wrapper">
            <Button
                color="info"
                name={name}
              style={isDragging ? { color: "red" } : null}
              onClick={(e) => {
                  e.preventDefault()
                  onImageUpload()
                }}
              {...dragProps}
            >
              Click or Drop here
            </Button>
            &nbsp;
            <Button
            color="danger"
            onClick={() => {
                onImageRemoveAll()
            }}>Remove all images</Button>
            {imageList.map((image, index) => (
              <Control key={index} className="image-item">
                <img style={{maxWidth:"200px"}} src={image.data_url} alt="" width="100%" max-width="150" height="auto" />
                <div className="image-item__btn-wrapper">
                  <Button
                    color="info"
                    onClick={(e) => {
                      e.preventDefault()
                      onImageUpdate(index)
                    }}>Update</Button>
                  <Button
                    color="danger"
                    onClick={(e) => {
                      e.preventDefault()
                      onImageRemove(index)}
                    }>Remove</Button>
                </div>
              </Control>
            ))}
          </Field>
        )}
      </ImageUploading>
  );
}

export default ImageUploads