import React, { useRef } from 'react'
import { Form, Box } from 'react-bulma-components';
const { Select, Field,Control, Label,} = Form;

// selected={option === getref ? 'selected' : ''}

const Selects = ({props, onChange, name, list = [], valueoption, ...rest }) => {
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
                </Control>
            </Field>
        </Box>)
}

export default Selects