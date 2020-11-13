import React, { useRef } from 'react'
import { Form, Box, Button} from 'react-bulma-components';
const { Select, Field,Control, Label} = Form;

// selected={option === getref ? 'selected' : ''}

const Selects = ({props, addtag, onChange, name, onClick, list = [], valueoption, ...rest }) => {
        return (<Box style={{marginBottom: "10px"}}>
            <Field>
                <Control>
                        <Label htmlFor={name} className="sub-label label">{name}</Label>
                        <Select
                            name={name}
                            onChange={onChange}
                            {...rest}
                        >
                            {list.map((option, i) => (
                                <option
                                    key={i}
                                    name={option}
                                >
                                    {option}
                                </option>
                            ))}
                        </Select>
                        {addtag && name === 'listCategory' && <Button
                            onClick={onClick}
                        >Ajouter</Button>}
                </Control>
            </Field>
        </Box>)
}

export default Selects