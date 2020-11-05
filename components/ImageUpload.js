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

  const onImageSave = (event) => {
    event.preventDefault();
    let dataImageFromProject = props.onSaveImages();
    console.log("images", dataImageFromProject)
    return dataImageFromProject
  }

  return (
    <Box>
      <ImageUploading
        multiple
        value={images}
        onChange={handleChange}
        onSaveImages={onImageSave}
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
              style={isDragging ? { color: "red" } : null, {marginRight:"15px"}}
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
            style={{marginRight:"15px"}}
            color="danger"
            onClick={(e) => {
              e.preventDefaut()
                onImageRemoveAll(e)
            }}>Remove all images</Button>
            {imageList.map((image, index) => (
              <Control key={index} className="image-item">
                <Box style={{width: "100%", display: "flex"}}>
                  <img style={{maxWidth:"200px"}} src={image.data_url} alt="" width="100%" max-width="150" height="auto" />
                  <div className="image-item__btn-wrapper">
                    <Button
                      color="info"
                      style={{marginBottom: '15px'}}
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
                </Box>
              </Control>
            ))}
            <Button
            color="success"
            onClick={onImageSave}>Sauvegarder</Button>
          </Field>
        )}
      </ImageUploading>
      </Box>
  );
}

export default ImageUploads