import { useState, useRef, useEffect } from "react";
import { clamp, distance } from "popmotion";
import move from "array-move";

let items;
const usePositionReorder = (initialState) => {
  const [order, setOrder] = useState(initialState);
const  [arraydrag, setArrayDrag] = useState(items)
  // We need to collect an array of height and position data for all of this component's
  // `Item` children, so we can later us that in calculations to decide when a dragging
  // `Item` should swap places with its siblings.

  const positions = useRef([]).current;
  const updatePosition = (i, offset) => (positions[i] = offset);

  // Find the ideal index for a dragging item based on its position in the array, and its
  // current drag offset. If it's different to its current index, we swap this item with that
  // sibling.
let targetIndex;

  const updateOrder = (i, dragOffset) => {
 targetIndex = findIndex(i, dragOffset, positions, order);
 console.log(targetIndex !== i)
        if (targetIndex !== i) {
            console.log("items", items)
            setOrder(move(items))
        };
};
  useEffect(() => {


console.log("isschangiiinnnngg")

}, [items])


  return [order, updatePosition, updateOrder];
}

const buffer = 30;

const findIndex = (i, yOffset, positions, order) => {
  let target = i;
  const { top, height } = positions[i];
  const bottom = top + height;

  // If moving down
  if (yOffset > 0) {
    const nextItem = positions[i + 1];
    if (nextItem === undefined) return i;

    const swapOffset =
      distance(bottom, nextItem.top + nextItem.height / 2) + buffer;
    if (yOffset > swapOffset) {
         target = i + 1;

         let reorder = order
         if(i !== reorder.length -1){
             let tmp = reorder[i]
             let endReorder = reorder.splice(i + 1, 1, tmp)
             let resort =  reorder.splice(i, 1, endReorder[0])
             items = reorder
             console.log("reorder", reorder)
             console.log("resort", resort)
         }
    }

    // If moving up
  } else if (yOffset < 0) {
    const prevItem = positions[i - 1];
    if (prevItem === undefined) return i;

    const prevBottom = prevItem.top + prevItem.height;
    const swapOffset = distance(top, prevBottom - prevItem.height / 2) + buffer;
    if (yOffset < -swapOffset) {
        target = i - 1;

        let reorder = order
         if(i !== 0){
             let tmp = reorder[i]
             let endReorder = reorder.splice(i - 1, 1, tmp)
             let resort =  reorder.splice(i, 1, endReorder[0])
             items = reorder
             console.log("reorder", reorder)
             console.log("resort", resort)
         }
    }
  }

  return clamp(0, positions.length, target);
};

export {
    usePositionReorder
}
