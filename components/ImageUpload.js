import React , {useState, useRef, useEffect} from "react";
import { Form, Box, Button } from 'react-bulma-components';
import { findIndex } from "./find-index";
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
const ImageItem = ({ setPosition, image, moveItem, i, onChangeBottom, onChangeTop}) => {
  const [isDraggingDrag, setDraggingDrag] = useState(false);
  const [heights, setHeights] = useState()
  // We'll use a `ref` to access the DOM element that the `motion.li` produces.
  // This will allow us to measure its height and position, which will be useful to
  // decide when a dragging element should switch places with its siblings.
  const ref = useRef(null);

  // By manually creating a reference to `dragOriginY` we can manipulate this value
  // if the user is dragging this DOM element while the drag gesture is active to
  // compensate for any movement as the items are re-positioned.
  const dragOriginY = useMotionValue(0);

  // Update the measured position of the item so we can calculate when we should rearrange.
  useEffect(() => {
    setPosition(i, {
      height: ref.current.offsetHeight,
      top: ref.current.offsetTop
    });

    setHeights(ref.current.offsetHeight)

    console.log("isDraggindDrag", isDraggingDrag)
  }, [image]);

  return (
    <motion.div
        className="dragItemImage"
        ref={ref}
        initial={false}
        // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
        animate={isDraggingDrag ? onTop : flat}
        style={{height: heights, zIndex: isDraggingDrag ? 1 : 0 }}
        // dragConstraints={constraintsRef}
        dragPropagation
        dragConstraints={{ top: 0, bottom: 0 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 1.12 }}
        whileTap={{ cursor: "grabbing" }}
        drag="y"
        dragOriginY={dragOriginY}
        dragElastic={0.5}
        onDragStart={(e) => {
          e.stopPropagation()
          e.preventDefault()
          console.log(isDraggingDrag)
          setDraggingDrag(true)
          setHeights(ref.current.offsetHeight)
        }}
        onDragEnd={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setDraggingDrag(false)
        }}
        onDrag={(e, info) => {
          setDraggingDrag(true)
          setHeights(ref.current.offsetHeight)
          console.log('point y ',info,  info.offset.y)
          moveItem(i, info.offset.y)}}
        positionTransition={({ delta }) => {
          console.log("===========================================", isDraggingDrag)
          if (isDraggingDrag) {
            // If we're dragging, we want to "undo" the items movement within the list
            // by manipulating its dragOriginY. This will keep the item under the cursor,
            // even though it's jumping around the DOM.
            dragOriginY.set(dragOriginY.get() + delta.y);
            console.log("referre", ref[i].current)
          }

          // If `positionTransition` is a function and returns `false`, it's telling
          // Motion not to animate from its old position into its new one. If we're
          // dragging, we don't want any animation to occur.
          return !isDraggingDrag;
        }}
        >
        <Control className="image-item">
          <Box style={{width: "100%", display: "flex"}}>
            <img style={{maxWidth:"200px"}} src={image} alt="" width="100%" max-width="150" height="auto" />
            <input type="submit"value="top"
            onClick={(e) => {
              e.preventDefault()
              onChangeTop(e, i)
              }}/>
            <input type="submit" value="bottom" onClick={(e) => {
              e.preventDefault()
              onChangeBottom(e, i)
            }} />
          </Box>
        </Control>
        </motion.div>
  )
}

const ImageUploads = (props, {name = "", numbers }) => {
  const [images, setImages] = useState([]);
  const [urlImageUdate, setUrlImageUpdate] = useState(props.update)
  const [urlMainImage, setUrlMainImage] = useState(props.singleimage)
  const [imgs, setImgs] = useState(props.update);
  const [position, setPos] = useState([])

  let positions = position;
  //const positions = useRef([]).current;
  console.log(position)
  const setPosition = (i, offset) => (positions[i] = offset);
  // Spring configs


  const moveItem = (i, dragOffset) => {
    const targetIndex = findIndex(i, dragOffset, position);
    if (targetIndex !== i) setUrlImageUpdate(move(urlImageUdate, i, targetIndex));
  };

  // let positions = position;

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
  const constraintsRef = useRef(null)
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
            <motion.div ref={constraintsRef}>
            {urlImageUdate !== undefined && urlImageUdate.map((image, index) => (
                <ImageItem
                  key={index}
                  i={index}
                  image={image}
                  setPosition={setPosition}
                  moveItem={moveItem}
                  onChangeBottom={(e) => {onChangeBottom(e, index)}}
                  onChangeTop={(e) => {onChangeTop(e, index)}}
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

export default ImageUploads