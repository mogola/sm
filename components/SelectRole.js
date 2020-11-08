import React, { useRef } from 'react'
import { Form } from 'react-bulma-components';
const { Select } = Form;

//                     selected={option === getref ? 'selected' : ''}
const SelectRole = ({ onChange, usercurrent, role, valueoption, ...rest }) => {
    return (
        <select defaultValue={usercurrent} name="role" onChange={onChange}>
            {role.map((option, i) => (
                <option
                    key={i}
                    name={option}
                    {...rest}
                >
                    {option}
                </option>
            ))}
        </select>
    )
}

export default SelectRole