import React , {useState} from "react";
import { Form, Box, Button } from 'react-bulma-components';
const {Field, Control, Label, Help } = Form;

import ImageUploading from "react-images-uploading";

const ImageUploads = (props, {name = "", numbers}) => {
  const [images, setImages] = useState([]);
  const [urlImageUdate, setUrlImageUpdate] = useState(props.update)
  const [urlMainImage, setUrlMainImage] = useState(props.singleimage)
  const maxNumber = props.numbers;
  console.log("urlImageUdate", urlImageUdate)
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

  // evolution single update post
  const handleChangeImage = (imageList, addUpdateIndex) => {
    // data for submit
    console.log("props", props)
    console.log(imageList, addUpdateIndex);
    let updateListState = {[props.name]:imageList}
    updateListState = updateListState[props.name]
    props.onChangeImage(updateListState)
    console.log("updateList", updateListState)
    setImages(imageList);
  };

  const onImageSave = (event) => {
    event.preventDefault();
    let dataImageFromProject
    if(props.multiple === true){
      dataImageFromProject = props.onSaveAllImages();
    }else {
      dataImageFromProject = props.onSaveImages();
    }
    console.log("images", dataImageFromProject)
    return dataImageFromProject
  }

  const onChangeTop= (e, index) => {
    e.preventDefault();
    props.onTopImage(e, index)
   // console.log(target.value)
  }

  const onChangeBottom= (e, index) => {
    e.preventDefault();
    props.onBottomImage(e, index)
    //console.log(target.value)
  }
  return (
    <Box>
      <Label>{props.name}</Label>
      <ImageUploading
        multiple
        value={images}
        onChange={props.multiple === true ? handleChangeImage : handleChange}
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

            <Label>Image Actuel</Label>
            {urlImageUdate !== undefined && urlImageUdate.map((image, index) => (
              <Control key={index} className="image-item">
                <Box style={{width: "100%", display: "flex"}}>
                  <img style={{maxWidth:"200px"}} src={image} alt="" width="100%" max-width="150" height="auto" />
                  <input type="submit"value="top"
                  onClick={(e) => {
                    e.preventDefault()
                    onChangeTop(e, index)
                    }}/>
                  <input type="submit" value="bottom" onClick={(e) => {
                    e.preventDefault()
                    onChangeBottom(e, index)
                  }} />
                </Box>
              </Control>
            ))}

          {urlMainImage &&
              <Control className="image-item">
                <Box style={{width: "100%", display: "flex"}}>
                  <img style={{maxWidth:"200px"}} src={urlMainImage} alt="" width="100%" max-width="150" height="auto" />
                </Box>
              </Control>
          }
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