const SelectRole = ({onChange, role}) => {
    return (
        <select onChange={onChange}>
        {role.map((option, i)=> (
            <option key={i} name={option} value={option}>
                {option}
            </option>
        ))}
        </select>
    )
}

export default SelectRole