import React , {useState, useRef, useEffect} from "react";
import { Form, Box, Button } from 'react-bulma-components';
//import { findIndex } from "./find-index";
import { usePositionReorder } from "./use-position-reorder";
import { useMeasurePosition } from "./use-measure-position";
import { motion, useMotionValue } from 'framer-motion'
import move from "array-move"
const {Field, Control, Label, Help } = Form;

import ImageUploading from "react-images-uploading";
import { getPositioningCSS } from "nprogress";

const onTop = { zIndex: 2};
const flat = {
  zIndex: 0,
  transition: { delay: 0.3 }
};
// const positions = useRef().current;
const ImageItem = ({ i, height, updatePosition, updateOrder, onChangeBottom, onChangeTop, onDragArray}) => {
  const [isDraggingDrag, setDraggingDrag] = useState(false);
  // We'll use a `ref` to access the DOM element that the `motion.li` produces.
  // This will allow us to measure its height and position, which will be useful to
  // decide when a dragging element should switch places with its siblings.
  const ref = useMeasurePosition((pos) => updatePosition(i, pos));

  useEffect(() => {
    console.log("ref", ref)
  }, [ref])
  return (
    <div
      style={{
        padding: 0,
        height,
        position: "relative",
        // height : ref.current ? ref.current.offsetHeight : "",
        // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
        zIndex: isDraggingDrag ? 3 : 1
      }}
    >
    <motion.div
        className="dragItemImage"
        ref={ref}
        layout
        initial={false}
        style={{
          background: "white",
          height,
          borderRadius: 5
        }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0px 3px 3px rgba(0,0,0,0.15)"
        }}
        whileTap={{
          scale: 1.12,
          boxShadow: "0px 5px 5px rgba(0,0,0,0.1)"
        }}
        drag="y"
        onDragStart={() => setDraggingDrag(true)}
        onDragEnd={() => {
          setDraggingDrag(false)
          onDragArray()
        }}
        onViewportBoxUpdate={(_viewportBox, delta) => {
          if(isDraggingDrag){
            updateOrder(i, delta.y.translate);
          }
        }}
        >
        <Control className="image-item">
          <Box style={{width: "100%", display: "flex"}}>
            <img style={{maxWidth:"200px"}} src={height} alt="" width="100%" max-width="150" height="auto" />
            <Control>
              <Button
                className="controlsButton"
                type="submit"
              onClick={(e) => {
                e.preventDefault()
                onChangeTop(e, i)
                }}> Tops
                </Button>
              <Button
                className="controlsButton"
                type="submit"
                onClick={(e) => {
                e.preventDefault()
                onChangeBottom(e, i)
              }}>Bottom</Button>
              <Button
              onClick={(e) => {
                e.preventDefault()
                console.log("index img", i)
              }}
              className="controlsButton deletedButton">
                Delete
              </Button>
              </Control>
            </Box>
        </Control>
        </motion.div>
        </div>
  )
}

const ImageUploads = (props, {name = "", numbers }) => {
  const [images, setImages] = useState([]);
  const [urlImageUdate, setUrlImageUpdate] = useState(props.update)
  const [urlMainImage, setUrlMainImage] = useState(props.singleimage)
  const [imgs, setImgs] = useState(props.update);
  const [position, setPos] = useState([])
  const [order, updatePosition, updateOrder] = usePositionReorder(urlImageUdate);
  // let positions = position;

  const maxNumber = props.numbers;

  useEffect(() => {
    console.log("urlImageUdate", urlImageUdate)
  }, [urlImageUdate])

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
    props.onTopImage(e, index, order)
    setUrlImageUpdate(order)
   // console.log(target.value)
  }

  const onChangeBottom= (e, index) => {
    e.preventDefault();
    props.onBottomImage(e, index, order)
    setUrlImageUpdate(order)
    //console.log(target.value)
  }

  const onDragArray = () => {
    props.onDragArray(order)
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
          <Field  className="upload__image-wrapper">
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
            <motion.div>
            {urlImageUdate !== undefined && order.map((image, index) => (
                <ImageItem
                  key={image}
                  height={image}
                  i={index}
                  updatePosition={updatePosition}
                  updateOrder={updateOrder}
                  onChangeBottom={(e) => {onChangeBottom(e, index)}}
                  onChangeTop={(e) => {onChangeTop(e, index)}}
                  onDragArray={onDragArray}
                />
            ))}
          </motion.div>
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

const items = [290, 290, 290, 100];

export default ImageUploads