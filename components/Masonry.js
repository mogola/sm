import {useEffect} from 'react'
import { Button, Container, Content, Image, Media, Card, Heading, Box, Loader, Tag, Form, Columns } from 'react-bulma-components';

const Masonry = ({children = []}) => {

    const gridMasonry = () => {
        let grids = [...document.querySelectorAll('.containerMas')];

            if(grids.length && getComputedStyle(grids[0]).gridTemplateRows !== 'masonry') {
                grids = grids.map(grid => ({
                _el: grid,
                gap: parseFloat(getComputedStyle(grid).gridRowGap),
                items: [...grid.childNodes].filter(c => c.nodeType === 1),
                ncol: 0
                }));

                function layout() {
                grids.forEach(grid => {
                    /* get the post relayout number of columns */
                    console.log("grid el", grid._el, grid.gap)
                    let ncol = getComputedStyle(grid._el).gridTemplateColumns.split(' ').length;
                    console.log("ncol", ncol)
                    /* if the number of columns has changed */
                    if(grid.ncol !== ncol) {
                        /* update number of columns */
                        grid.ncol = ncol;

                        /* revert to initial positioning, no margin */
                        grid.items.forEach(c => c.style.removeProperty('margin-top'));

                        /* if we have more than one column */
                        if(grid.ncol > 1) {
                        grid.items.slice(ncol).forEach((c, i) => {

                            let prev_fin = grid.items[i].getBoundingClientRect().bottom /* bottom edge of item above */,
                                curr_ini = c.getBoundingClientRect().top /* top edge of current item */;
                            c.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`
                        })
                        }
                    }
                    })
                }

                addEventListener('load', e => {
                console.log("dom ready")
                layout(); /* initial load */
                addEventListener('resize', layout, false)
                }, false);
            }
            else console.log('yay, do nothing!')
      }

      useEffect(() => {
        gridMasonry()
      }, [])

    if(children.length === 0){
        return (<></>)
    }
    return (
        <>
        <Container className="containerMas">
          {children.map((item, i) => (
              <img key={i} src={item} />
            ))}
          </Container>
        </>
    )
}

export default Masonry